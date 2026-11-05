'use strict';
/* Превью редизайна админки: мок-данные в localStorage, без Firebase. */

const $ = id => document.getElementById(id);
const pad = n => String(n).padStart(2, '0');
const clock = t => {
  t = Math.max(0, Math.round(t / 1000));
  const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};
const dateStr = ts => new Date(ts).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const KINDS = {
  halloween: { name: 'Хэллоуин', emoji: '🎃', banner: 'Хэллоуин уже в игре', text: 'Собирай конфеты и крути колесо', candy: '🍬', color: '#ff8a3d', decor: '🕸️🦇🍬🎃🕷️' },
  classic: { name: 'Классика', emoji: '🔧', banner: 'Обнова уже в игре', text: 'Свежие награды ждут тебя', candy: '🎁', color: '#ffd166', decor: '✨🎉🔧⚙️🎊' },
  wheel: { name: 'Колесо', emoji: '🎡', banner: 'Колесо фортуны крутится', text: '100 билетов на кону', candy: '🎟️', color: '#5ee0b8', decor: '🎡💫🎟️🍀✨' },
  newyear: { name: 'Новый год', emoji: '❄️', banner: 'Зимний сезон открыт', text: 'Ледяные награды и снег на вкладках', candy: '🎁', color: '#7fd3ff', decor: '❄️⛄🎄✨🧊' },
  dragon: { name: 'Год Дракона', emoji: '🐉', banner: 'Дракон пробудился', text: 'Восточный сезон на кухне', candy: '🧧', color: '#ff6b6b', decor: '🐉🏮🧧🎆🥟' }
};
const PRESETS = { '24h': 24, '3d': 72, '7d': 168, '14d': 336 };
const SCREEN_PRESETS = { '5m': 300, '30m': 1800, '1h': 3600, '3h': 10800 };
const BAN_PRESETS = { '1h': 1, '24h': 24, '7d': 168, '30d': 720 };

const DEFAULTS = {
  screens: { theme: 'halloween', type: 'timer', endsAt: Date.now() + 23 * 60000 },
  updates: [
    {
      id: 'upd-hw', kind: 'halloween', title: 'Хэллоуин 2026', status: 'scheduled',
      startsAt: Date.now() + 15000, autoStopAt: null, showBanner: true, showDecor: true,
      eventOn: true, eventActive: false, eventEndsAt: null, goal: 10000, pool: 6420,
      bannerTitle: 'Хэллоуин уже в игре', bannerText: 'Собирай конфеты и крути колесо',
      lifeHours: 168, revealAt: null, createdAt: Date.now() - 86400000
    },
    {
      id: 'upd-wheel', kind: 'wheel', title: 'Колесо: сезон билетов', status: 'active',
      startsAt: Date.now() - 3600000, autoStopAt: Date.now() + 40 * 60000, showBanner: true, showDecor: false,
      eventOn: true, eventActive: true, eventEndsAt: Date.now() + 2 * 3600000, goal: 100, pool: 37,
      bannerTitle: 'Колесо крутится', bannerText: 'Каждый спин — билет к призу',
      lifeHours: 72, revealAt: null, createdAt: Date.now() - 7200000
    }
  ],
  announcements: [
    { id: 'an-1', text: 'Хэллоуин стартует в 20:00 по Москве', at: Date.now() - 3600000 * 4 },
    { id: 'an-2', text: 'Обновы на кухне: теперь конфеты падают чаще', at: Date.now() - 3600000 * 26 }
  ],
  polls: { q: 'Какой сезон следующим?', opts: [{ t: 'Новый год', v: 41 }, { t: 'Год Дракона', v: 23 }, { t: 'Весна', v: 12 }], at: Date.now() - 7200000 },
  bans: [{ id: 'bn-1', name: 'mrcheater', reason: 'накрутка кликов', until: Date.now() + 3600000 * 20 }],
  log: []
};

const KEY = 'dilig_admin_preview_v2';
let state = load();
function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    if (raw && raw.updates) return Object.assign({}, DEFAULTS, raw);
  } catch (e) { /* демо повреждено — старт с нуля */ }
  return JSON.parse(JSON.stringify(DEFAULTS));
}
let saveT = 0;
function save() { clearTimeout(saveT); saveT = setTimeout(() => localStorage.setItem(KEY, JSON.stringify(state)), 200); }

let filter = 'all', search = '', openSettings = null, playing = false;

/* ---------------- лог админки ---------------- */
function log(type, msg) {
  state.log.unshift({ t: Date.now(), type, msg });
  state.log = state.log.slice(0, 60);
  renderLog();
}
const LOGICON = { ok: '✅', warn: '⚠️', sync: '📡', err: '⛔' };
function renderLog() {
  $('logBadge').textContent = state.log.length;
  $('logBox').innerHTML = state.log.length
    ? state.log.map(l => `<div class="log-row"><span>${LOGICON[l.type] || '•'}</span><b>${dateStr(l.t)}</b> ${esc(l.msg)}</div>`).join('')
    : '<div class="empty">Пока пусто. Действия появятся здесь.</div>';
}

