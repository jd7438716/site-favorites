#Requires -Version 5.1
<#
.SYNOPSIS
    自动计算版本号、更新 manifest 版本、提交并推送 Git 标签，触发 GitHub Release 打包。

.DESCRIPTION
    标签格式: v{年份差}.{月日}.{序号}
    - 年份差 = 当前年份 - 2025
    - 月日   = MMDD
    - 序号   = 当天同前缀标签的递增序号（01 开始）

    manifest.json 的 version 会写成去掉 v 前缀后的版本号，例如标签 v1.0531.01 对应版本 1.0531.01
#>

$ErrorActionPreference = 'Stop'

function Assert-GitOk {
    git rev-parse --is-inside-work-tree *> $null
    if ($LASTEXITCODE -ne 0) { throw "当前目录不是 Git 仓库。" }

    $status = git status --porcelain
    if ($status) {
        throw "工作区不干净，请先提交或清理变更后再执行。"
    }
}

function Update-ManifestVersion([string]$manifestPath, [string]$nextVersion) {
    if (-not (Test-Path $manifestPath)) { throw "未找到 manifest.json: $manifestPath" }
    $raw = Get-Content -Raw -Encoding UTF8 $manifestPath
    $nextRaw = [regex]::Replace(
        $raw,
        '"version"\s*:\s*"[^"]+"',
        ('"version": "' + $nextVersion + '"'),
        [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
    )
    if ($nextRaw -eq $raw) { throw "manifest.json version 字段更新失败。" }
    Set-Content -Path $manifestPath -Value $nextRaw -Encoding UTF8
}

Assert-GitOk

$now       = Get-Date
$yearDiff  = $now.Year - 2025
$datePart  = $now.ToString('MMdd')
$tagPrefix = "v$yearDiff.$datePart."

Write-Host "正在获取标签列表..." -ForegroundColor Cyan

$oldEAP = $ErrorActionPreference
$ErrorActionPreference = 'SilentlyContinue'
git fetch --tags origin 2>$null | Out-Null
$fetchOk = $LASTEXITCODE -eq 0
$ErrorActionPreference = $oldEAP

if (-not $fetchOk) {
    Write-Host ""
    Write-Host "警告：无法连接远程仓库获取最新标签，将使用本地标签继续计算..." -ForegroundColor Yellow
    Write-Host ""
}

$allTags = git tag -l "$($tagPrefix)*" 2>$null
$allTags = @($allTags) | Where-Object { $_ -match "^$([regex]::Escape($tagPrefix))\d+$" }

$nextSeq = 1
if ($allTags) {
    $maxSeq = $allTags | ForEach-Object {
        $_.Substring($tagPrefix.Length) -as [int]
    } | Measure-Object -Maximum | Select-Object -ExpandProperty Maximum
    $nextSeq = $maxSeq + 1
}

$newTag = $tagPrefix + ([int]$nextSeq).ToString('00')
$newVersion = $newTag.Substring(1)

Write-Host ""
Write-Host "即将创建并推送标签: " -NoNewline
Write-Host $newTag -ForegroundColor Green
Write-Host "对应扩展版本: " -NoNewline
Write-Host $newVersion -ForegroundColor Green
Write-Host ""

$manifestPath = Join-Path (Get-Location) 'manifest.json'
Update-ManifestVersion -manifestPath $manifestPath -nextVersion $newVersion

git add manifest.json
git commit -m "chore(release): $newTag"

git tag $newTag
git push origin HEAD
git push origin $newTag

$remoteUrl = git remote get-url origin 2>$null
$repoPath  = if ($remoteUrl -match '[:/]([^/]+/[^/]+?)(?:\.git)?$') { $Matches[1] } else { '<owner>/<repo>' }

Write-Host ""
Write-Host "已推送：提交 + 标签，GitHub Actions 将自动生成 Release 资产。" -ForegroundColor Green
Write-Host "仓库：" -NoNewline
Write-Host " https://github.com/$repoPath" -ForegroundColor Yellow

