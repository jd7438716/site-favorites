(function () {
  const ROOT_ID = "__site_fav_root__";
  if (document.getElementById(ROOT_ID)) return;

  const host = document.createElement("div");
  host.id = ROOT_ID;
  host.style.all = "initial";
  host.style.position = "fixed";
  host.style.zIndex = "2147483647";
  host.style.inset = "0";
  host.style.pointerEvents = "none";
  document.documentElement.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host {
      all: initial;
    }
    .dock {
      position: fixed;
      top: 120px;
      right: 0;
      width: 36px;
      padding: 6px 0;
      border-radius: 10px 0 0 10px;
      background: rgba(25, 118, 210, 0.75);
      box-shadow: 0 6px 18px rgba(0,0,0,0.22);
      display: grid;
      gap: 6px;
      cursor: pointer;
      user-select: none;
      pointer-events: auto;
      opacity: 0.35;
      transition: opacity 120ms ease;
    }
    .dock:hover {
      opacity: 1;
    }
    .dockBtn {
      all: unset;
      cursor: pointer;
      width: 36px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    .dockBtn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    .dockBtn.pending svg {
      animation: spin 700ms linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .sidebar {
      position: fixed;
      top: 0;
      right: 0;
      height: 100vh;
      width: 360px;
      background: rgba(255, 255, 255, 0.98);
      border-left: 1px solid rgba(0,0,0,0.12);
      box-shadow: -8px 0 24px rgba(0,0,0,0.18);
      transform: translateX(100%);
      transition: transform 160ms ease;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, "PingFang SC", "Microsoft Yahei", sans-serif;
      color: #111;
    }
    .sidebar.open {
      transform: translateX(0);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 12px 12px 10px;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .titleBox {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .domain {
      font-size: 12px;
      color: rgba(0,0,0,0.6);
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 230px;
    }
    .h1 {
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      margin-top: 2px;
    }
    button {
      all: unset;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 10px;
      font-size: 12px;
      line-height: 16px;
      background: rgba(0,0,0,0.06);
    }
    button:hover {
      background: rgba(0,0,0,0.1);
    }
    .primary {
      background: rgba(25,118,210,0.12);
      color: rgb(25,118,210);
      font-weight: 600;
    }
    .primary:hover {
      background: rgba(25,118,210,0.18);
    }
    .danger {
      background: rgba(220,0,0,0.1);
      color: rgb(180, 0, 0);
      font-weight: 600;
    }
    .danger:hover {
      background: rgba(220,0,0,0.16);
    }
    .searchBox {
      padding: 10px 12px;
      border-bottom: 1px solid rgba(0,0,0,0.06);
    }
    input {
      all: unset;
      display: block;
      width: 100%;
      padding: 9px 10px;
      border-radius: 12px;
      background: rgba(0,0,0,0.06);
      font-size: 13px;
      line-height: 18px;
      box-sizing: border-box;
    }
    input:focus {
      background: rgba(0,0,0,0.08);
    }
    .list {
      flex: 1;
      overflow: auto;
      padding: 10px 8px 14px;
    }
    .empty {
      padding: 14px 10px;
      color: rgba(0,0,0,0.55);
      font-size: 13px;
    }
    .item {
      padding: 10px 10px;
      border-radius: 14px;
      background: rgba(0,0,0,0.03);
      margin: 0 4px 10px;
      display: grid;
      gap: 6px;
    }
    .item:hover {
      background: rgba(0,0,0,0.06);
    }
    .itemRow {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 10px;
      min-width: 0;
    }
    .itemMain {
      min-width: 0;
      flex: 1;
    }
    .itemTitle {
      font-size: 13px;
      font-weight: 600;
      line-height: 18px;
    }
    .itemTitle a {
      all: unset;
      cursor: pointer;
      color: inherit;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      word-break: break-word;
    }
    .itemActions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }
    .iconBtn {
      all: unset;
      cursor: pointer;
      width: 28px;
      height: 28px;
      border-radius: 10px;
      background: rgba(0,0,0,0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(0,0,0,0.7);
    }
    .iconBtn:hover {
      background: rgba(0,0,0,0.1);
    }
    .iconBtn svg {
      width: 18px;
      height: 18px;
      fill: currentColor;
    }
    .iconBtnDanger {
      background: rgba(220,0,0,0.10);
      color: rgb(180, 0, 0);
    }
    .iconBtnDanger:hover {
      background: rgba(220,0,0,0.16);
    }
    .iconBtnPrimary {
      background: rgba(25,118,210,0.12);
      color: rgb(25,118,210);
    }
    .iconBtnPrimary:hover {
      background: rgba(25,118,210,0.18);
    }
    .itemEditRow {
      display: grid;
      gap: 8px;
      margin-top: 4px;
    }
    .itemEditRow input {
      background: rgba(0,0,0,0.05);
      border-radius: 12px;
      padding: 8px 10px;
      font-size: 12px;
    }
    .toast {
      position: fixed;
      top: 12px;
      right: 12px;
      background: rgba(17,17,17,0.88);
      color: rgba(255,255,255,0.95);
      padding: 8px 10px;
      border-radius: 12px;
      font-size: 12px;
      line-height: 16px;
      pointer-events: none;
      opacity: 0;
      transform: translateY(-4px);
      transition: opacity 140ms ease, transform 140ms ease;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;

  shadow.appendChild(style);

  const dock = document.createElement("div");
  dock.className = "dock";

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "dockBtn";

  const addBtn = document.createElement("button");
  addBtn.className = "dockBtn";

  dock.appendChild(toggleBtn);
  dock.appendChild(addBtn);

  const toast = document.createElement("div");
  toast.className = "toast";

  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";
  sidebar.innerHTML = `
    <div class="header">
      <div class="titleBox">
        <div class="domain" id="sf_domain"></div>
        <div class="h1">收藏</div>
      </div>
    </div>
    <div class="searchBox">
      <input id="sf_search" placeholder="搜索标题 / URL" />
    </div>
    <div class="list" id="sf_list"></div>
  `;

  shadow.appendChild(dock);
  shadow.appendChild(sidebar);
  shadow.appendChild(toast);

  const elDomain = shadow.getElementById("sf_domain");
  const elSearch = shadow.getElementById("sf_search");
  const elList = shadow.getElementById("sf_list");

  const STORAGE_KEY = "sf_bookmarks_by_domain_v1";
  const POS_KEY = "sf_fab_pos_v1";

  function now() {
    return Date.now();
  }

  function uuid() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
    return String(now()) + "_" + String(Math.random()).slice(2);
  }

  function getHostname() {
    try {
      return location.hostname || "unknown";
    } catch {
      return "unknown";
    }
  }

  function getShortDomain(domain) {
    if (!domain) return "";
    const parts = domain.split(".").filter(Boolean);
    if (parts.length <= 2) return domain;
    const last = parts[parts.length - 1];
    const prev = parts[parts.length - 2];
    const specialCn = last === "cn" && ["com", "net", "org", "gov", "edu"].includes(prev);
    const keep = specialCn ? 3 : 2;
    return parts.slice(-keep).join(".");
  }

  function storageGet(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (res) => resolve(res[key]));
    });
  }

  function storageSet(obj) {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, () => resolve());
    });
  }

  async function getAllBookmarks() {
    const data = await storageGet(STORAGE_KEY);
    if (!data || typeof data !== "object") return {};
    return data;
  }

  async function setAllBookmarks(all) {
    await storageSet({ [STORAGE_KEY]: all });
  }

  async function getDomainBookmarks(domain) {
    const all = await getAllBookmarks();
    const list = Array.isArray(all[domain]) ? all[domain] : [];
    return { all, list };
  }

  async function addCurrentPage() {
    const domain = getHostname();
    const { all, list } = await getDomainBookmarks(domain);
    const url = location.href;
    const title = document.title || url;
    const exists = list.some((x) => x && x.url === url);
    if (!exists) {
      list.unshift({ id: uuid(), url, title, createdAt: now() });
      all[domain] = list;
      await setAllBookmarks(all);
    }
    await render();
  }

  async function removeByUrl(domain, url) {
    const { all, list } = await getDomainBookmarks(domain);
    const next = list.filter((x) => x && x.url !== url);
    all[domain] = next;
    await setAllBookmarks(all);
    await render();
  }

  async function addByUrl(domain, url, title) {
    if (!url) return;
    const { all, list } = await getDomainBookmarks(domain);
    const exists = list.some((x) => x && x.url === url);
    if (!exists) {
      list.unshift({
        id: uuid(),
        url,
        title: title || url,
        createdAt: now(),
      });
      all[domain] = list;
      await setAllBookmarks(all);
    }
    await render();
  }

  async function deleteItem(domain, id) {
    const { all, list } = await getDomainBookmarks(domain);
    const next = list.filter((x) => x && x.id !== id);
    all[domain] = next;
    await setAllBookmarks(all);
    await render();
  }

  async function updateItem(domain, id, patch) {
    const { all, list } = await getDomainBookmarks(domain);
    const next = list.map((x) => {
      if (!x || x.id !== id) return x;
      return { ...x, ...patch };
    });
    all[domain] = next;
    await setAllBookmarks(all);
    await render();
  }

  function setToggleIcon(open) {
    toggleBtn.innerHTML = open
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.31z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2v10c0 1.1-.9 2-2 2H7zm0-2h10V6H7v10zm-1 4h12v2H6v-2z"/></svg>';
  }

  function setAddIconBookmarked(bookmarked) {
    addBtn.innerHTML = bookmarked
      ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>'
      : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15-5-2.18L7 18V5h10v13z"/></svg>';
    addBtn.style.color = bookmarked ? "#ffd54f" : "#fff";
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    const open = sidebar.classList.contains("open");
    const sidebarWidth = open ? sidebar.getBoundingClientRect().width : 0;
    toast.style.right = `${12 + Math.max(0, Math.round(sidebarWidth))}px`;
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 900);
  }

  function setSidebarOpen(open) {
    sidebar.classList.toggle("open", open);
    keepDockStuckToEdge();
    setToggleIcon(open);
  }

  function getSearchValue() {
    return (elSearch.value || "").trim().toLowerCase();
  }

  function matchItem(item, q) {
    if (!q) return true;
    const title = (item.title || "").toLowerCase();
    const url = (item.url || "").toLowerCase();
    return title.includes(q) || url.includes(q);
  }

  let editingId = null;

  function normalizeUrl(url) {
    if (!url) return "";
    try {
      return new URL(url, location.href).toString();
    } catch {
      return "";
    }
  }

  function formatListItem(item, domain) {
    const wrapper = document.createElement("div");
    wrapper.className = "item";

    const row = document.createElement("div");
    row.className = "itemRow";

    const main = document.createElement("div");
    main.className = "itemMain";

    const title = document.createElement("div");
    title.className = "itemTitle";
    const titleLink = document.createElement("a");
    titleLink.href = item.url || "#";
    titleLink.target = "_blank";
    titleLink.rel = "noopener noreferrer";
    titleLink.textContent = item.title || item.url || "";
    title.appendChild(titleLink);
    main.appendChild(title);

    const actions = document.createElement("div");
    actions.className = "itemActions";

    const editBtn = document.createElement("button");
    editBtn.className = "iconBtn iconBtnPrimary";
    editBtn.innerHTML =
      editingId === item.id
        ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71 12 12l6.3 6.29-1.41 1.42L10.59 13.4 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29 10.59 10.6l6.3-6.31z"/></svg>'
        : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>';
    editBtn.addEventListener("click", () => {
      editingId = editingId === item.id ? null : item.id;
      render();
    });

    const delBtn = document.createElement("button");
    delBtn.className = "iconBtn iconBtnDanger";
    delBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
    delBtn.addEventListener("click", () => {
      deleteItem(domain, item.id);
      if (item.url === location.href) showToast("已移除");
    });

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    row.appendChild(main);
    row.appendChild(actions);
    wrapper.appendChild(row);
    if (editingId === item.id) {
      const editRow = document.createElement("div");
      editRow.className = "itemEditRow";

      const titleInput = document.createElement("input");
      titleInput.value = item.title || "";
      titleInput.placeholder = "标题";

      const urlInput = document.createElement("input");
      urlInput.value = item.url || "";
      urlInput.placeholder = "URL";

      const saveBtn = document.createElement("button");
      saveBtn.className = "iconBtn iconBtnPrimary";
      saveBtn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 16.17 4.83 12 3.41 13.41 9 19l12-12-1.41-1.41z"/></svg>';
      saveBtn.addEventListener("click", () => {
        const nextUrl = normalizeUrl(urlInput.value.trim());
        const nextTitle = titleInput.value.trim() || nextUrl || item.url;
        if (!nextUrl) return;
        editingId = null;
        updateItem(domain, item.id, { url: nextUrl, title: nextTitle });
      });

      editRow.appendChild(titleInput);
      editRow.appendChild(urlInput);
      editRow.appendChild(saveBtn);
      wrapper.appendChild(editRow);
    }
    return wrapper;
  }

  async function render() {
    const domain = getHostname();
    elDomain.textContent = getShortDomain(domain);

    const { list } = await getDomainBookmarks(domain);
    const isBookmarked = list.some((x) => x && x.url === location.href);
    setAddIconBookmarked(isBookmarked);

    const q = getSearchValue();
    const items = list.filter((x) => x && matchItem(x, q));

    elList.textContent = "";
    if (!items.length) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = list.length
        ? "没有匹配结果"
        : "本站还没有收藏（可将链接拖动到这里快速添加）";
      elList.appendChild(empty);
      return;
    }

    for (const item of items) {
      elList.appendChild(formatListItem(item, domain));
    }
  }

  async function refreshCurrentPageStatus() {
    const domain = getHostname();
    const { list } = await getDomainBookmarks(domain);
    const isBookmarked = list.some((x) => x && x.url === location.href);
    setAddIconBookmarked(isBookmarked);
  }

  function clamp(num, min, max) {
    return Math.max(min, Math.min(max, num));
  }

  function getDockRect() {
    return dock.getBoundingClientRect();
  }

  function setDockTop(top) {
    dock.style.top = `${top}px`;
  }

  function keepDockStuckToEdge() {
    const open = sidebar.classList.contains("open");
    const sidebarWidth = open ? sidebar.getBoundingClientRect().width : 0;
    dock.style.right = `${Math.max(0, Math.round(sidebarWidth))}px`;
    dock.style.left = "";
  }

  async function loadDockPos() {
    const pos = await storageGet(POS_KEY);
    if (!pos || typeof pos !== "object") return;
    if (typeof pos.top === "number") setDockTop(pos.top);
  }

  async function saveDockPos() {
    const rect = getDockRect();
    await storageSet({ [POS_KEY]: { top: rect.top } });
  }

  let dragging = false;
  let dragMoved = false;
  let dragOffsetY = 0;
  let rafId = 0;
  let lastClientY = 0;
  let startClientY = 0;

  function onPointerMove(e) {
    if (!dragging) return;
    lastClientY = e.clientY;
    if (Math.abs(lastClientY - startClientY) > 3) dragMoved = true;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
      rafId = 0;
      const rect = getDockRect();
      const nextTop = clamp(
        lastClientY - dragOffsetY,
        8,
        window.innerHeight - rect.height - 8
      );
      keepDockStuckToEdge();
      setDockTop(nextTop);
    });
  }

  async function onPointerUp() {
    if (!dragging) return;
    dragging = false;
    document.removeEventListener("pointermove", onPointerMove, true);
    document.removeEventListener("pointerup", onPointerUp, true);
    await saveDockPos();
  }

  dock.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    const rect = getDockRect();
    dragging = true;
    dragMoved = false;
    startClientY = e.clientY;
    dragOffsetY = e.clientY - rect.top;
    keepDockStuckToEdge();
    document.addEventListener("pointermove", onPointerMove, true);
    document.addEventListener("pointerup", onPointerUp, true);
  });

  toggleBtn.addEventListener("click", (e) => {
    if (dragMoved) return;
    e.stopPropagation();
    setSidebarOpen(!sidebar.classList.contains("open"));
    render();
  });

  let addPending = false;

  addBtn.addEventListener("click", (e) => {
    if (dragMoved) return;
    e.stopPropagation();
    if (addPending) return;
    addPending = true;
    addBtn.classList.add("pending");
    (async () => {
      const domain = getHostname();
      const { list } = await getDomainBookmarks(domain);
      const exists = list.some((x) => x && x.url === location.href);
      if (exists) {
        await removeByUrl(domain, location.href);
        showToast("已移除");
      } else {
        await addCurrentPage();
        showToast("已收藏");
      }
    })().finally(() => {
      addPending = false;
      addBtn.classList.remove("pending");
    });
  });

  elSearch.addEventListener("input", () => render());

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    },
    true
  );

  function parseDroppedLink(ev) {
    const dt = ev.dataTransfer;
    if (!dt) return null;
    const uriList = (dt.getData("text/uri-list") || "").trim();
    const plain = (dt.getData("text/plain") || "").trim();
    const html = (dt.getData("text/html") || "").trim();

    if (html) {
      try {
        const doc = new DOMParser().parseFromString(html, "text/html");
        const a = doc.querySelector("a");
        const href = a?.getAttribute("href") || "";
        const text = (a?.textContent || "").trim();
        if (href) return { url: href, title: text };
      } catch {}
    }

    const fromUriList = uriList
      .split("\n")
      .map((x) => x.trim())
      .find((x) => x && !x.startsWith("#"));

    if (fromUriList) return { url: fromUriList };

    const urlInPlain = plain.match(/https?:\/\/[^\s]+/i)?.[0];
    if (urlInPlain) return { url: urlInPlain, title: plain === urlInPlain ? "" : plain };

    return null;
  }

  elList.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  elList.addEventListener("drop", (e) => {
    e.preventDefault();
    const domain = getHostname();
    const payload = parseDroppedLink(e);
    if (!payload) return;
    const url = normalizeUrl(payload.url);
    if (!url) return;
    addByUrl(domain, url, payload.title);
    showToast("已添加");
  });

  window.addEventListener("resize", () => keepDockStuckToEdge());

  setToggleIcon(false);
  setAddIconBookmarked(false);

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") return;
    if (!changes[STORAGE_KEY]) return;
    if (sidebar.classList.contains("open")) {
      render();
      return;
    }
    refreshCurrentPageStatus();
  });

  loadDockPos().then(() => {
    keepDockStuckToEdge();
    refreshCurrentPageStatus();
  });
})();