/* ---------------- тост и модалка ---------------- */
let toastT = 0;
function toast(msg) {
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('show'), 2600);
}
let modalOk = null;
function ask(title, text, okLabel, cb) {
  $('modal').querySelector('h3').textContent = title;
  $('modal').querySelector('p').innerHTML = text;
  $('modal').querySelector('.m-ok').textContent = okLabel;
  modalOk = cb;
  $('modalIn').className = 'modal';
  $('modal').classList.add('show');
}
function closeModal() { $('modal').classList.remove('show'); modalOk = null; }
$('modal').addEventListener('click', e => { if (e.target === $('modal') || e.target.hasAttribute('data-x')) closeModal(); });
$('modalIn').querySelector('.m-ok').addEventListener('click', () => { const cb = modalOk; closeModal(); if (cb) cb(); });

/* ---------------- навигация ---------------- */
function showView(name) {
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.dataset.view === name));
  document.querySelectorAll('.nav-btn[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  const active = document.querySelector('.nav-btn[data-view].active');
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
}
$('navLinks').addEventListener('click', e => {
  const b = e.target.closest('.nav-btn[data-view]');
  if (b) showView(b.dataset.view);
});

/* ---------------- пилюли статуса ---------------- */
function setPill(el, txtEl, tone, text) {
  el.className = 'pill ' + tone;
  txtEl.textContent = text;
}
function renderPills() {
  const live = state.updates.filter(u => u.status === 'active');
  const soon = state.updates.filter(u => u.status === 'scheduled');
  if (live.length) setPill($('pillUpd'), $('pillUpdT'), 'good', `Обнов в игре: ${live.length}`);
  else if (soon.length) setPill($('pillUpd'), $('pillUpdT'), 'warn', `СИНХРО: ${soon.length}`);
  else setPill($('pillUpd'), $('pillUpdT'), 'off', 'Обнов нет');

  const scr = state.screens;
  if (scr.type === 'infinite') setPill($('pillScr'), $('pillScrT'), 'bad', 'Работы идут');
  else if (scr.endsAt > Date.now()) setPill($('pillScr'), $('pillScrT'), 'warn', `Работы: ${clock(scr.endsAt - Date.now())}`);
  else setPill($('pillScr'), $('pillScrT'), 'good', 'Игра открыта');

  $('ncUpd').textContent = live.length + soon.length;
  $('ncScr').textContent = scr.type === 'infinite' || scr.endsAt > Date.now() ? 1 : 0;
  $('ncEvt').textContent = state.updates.filter(u => u.eventActive).length;
}

/* ---------------- раздел «Обновы» ---------------- */
function updStatus(u) {
  if (u.status === 'active') {
    if (u.autoStopAt && Date.now() > u.autoStopAt) { u.status = 'ended'; u.eventActive = false; }
  }
  if (u.status === 'scheduled' && Date.now() >= u.startsAt) activate(u.id, true);
  return u.status;
}
const STATUS_META = {
  active: ['good', 'В ИГРЕ'], scheduled: ['warn', 'СИНХРО'], ended: ['off', 'СКРЫТО'], off: ['off', 'ВЫКЛ']
};

function cardUpd(u) {
  const k = KINDS[u.kind];
  const [tone, label] = STATUS_META[updStatus(u)];
  const left = u.status === 'scheduled' ? u.startsAt - Date.now()
    : u.status === 'active' && u.autoStopAt ? u.autoStopAt - Date.now() : null;

  const sync = u.status === 'scheduled'
    ? `<div class="upd-sync"><div class="live" style="background:${k.color}"></div>
         <b>СИНХРО</b><span class="mono">появится через ${clock(left)}</span>
         <button class="btn btn-s sm" data-skip="${u.id}">Скрыть</button>
         <button class="btn btn-p sm" data-now="${u.id}">Показать сейчас</button></div>` : '';

  const ev = u.eventOn ? `<div class="ev-line">
        <span class="ev-ic">🎯</span>
        <span>${u.eventActive ? 'ивент активен' : 'ивент выключен'}</span>
        <div class="ev-prog"><i style="width:${Math.min(100, u.goal ? u.pool / u.goal * 100 : 0)}%"></i></div>
        <span class="mono">${u.pool}/${u.goal}</span>
        <button class="btn btn-s sm" data-evtoggle="${u.id}">${u.eventActive ? 'Остановить' : 'Запустить'}</button>
      </div>` : '';

  return `<article class="upd" data-card="${u.id}">
    <div class="upd-head">
      <div class="upd-ic" style="background:${k.color}22;color:${k.color}">${k.emoji}</div>
      <div style="min-width:0">
        <b>${esc(u.title)}</b>
        <small>${k.name} · ${label} · ${u.status === 'active' ? (u.autoStopAt ? 'до ${dateStr(u.autoStopAt)}' : 'до выключения') : u.status === 'scheduled' ? 'старт ${dateStr(u.startsAt)}' : 'скрыта'}</small>
      </div>
      <span class="pill ${tone}" style="margin-left:auto">${label}</span>
      <label class="sw"><input type="checkbox" data-sw="${u.id}" ${u.status === 'active' ? 'checked' : ''}><span></span></label>
    </div>
    ${sync}
    <div class="upd-meta">
      <span class="chip ${u.showBanner ? '' : 'off'}" data-chip="banner:${u.id}">📢 Баннер</span>
      <span class="chip ${u.showDecor ? '' : 'off'}" data-chip="decor:${u.id}">🕸️ Декор</span>
      <span class="chip ${u.eventOn ? '' : 'off'}" data-chip="event:${u.id}">🎯 Ивент</span>
      ${u.status === 'active' && left ? `<span class="chip">⏳ Скрыть через <b class="mono" data-left="${u.id}">${clock(left)}</b></span>` : ''}
      ${u.status === 'active' ? `<span class="chip off" data-chip="hidetimer:${u.id}">⏱ Таймер скрытия</span>` : ''}
    </div>
    ${ev}
    <div class="actions">
      <button class="btn btn-s sm" data-settings="${u.id}">${openSettings === u.id ? '▲ настройки' : '⚙ настройки'}</button>
      <button class="btn btn-s sm" data-reveal="${u.id}">▶ предпросмотр появления</button>
      ${u.status === 'scheduled' ? `<button class="btn btn-s sm" data-cancel="${u.id}">Отменить СИНХРО</button>` : ''}
      ${u.status === 'ended' || u.status === 'off' ? `<button class="btn btn-p sm" data-again="${u.id}">Включить обратно</button>` : ''}
      <button class="btn btn-g sm" style="margin-left:auto" data-del="${u.id}">🗑</button>
    </div>
    ${openSettings === u.id ? settingsUpd(u) : ''}
  </article>`;
}

function settingsUpd(u) {
  const opts = Object.entries(KINDS).map(([id, k]) => `<option value="${id}" ${id === u.kind ? 'selected' : ''}>${k.emoji} ${k.name}</option>`).join('');
  const when = u.status === 'scheduled' ? 'СИНХРО идёт' : 'сейчас';
  return `<div class="upd-set">
    <div class="fld"><label>Название</label><input data-f="title" value="${esc(u.title)}"></div>
    <div class="fld"><label>Тема</label><select data-f="kind">${opts}</select></div>
    <div class="fld"><label>Заголовок баннера</label><input data-f="bannerTitle" value="${esc(u.bannerTitle)}"></div>
    <div class="fld"><label>Текст баннера</label><input data-f="bannerText" value="${esc(u.bannerText)}"></div>
    <div class="fld"><label>Авто-скрытие</label>
      <select data-f="auto">
        <option value="none" ${!u.autoStopAt ? 'selected' : ''}>не прятать</option>
        <option value="1h">через 1 час</option>
        <option value="24h">через сутки</option>
        <option value="168h">через неделю</option>
      </select><small>текущий старт: ${when}</small></div>
    <div class="fld"><label>Цель ивента</label><input data-f="goal" type="number" min="0" value="${u.goal}"></div>
    <div class="check"><label><input type="checkbox" data-f="showBanner" ${u.showBanner ? 'checked' : ''}> показывать баннер</label></div>
    <div class="check"><label><input type="checkbox" data-f="showDecor" ${u.showDecor ? 'checked' : ''}> показывать декор вкладок</label></div>
    <div class="check"><label><input type="checkbox" data-f="eventOn" ${u.eventOn ? 'checked' : ''}> привязать ивент</label></div>
    <div class="actions"><button class="btn btn-p sm" data-save="${u.id}">Сохранить</button></div>
  </div>`;
}

function renderUpd() {
  const host = $('updList');
  let list = state.updates.slice().sort((a, b) => (b.status === 'active') - (a.status === 'active') || b.createdAt - a.createdAt);
  if (filter !== 'all') list = list.filter(u => u.status === filter);
  if (search) list = list.filter(u => (u.title + KINDS[u.kind].name).toLowerCase().includes(search));
  host.innerHTML = list.length ? list.map(cardUpd).join('') : '<div class="empty">Нет обнов под фильтр. Создай новую кнопкой «+ Новая обнова».</div>';

  const live = state.updates.filter(u => u.status === 'active');
  const first = live[0];
  const mirror = $('sysMirror');
  if (!first) mirror.innerHTML = '<span class="pill off">Обнов в игре нет — баннеры, декор и ивенты скрыты.</span>';
  else {
    const k = KINDS[first.kind];
    mirror.innerHTML = `<span class="pill ${first.eventActive ? 'good' : 'warn'}">🎃 Ивент: ${first.eventActive ? 'активен' : 'выключен'}</span>
      <span class="pill ${first.showBanner ? 'good' : 'off'}">📢 Баннеры: ${first.showBanner ? 'видны' : 'скрыты'}</span>
      <span class="pill ${first.showDecor ? 'good' : 'off'}">🕸️ Декор: ${first.showDecor ? 'на вкладках' : 'нет'}</span>
      <span class="pill ${first.autoStopAt ? 'warn' : 'off'}">⏳ ${first.autoStopAt ? 'Скроется через ' + clock(first.autoStopAt - Date.now()) : 'Без таймера скрытия'}</span>
      <span class="pill ${state.screens.endsAt > Date.now() || state.screens.type === 'infinite' ? 'bad' : 'good'}">🔧 Экран работ: тема ${KINDS[first.kind].name} ${k ? '' : ''}</span>`;
  }
}

$('updList').addEventListener('click', e => {
  const t = e.target.closest('button,[data-chip]');
  if (!t) return;
  const id = t.dataset.sw || t.dataset.settings || t.dataset.reveal || t.dataset.cancel || t.dataset.del || t.dataset.again || t.dataset.now || t.dataset.skip || t.dataset.evtoggle || t.dataset.save || (t.dataset.chip || '').split(':')[1];
  if (!id) return;
  const u = state.updates.find(x => x.id === id);
  if (!u) return;

  if (t.dataset.settings) { openSettings = openSettings === id ? null : id; renderUpd(); return; }
  if (t.dataset.reveal) { playReveal(id); return; }
  if (t.dataset.cancel) { u.status = 'off'; log('warn', `Отменён СИНХРО «${u.title}»`); renderAll(); return; }
  if (t.dataset.skip) { u.status = 'ended'; u.eventActive = false; log('warn', `«${u.title}» снята с показа`); renderAll(); return; }
  if (t.dataset.now) { u.startsAt = Date.now(); activate(id, true); return; }
  if (t.dataset.del) {
    ask('Удалить обнову?', `«${esc(u.title)}» исчезнет из списка. В игре она будет скрыта.`, 'Удалить', () => {
      state.updates = state.updates.filter(x => x.id !== id); log('warn', `Удалена обнова «${u.title}»`); renderAll();
    });
    return;
  }
  if (t.dataset.again) { u.status = 'scheduled'; u.startsAt = Date.now() + 15000; log('ok', `«${u.title}» снова в очереди: СИНХРО через 15 c (демо)`); renderAll(); return; }
  if (t.dataset.evtoggle) { toggleEvent(id); return; }
  if (t.dataset.save) { saveSettings(id); return; }
  if (t.dataset.chip) {
    const what = t.dataset.chip.split(':')[0];
    if (what === 'hidetimer') {
      u.autoStopAt = Date.now() + 60000;
      log('ok', `«${u.title}»: авто-скрытие через 60 c`);
      renderAll(); return;
    }
    u[what === 'banner' ? 'showBanner' : what === 'decor' ? 'showDecor' : 'eventOn'] = !u[what === 'banner' ? 'showBanner' : what === 'decor' ? 'showDecor' : 'eventOn'];
    if (what === 'event' && !u.eventOn) u.eventActive = false;
    log('ok', `«${u.title}»: ${what === 'banner' ? 'баннеры' : what === 'decor' ? 'декор' : 'ивент'} ${u[what === 'banner' ? 'showBanner' : what === 'decor' ? 'showDecor' : 'eventOn'] ? 'вкл' : 'выкл'}`);
    renderAll();
  }
});

$('updList').addEventListener('change', e => {
  const sw = e.target.closest('[data-sw]');
  if (!sw) return;
  const u = state.updates.find(x => x.id === sw.dataset.sw);
  if (!u) return;
  if (sw.checked) {
    u.status = 'scheduled';
    u.startsAt = Date.now() + 15000;
    log('sync', `«${u.title}»: включена, СИНХРО через 15 c (демо)`);
  } else {
    u.status = 'ended'; u.eventActive = false;
    log('warn', `«${u.title}»: выключена — баннеры, декор и ивент скрыты`);
  }
  renderAll();
});

function saveSettings(id) {
  const card = document.querySelector(`[data-card="${id}"]`);
  const u = state.updates.find(x => x.id === id);
  if (!card || !u) return;
  card.querySelectorAll('[data-f]').forEach(el => {
    const f = el.dataset.f;
    if (f === 'auto') {
      if (el.value === 'none') u.autoStopAt = null;
      else u.autoStopAt = Date.now() + { '1h': 3600000, '24h': 86400000, '168h': 604800000 }[el.value];
      return;
    }
    if (f === 'goal') { u.goal = Math.max(0, +el.value || 0); return; }
    if (el.type === 'checkbox') u[f] = el.checked;
    else u[f] = el.value;
  });
  log('ok', `Настройки «${u.title}» сохранены (в проде — запись в Firebase)`);
  openSettings = null;
  renderAll();
}

function activate(id, byTimer) {
  const u = state.updates.find(x => x.id === id);
  if (!u) return;
  u.status = 'active';
  u.revealAt = Date.now();
  if (!u.autoStopAt && u.lifeHours) u.autoStopAt = Date.now() + u.lifeHours * 3600000;
  log('sync', `«${u.title}» показана игрокам${byTimer ? ' по таймеру' : ''} — запущена катсцена`);
  renderAll();
  playReveal(id);
}

function toggleEvent(id) {
  const u = state.updates.find(x => x.id === id);
  if (!u) return;
  u.eventActive = !u.eventActive;
  u.eventEndsAt = u.eventActive ? Date.now() + 3 * 3600000 : null;
  log(u.eventActive ? 'ok' : 'warn', `Ивент «${u.title}»: ${u.eventActive ? 'запущен (3 ч демо)' : 'остановлен'}`);
  renderAll();
}

$('upSearch').addEventListener('input', e => { search = e.target.value.trim().toLowerCase(); renderUpd(); });
$('upFilters').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  $('upFilters').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
  c.classList.add('on');
  filter = c.dataset.f;
  renderUpd();
});

/* создание обновы */
$('btnNewUpd').addEventListener('click', () => {
  const f = $('newUpdForm');
  f.classList.toggle('show');
  if (f.classList.contains('show')) $('nuTitle').focus();
});
$('nuCancel').addEventListener('click', () => $('newUpdForm').classList.remove('show'));
$('nuKind').addEventListener('change', e => {
  const k = KINDS[e.target.value];
  $('nuTitle').value = k.name + ' ' + new Date().getFullYear();
  $('nuBanner').value = k.banner;
});
function collectNew(sync) {
  const title = $('nuTitle').value.trim() || 'Новая обнова';
  const kind = $('nuKind').value;
  const life = +$('nuLife').value;
  const u = {
    id: 'upd-' + Date.now().toString(36), kind, title,
    status: sync ? 'scheduled' : 'active',
    startsAt: sync ? Date.now() + 15000 : Date.now(),
    autoStopAt: life ? Date.now() + life * 3600000 : null,
    showBanner: $('nuBannerOn').checked, showDecor: $('nuDecor').checked,
    eventOn: $('nuEventWith').value !== 'none', eventActive: false, eventEndsAt: null,
    goal: 1000, pool: 0,
    bannerTitle: $('nuBanner').value.trim() || KINDS[kind].banner, bannerText: KINDS[kind].text,
    lifeHours: life || 168, revealAt: null, createdAt: Date.now()
  };
  state.updates.unshift(u);
  $('newUpdForm').classList.remove('show');
  $('nuTitle').value = ''; $('nuBanner').value = '';
  if (sync) { log('sync', `«${title}» создана, СИНХРО через 15 c (демо)`); renderAll(); }
  else { log('ok', `«${title}» активна`); renderAll(); playReveal(u.id); }
}
$('nuCreate').addEventListener('click', () => collectNew(false));
$('nuCreateSync').addEventListener('click', () => collectNew(true));

/* ---------------- экраны работ ---------------- */
function renderScreens() {
  const s = state.screens;
  document.querySelectorAll('#themeRow [data-theme]').forEach(b => b.classList.toggle('on', b.dataset.theme === s.theme));
  const k = KINDS[s.theme];
  $('themeName').textContent = `${k.emoji} ${k.name}`;

  $('scrInfOn').classList.toggle('on', s.type === 'infinite');
  $('scrInfOff').classList.toggle('on', s.type !== 'infinite');
  $('scrTimerOn').classList.toggle('on', s.type === 'timer' && s.endsAt > Date.now());

  const left = s.type === 'timer' ? s.endsAt - Date.now() : 0;
  $('scrLeft').textContent = s.type === 'infinite' ? 'без таймера' : left > 0 ? clock(left) : 'завершены';
  $('scrBar').style.width = s.type === 'timer' && left > 0 ? Math.min(100, left / 3600000 * 100) + '%' : s.type === 'infinite' ? '100%' : '0%';

  /* мок-экран */
  const inWork = s.type === 'infinite' || left > 0;
  $('mock').classList.toggle('work', inWork);
  $('mock').dataset.theme = s.theme;
  $('mockTimer').textContent = s.type === 'infinite' ? '∞' : left > 0 ? clock(left) : '00:00';
  $('mockBar').style.width = s.type === 'infinite' ? '100%' : Math.max(0, Math.min(100, left / 3600000 * 100)) + '%';

  const live = state.updates.find(u => u.status === 'active');
  const showBanner = live && live.showBanner;
  const showDecor = live && live.showDecor;
  $('mockBanner').classList.toggle('show', !!showBanner);
  $('mockDecor').classList.toggle('show', !!showDecor);
  if (live) {
    $('mockBanner').style.setProperty('--bc', KINDS[live.kind].color);
    $('mockBannerT').innerHTML = `<span class="em">${KINDS[live.kind].emoji}</span> ${esc(live.bannerTitle)}<span class="x">✕</span>`;
    $('mockIcon').textContent = KINDS[live.kind].candy;
    $('mockTitle').textContent = live.title;
    $('mockText').textContent = live.bannerText;
    $('mockDecor').innerHTML = ('012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789')
      .split('').map((_, i) => { const d = KINDS[live.kind].decor.replace(/\s/g, ''); return `<span>${d[i % d.length]}</span>`; }).join('');
  }
  $('scrBanner').checked = !!(live && live.showBanner);
  $('scrDecor').checked = !!(live && live.showDecor);
  $('scrBanner').disabled = !live;
  $('scrDecor').disabled = !live;
}

$('themeRow').addEventListener('click', e => {
  const b = e.target.closest('[data-theme]');
  if (!b) return;
  if (b.dataset.lock) { toast('Заготовка: тема появится после добавления баннеров в игру'); return; }
  state.screens.theme = b.dataset.theme;
  log('ok', `Экран работ: тема ${KINDS[b.dataset.theme].name}`);
  renderScreens();
});
$('scrInfOn').addEventListener('click', () => { state.screens.type = 'infinite'; log('warn', 'Работы идут без таймера'); renderAll(); });
$('scrInfOff').addEventListener('click', () => { state.screens.type = 'timer'; state.screens.endsAt = Date.now() + 3600000; log('ok', 'Работы сняты'); renderAll(); });
$('scrPresets').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  state.screens.type = 'timer';
  state.screens.endsAt = Date.now() + SCREEN_PRESETS[c.dataset.sec] * 1000;
  log('ok', `Работы на ${c.textContent}`);
  renderAll();
});
let secVal = 300;
$('scrSec').addEventListener('click', e => {
  const b = e.target.closest('button');
  if (!b) return;
  secVal = Math.max(5, Math.min(86400, secVal + (+b.textContent)));
  $('scrSecVal').textContent = clock(secVal * 1000);
});
$('scrSecVal').textContent = clock(secVal * 1000);
$('scrStart').addEventListener('click', () => {
  state.screens.type = 'timer';
  state.screens.endsAt = Date.now() + secVal * 1000;
  log('sync', `Экран работ на ${clock(secVal * 1000)} — по концу сработает СИНХРО`);
  renderAll();
});
['scrBanner', 'scrDecor'].forEach(id => $(id).addEventListener('change', () => {
  const live = state.updates.find(u => u.status === 'active');
  if (!live) return;
  live.showBanner = $('scrBanner').checked;
  live.showDecor = $('scrDecor').checked;
  log('ok', `Живое переключение: баннер ${live.showBanner ? 'вкл' : 'выкл'}, декор ${live.showDecor ? 'вкл' : 'выкл'}`);
  renderAll();
}));
$('btnMockReveal').addEventListener('click', () => {
  const live = state.updates.find(u => u.status === 'active') || state.updates[0];
  if (live) playReveal(live.id);
});

/* ---------------- катсцена появления обновы ---------------- */
const sleep = ms => new Promise(r => setTimeout(r, ms));
async function playReveal(id) {
  const u = state.updates.find(x => x.id === id);
  if (!u) return;
  if (playing) return;
  playing = true;
  const k = KINDS[u.kind];
  const stage = $('stage');

  $('cineEmoji').textContent = k.emoji;
  $('cineBannerT').textContent = u.bannerTitle;
  $('cineBannerX').textContent = u.bannerText;
  $('cineCardT').textContent = u.title;
  $('cineNote').textContent = u.eventOn ? 'Ивент стартует отдельно — кнопкой «Запустить»' : 'Ивент не привязан к этой обнове';
  $('cinePool').innerHTML = `<b class="mono">${u.pool}/${u.goal}</b> копилка · ${k.name}`;
  $('cineGlow').style.setProperty('--k', k.color);
  $('cineSpark').innerHTML = Array.from({ length: 22 }, () => `<i style="left:${Math.random() * 100}%;--d:${(Math.random() * .9).toFixed(2)}s;--s:${(.5 + Math.random()).toFixed(2)}">${k.decor.replace(/\s/g, '')[(Math.random() * 5) | 0]}</i>`).join('');
  $('cineDecor').innerHTML = $('mockDecor').innerHTML || '';

  stage.classList.add('show');
  $('cineVeil').classList.remove('go');
  $('cineBanner').className = 'cine-banner';
  $('cineCandy').className = 'cine-candy';
  $('cineCap').className = 'cine-cap';
  $('cineSpark').className = 'cine-spark';
  $('cineDecor').className = 'cine-decor';
  $('cineGlow').className = 'cine-glow';

  /* 1. шторка работ считает обратный отсчёт */
  $('cineHead').textContent = 'Идёт обновление Dilig Clicker';
  for (let i = 3; i > 0; i--) { $('cineVeil').querySelector('.vn').textContent = i; await sleep(700); }
  $('cineVeil').classList.add('go');
  await sleep(600);

  /* 2. баннер влетает */
  $('cineBanner').className = 'cine-banner in';
  $('cineGlow').className = 'cine-glow on';
  await sleep(900);

  /* 3. баннер «раскрывается» в декор */
  $('cineBanner').className = 'cine-banner fold';
  await sleep(700);
  $('cineBanner').classList.add('gone');
  $('cineDecor').className = 'cine-decor on';
  $('cineSpark').className = 'cine-spark on';
  await sleep(500);

  /* 4. конфетный бонус */
  $('cineCandy').className = 'cine-candy on';
  $('cineCap').className = 'cine-cap on';
  $('cineHead').textContent = 'Обнова уже в игре';
  await sleep(2400);

  stage.classList.add('out');
  await sleep(400);
  stage.classList.remove('show', 'out');
  playing = false;
  log('ok', `Катсцена «${u.title}» проиграна (в проде — баннер и декор в index.html)`);
}
$('cinClose').addEventListener('click', () => {
  const stage = $('stage');
  stage.classList.remove('show');
  playing = false;
});
stageKeys();
function stageKeys() {
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ---------------- ивенты ---------------- */
function renderEvent() {
  const act = state.updates.filter(u => u.eventActive);
  $('evState').className = 'status-chip ' + (act.length ? 'on' : 'off');
  $('evStateT').textContent = act.length ? act.map(u => u.title).join(', ') : 'Ивенты остановлены';
  $('evDays').textContent = state.updates.filter(u => u.status === 'active' && u.eventOn).length;

  const rows = state.updates.filter(u => u.eventOn).map(u => `<tr>
      <td>${KINDS[u.kind].emoji} ${esc(u.title)}</td>
      <td class="mono">${u.pool}/${u.goal}</td>
      <td class="mono">${u.eventActive ? clock(Math.max(0, (u.eventEndsAt || Date.now()) - Date.now())) : '—'}</td>
      <td><span class="pill ${u.eventActive ? 'good' : 'off'}">${u.eventActive ? 'активен' : 'стоп'}</span></td>
      <td><button class="btn btn-s sm" data-ev="${u.id}">${u.eventActive ? 'Остановить' : 'Запустить'}</button></td>
    </tr>`).join('');
  $('evTable').innerHTML = rows || '<tr><td colspan="5" class="empty">Нет ивентов. Привяжи ивент к обнове в её настройках.</td></tr>';

  const main = act[0] || state.updates.find(u => u.eventOn) || state.updates[0];
  if (main) {
    $('evPoolVal').textContent = main.pool;
    $('evPoolBar').style.width = Math.min(100, main.goal ? main.pool / main.goal * 100 : 0) + '%';
    $('evGoalVal').textContent = main.goal;
    $('evTopList').innerHTML = main.eventActive || main.pool ? `<b class="mono">${main.pool}</b> · топ-1: <b class="mono">${Math.round(main.pool * .3)}</b>, топ-2: <b class="mono">${Math.round(main.pool * .2)}</b>, топ-3: <b class="mono">${Math.round(main.pool * .1)}</b>` : '<span class="empty">Пока нет вкладов</span>';
  }
}
$('evTable').addEventListener('click', e => {
  const b = e.target.closest('[data-ev]');
  if (b) toggleEvent(b.dataset.ev);
});
$('evPresets').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  const act = state.updates.find(u => u.eventActive) || state.updates.find(u => u.eventOn);
  if (!act) { toast('Сначала включи обнову с ивентом'); return; }
  act.eventActive = true;
  act.eventEndsAt = Date.now() + PRESETS[c.dataset.h] * 3600000;
  log('ok', `Ивент «${act.title}» на ${c.textContent}`);
  renderAll();
});
$('evPoolFill').addEventListener('click', () => {
  const act = state.updates.find(u => u.eventActive) || state.updates.find(u => u.eventOn);
  if (!act) return;
  act.pool = Math.min(act.goal, act.pool + Math.round(act.goal * .05));
  log('ok', `Демо: копилка «${act.title}» +${Math.round(act.goal * .05)}`);
  renderAll();
});
$('evGoalSet').addEventListener('click', () => {
  const act = state.updates.find(u => u.eventActive) || state.updates.find(u => u.eventOn);
  const v = +$('evGoal').value;
  if (!act || !v) { toast('Выбери активный ивент и укажи цель'); return; }
  act.goal = v;
  log('ok', `Цель «${act.title}»: ${v}`);
  renderAll();
});

/* ---------------- анонсы / опросы ---------------- */
function renderSocial() {
  $('anList').innerHTML = state.announcements.length
    ? state.announcements.map(a => `<div class="mini-row"><span>${esc(a.text)}</span><small class="mono">${dateStr(a.at)}</small><button class="btn btn-g sm" data-an="${a.id}">✕</button></div>`).join('')
    : '<div class="empty">Анонсов нет</div>';
  const p = state.polls;
  const sum = p.opts.reduce((s, o) => s + o.v, 0) || 1;
  $('poList').innerHTML = `<div class="mini-row" style="flex-direction:column;align-items:stretch"><b>${esc(p.q)}</b>
    ${p.opts.map(o => `<div style="display:flex;gap:8px;align-items:center;margin-top:4px"><span style="flex:1">${esc(o.t)}</span><div style="flex:2;height:7px;border-radius:4px;background:rgba(255,255,255,.1);overflow:hidden"><i style="display:block;height:100%;width:${o.v / sum * 100}%;background:linear-gradient(90deg,#ff8a3d,#ffd166)"></i></div><small class="mono">${o.v}</small></div>`).join('')}
    <small class="mono">${sum} голосов</small></div>`;
  $('poQ').value = p.q;
  $('poO').value = p.opts.map(o => o.t).join('\n');
}
$('anSend').addEventListener('click', () => {
  const v = $('anText').value.trim();
  if (!v) { toast('Введи текст анонса'); return; }
  state.announcements.unshift({ id: 'an-' + Date.now().toString(36), text: v, at: Date.now() });
  log('ok', `Анонс отправлен: ${v.slice(0, 40)}`);
  $('anText').value = '';
  renderSocial();
});
$('anQuick').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  $('anText').value = c.dataset.an;
  $('anText').focus();
});
$('anList').addEventListener('click', e => {
  const b = e.target.closest('[data-an]');
  if (!b) return;
  state.announcements = state.announcements.filter(a => a.id !== b.dataset.an);
  log('warn', 'Анонс удалён');
  renderSocial();
});
$('poCreate').addEventListener('click', () => {
  const q = $('poQ').value.trim();
  const opts = $('poO').value.split('\n').map(s => s.trim()).filter(Boolean);
  if (!q || opts.length < 2) { toast('Нужен вопрос и минимум 2 варианта'); return; }
  state.polls = { q, opts: opts.map(t => ({ t, v: 0 })), at: Date.now() };
  log('ok', `Опрос создан: ${q}`);
  renderSocial();
});

/* ---------------- игроки и баны ---------------- */
function renderPlayers() {
  $('bnList').innerHTML = state.bans.length
    ? state.bans.map(b => `<div class="mini-row"><span><b>${esc(b.name)}</b> — ${esc(b.reason)}</span><small class="mono">${clock(b.until - Date.now())}</small><button class="btn btn-s sm" data-unb="${b.id}">Снять</button></div>`).join('')
    : '<div class="empty">Банов нет</div>';
}
$('bnPresets').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  $('bnHours').value = BAN_PRESETS[c.dataset.ban];
  $('bnPresets').querySelectorAll('.chip').forEach(x => x.classList.remove('on'));
  c.classList.add('on');
});
$('bnDo').addEventListener('click', () => {
  const name = $('bnName').value.trim() || 'player';
  const h = +$('bnHours').value || 24;
  state.bans.push({ id: 'bn-' + Date.now().toString(36), name, reason: $('bnReason').value.trim() || 'без причины', until: Date.now() + h * 3600000 });
  log('warn', `Бан: ${name} на ${h} ч`);
  toast(`Бан ${name} на ${h} ч (демо)`);
  renderPlayers();
});
$('unbDo').addEventListener('click', () => {
  const name = $('unbName').value.trim().toLowerCase();
  if (!name) { toast('Введи ник'); return; }
  const before = state.bans.length;
  state.bans = state.bans.filter(b => b.name.toLowerCase() !== name);
  log('ok', before === state.bans.length ? `Бан не найден: ${name}` : `Снят бан: ${name}`);
  renderPlayers();
});
$('bnList').addEventListener('click', e => {
  const b = e.target.closest('[data-unb]');
  if (!b) return;
  state.bans = state.bans.filter(x => x.id !== b.dataset.unb);
  log('ok', 'Бан снят');
  renderPlayers();
});
$('gwGive').addEventListener('click', () => {
  const n = +$('gwAmount').value || 0;
  if (!n) { toast('Укажи сумму'); return; }
  log('ok', `Награда ${$('gwName').value || 'player'}: ${n} × ${$('gwType').value} (демо)`);
  toast(`Выдано ${n} ${$('gwType').value}`);
});
$('gwAll').addEventListener('click', () => {
  const n = +$('gwAllAmount').value || 0;
  ask('Выдать всем?', `${n} × ${$('gwAllType').value} всем активным игрокам. В проде уйдёт в Firebase.`, 'Выдать', () => {
    log('ok', `Раздача всем: ${n} ${$('gwAllType').value} (демо)`);
    toast('Раздача отправлена (демо)');
  });
});

/* ---------------- журнал ---------------- */
$('btnLog').addEventListener('click', () => $('logBox').closest('.log-pop').classList.toggle('show'));
$('logClear').addEventListener('click', () => { state.log = []; renderLog(); });

/* ---------------- тик ---------------- */
function tick() {
  let changed = false;
  state.updates.forEach(u => {
    if (u.status === 'scheduled' && Date.now() >= u.startsAt) { activate(u.id, true); changed = true; }
    else if (u.status === 'active' && u.autoStopAt && Date.now() > u.autoStopAt) {
      u.status = 'ended'; u.eventActive = false;
      log('warn', `«${u.title}» автоскрыта по таймеру`);
      changed = true;
    } else if (u.eventActive && u.eventEndsAt && Date.now() > u.eventEndsAt) {
      u.eventActive = false;
      log('warn', `Ивент «${u.title}» завершён по таймеру`);
      changed = true;
    }
  });
  const s = state.screens;
  if (s.type === 'timer' && s.endsAt > Date.now() - 1000 && s.endsAt <= Date.now()) {
    const queued = state.updates.filter(u => u.status === 'scheduled').sort((a, b) => a.startsAt - b.startsAt)[0];
    if (queued) {
      log('sync', `Работы окончены → СИНХРО «${queued.title}»`);
      activate(queued.id, true);
    }
    changed = true;
  }
  if (changed) renderAll();
  else {
    document.querySelectorAll('[data-left]').forEach(el => {
      const u = state.updates.find(x => x.id === el.dataset.left);
      if (u && u.autoStopAt) el.textContent = clock(u.autoStopAt - Date.now());
    });
    if (s.type === 'timer') {
      const left = s.endsAt - Date.now();
      $('scrLeft').textContent = left > 0 ? clock(left) : 'завершены';
      $('mockTimer').textContent = left > 0 ? clock(left) : '00:00';
      if (document.querySelector('.view[data-view="updates"]').classList.contains('on')) renderScreens();
    }
    renderPills();
  }
}
setInterval(tick, 1000);

function renderAll() {
  renderPills();
  renderUpd();
  renderScreens();
  renderEvent();
  renderSocial();
  renderPlayers();
  renderLog();
  save();
}
renderAll();
showView('updates');


