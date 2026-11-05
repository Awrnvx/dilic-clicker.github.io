const fs = require('fs');
const src = fs.readFileSync('style.css', 'utf8');
const marker = '/* ============================================================\n   UPDATE REVEAL';
const idx = src.indexOf(marker);
if (idx < 0) { console.error('marker not found'); process.exit(1); }
const block = `/* ============================================================
   UPDATE REVEAL — витрина обновы
   Пока обнова не включена из админки (/updateState.activeId),
   в игре нет НИЧЕГО хэллоуинского: ни декора, ни баннеров,
   ни конфетного бонуса, ни тыквы в заголовке, ни хэллоуинского
   колеса, ни призрачного сектора, ни плашек ивента.
   ============================================================ */

/* ---------- МАСТЕР-ГЕЙТ: обнова выключена ---------- */
body:not(.update-hw-on) .hw-decor,
body:not(.update-hw-on) .halloween-banner,
body:not(.update-hw-on) #halloweenBanner,
body:not(.update-hw-on) .candy-bonus,
body:not(.update-hw-on) #candyBonusBtn,
body:not(.update-hw-on) .halloween-title-emoji,
body:not(.update-hw-on) .hw-wheel-decor,
body:not(.update-hw-on) .wheel-prize-item.ghost-prize,
body:not(.update-hw-on) #halloweenEventCard,
body:not(.update-hw-on) #halloweenContent,
body:not(.update-hw-on) .halloween-progress-card,
body:not(.update-hw-on) #halloweenTopSection,
body:not(.update-hw-on) .hw-event-tile,
body:not(.update-hw-on) .halloween-only {
    display: none !important;
}

/* ---------- ГРУППИРОВКА ВО ВРЕМЯ КАТСКАЦЕНЫ ---------- */
/* Пока идёт катсцена (upd-reveal-ctl), обнова уже включена, но контент
   показывается точечно — только группы, помеченные флагом rv-*. */
body.upd-reveal-ctl .hw-decor,
body.upd-reveal-ctl .halloween-banner,
body.upd-reveal-ctl #halloweenBanner,
body.upd-reveal-ctl .candy-bonus,
body.upd-reveal-ctl .halloween-title-emoji,
body.upd-reveal-ctl .hw-wheel-decor,
body.upd-reveal-ctl .wheel-prize-item.ghost-prize,
body.upd-reveal-ctl #halloweenEventCard,
body.upd-reveal-ctl #halloweenContent,
body.upd-reveal-ctl .hw-rewards-section,
body.upd-reveal-ctl .halloween-pool,
body.upd-reveal-ctl .top-section,
body.upd-reveal-ctl .halloween-header,
body.upd-reveal-ctl .user-panel-mini {
    display: none !important;
}

/* Флаг rv-* открывает свою группу */
body.upd-reveal-ctl.rv-decor .hw-decor { display: block !important; }
body.upd-reveal-ctl.rv-banner #halloweenBanner,
body.upd-reveal-ctl.rv-banner .halloween-banner { display: flex !important; }
body.upd-reveal-ctl.rv-candy .candy-bonus { display: flex !important; }
body.upd-reveal-ctl.rv-candy .halloween-title-emoji { display: inline !important; }
body.upd-reveal-ctl.rv-wheel .hw-wheel-decor { display: block !important; }
body.upd-reveal-ctl.rv-ghost .wheel-prize-item.ghost-prize { display: flex !important; }
body.upd-reveal-ctl.rv-event #halloweenEventCard { display: block !important; }
body.upd-reveal-ctl.rv-event #halloweenContent { display: block !important; }

/* ---------- КАТСКАЦЕНА: оверлей-затемнение ---------- */
.upd-cine {
    position: fixed; inset: 0; z-index: 4000; pointer-events: none;
    display: grid; place-items: center;
    background: rgba(4, 6, 12, 0.62);
    backdrop-filter: blur(6px) saturate(140%);
    -webkit-backdrop-filter: blur(6px) saturate(140%);
    opacity: 0; transition: opacity 0.7s ease;
}
.upd-cine.upd-cine-in { opacity: 1; }
.upd-cine.upd-cine-out { opacity: 0; }

/* ---------- ФИНАЛЬНЫЙ ПОЛНОЭКРАННЫЙ БАННЕР ---------- */
.upd-finale {
    position: fixed; inset: 0; z-index: 4100; pointer-events: none;
    display: grid; place-items: center;
    background: radial-gradient(ellipse at 50% 40%,
        rgba(255, 140, 26, 0.22) 0%,
        rgba(122, 46, 0, 0.55) 38%,
        rgba(6, 7, 12, 0.95) 78%);
    opacity: 0; transition: opacity 1.2s ease;
}
.upd-finale.upd-finale-in { opacity: 1; }
.upd-finale.upd-finale-out { opacity: 0; transition-duration: 2s; }
.upd-finale-content { text-align: center; }
.upd-finale-title {
    font-size: clamp(1.6rem, 5vw, 3.2rem);
    font-weight: 900;
    letter-spacing: 0.04em;
    color: #ffd700;
    text-shadow: 0 0 20px rgba(255, 140, 26, 0.9), 0 0 50px rgba(200, 107, 255, 0.6), 0 4px 12px rgba(0,0,0,0.8);
    animation: hwFinaleGlow 3s ease-in-out infinite alternate;
}
.upd-finale-sub {
    margin-top: 14px;
    font-size: clamp(0.9rem, 2.5vw, 1.25rem);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(255, 200, 150, 0.8);
    text-shadow: 0 2px 8px rgba(0,0,0,0.7);
}
@keyframes hwFinaleGlow {
    from { text-shadow: 0 0 12px rgba(255,140,26,0.7), 0 0 40px rgba(200,107,255,0.5), 0 4px 10px rgba(0,0,0,0.7); }
    to   { text-shadow: 0 0 28px rgba(255,140,26,1), 0 0 80px rgba(200,107,255,0.8), 0 4px 14px rgba(0,0,0,0.9); }
}

/* ---------- КОНФЕТТИ И ТЫКВЫ ФИНАЛА ---------- */
.upd-finale-decor {
    position: absolute; inset: 0; overflow: hidden; pointer-events: none;
}
.upd-finale-decor span {
    position: absolute;
    font-size: clamp(1.2rem, 3.5vw, 2.4rem);
    opacity: 0;
    animation: hwFinaleFloat 6s ease-in-out infinite;
}
/* 16 декоративных элементов */
.upd-finale-decor span:nth-child(1)  { left: 5%;  animation-delay: 0.0s; }
.upd-finale-decor span:nth-child(2)  { left: 12%; animation-delay: 0.4s; }
.upd-finale-decor span:nth-child(3)  { left: 20%; animation-delay: 0.8s; }
.upd-finale-decor span:nth-child(4)  { left: 28%; animation-delay: 1.2s; }
.upd-finale-decor span:nth-child(5)  { left: 36%; animation-delay: 1.6s; }
.upd-finale-decor span:nth-child(6)  { left: 44%; animation-delay: 2.0s; }
.upd-finale-decor span:nth-child(7)  { left: 52%; animation-delay: 2.4s; }
.upd-finale-decor span:nth-child(8)  { left: 60%; animation-delay: 2.8s; }
.upd-finale-decor span:nth-child(9)  { left: 68%; animation-delay: 3.2s; }
.upd-finale-decor span:nth-child(10) { left: 76%; animation-delay: 3.6s; }
.upd-finale-decor span:nth-child(11) { left: 84%; animation-delay: 4.0s; }
.upd-finale-decor span:nth-child(12) { left: 92%; animation-delay: 4.4s; }
.upd-finale-decor span:nth-child(13) { left: 8%;  animation-delay: 4.8s; }
.upd-finale-decor span:nth-child(14) { left: 18%; animation-delay: 5.2s; }
.upd-finale-decor span:nth-child(15) { left: 30%; animation-delay: 5.6s; }
.upd-finale-decor span:nth-child(16) { left: 48%; animation-delay: 1.0s; }
@keyframes hwFinaleFloat {
    0%   { transform: translateY(110vh) rotate(0deg) scale(0.8); opacity: 0; }
    10%  { opacity: 1; }
    50%  { transform: translateY(50vh) rotate(180deg) scale(1.1); opacity: 1; }
    90%  { opacity: 1; }
    100% { transform: translateY(-10vh) rotate(360deg) scale(0.9); opacity: 0; }
}

/* ---------- АНИМАЦИЯ ПОЯВЛЕНИЯ ПЛАШЕК ИВЕНТА ---------- */
body.rv-event .halloween-header,
body.rv-event .user-panel-mini,
body.rv-event .halloween-pool,
body.rv-event .top-section,
body.rv-event .hw-rewards-section {
    animation: hwPlateIn 0.85s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
body.rv-event .halloween-header    { animation-delay: 0s; }
body.rv-event .user-panel-mini     { animation-delay: 0.18s; }
body.rv-event .halloween-pool      { animation-delay: 0.36s; }
body.rv-event .top-section         { animation-delay: 0.54s; }
body.rv-event .hw-rewards-section:nth-of-type(1) { animation-delay: 0.72s; }
body.rv-event .hw-rewards-section:nth-of-type(2) { animation-delay: 0.9s; }
@keyframes hwPlateIn {
    0%   { opacity: 0; transform: translateY(28px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}

/* ---------- АНИМАЦИЯ ПОЯВЛЕНИЯ СПИСКА ШАНСОВ КОЛЕСА ---------- */
body.rv-odds .wheel-prize-item {
    animation: hwOddsIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
body.rv-odds .wheel-prize-item:nth-child(1) { animation-delay: 0.00s; }
body.rv-odds .wheel-prize-item:nth-child(2) { animation-delay: 0.07s; }
body.rv-odds .wheel-prize-item:nth-child(3) { animation-delay: 0.14s; }
body.rv-odds .wheel-prize-item:nth-child(4) { animation-delay: 0.21s; }
body.rv-odds .wheel-prize-item:nth-child(5) { animation-delay: 0.28s; }
body.rv-odds .wheel-prize-item:nth-child(6) { animation-delay: 0.35s; }
body.rv-odds .wheel-prize-item:nth-child(7) { animation-delay: 0.42s; }
@keyframes hwOddsIn {
    0%   { opacity: 0; transform: translateX(-18px); }
    100% { opacity: 1; transform: translateX(0); }
}

/* ---------- ВОЛНА ПО ВКЛАДКАМ: декор и баннеры ---------- */
.content > .tab .hw-decor,
.content > .tab .halloween-banner { opacity: 0; }
body.update-hw-on:not(.upd-reveal-ctl) .content > .tab .hw-decor,
body.update-hw-on:not(.upd-reveal-ctl) .content > .tab .halloween-banner,
body.upd-reveal-ctl.rv-decor .content > .tab .hw-decor,
body.upd-reveal-ctl.rv-banner .content > .tab .halloween-banner {
    opacity: 1;
    transition: opacity 0.5s ease;
}
body.upd-sweep .content > .tab.upd-swept .hw-decor span {
    animation: updPop 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards;
}
body.upd-sweep .content > .tab.upd-swept .hw-decor span:nth-child(2) { animation-delay: 0.07s; }
body.upd-sweep .content > .tab.upd-swept .hw-decor span:nth-child(3) { animation-delay: 0.14s; }
body.upd-sweep .content > .tab.upd-swept .hw-decor span:nth-child(4) { animation-delay: 0.21s; }
body.upd-sweep .content > .tab.upd-swept .hw-decor span:nth-child(5) { animation-delay: 0.28s; }
body.upd-sweep .content > .tab.upd-swept .hw-decor span:nth-child(6) { animation-delay: 0.35s; }
body.upd-sweep .content > .tab.upd-swept .halloween-banner {
    animation: updBanner 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}
@keyframes updPop {
    0%   { transform: scale(0) rotate(-40deg); opacity: 0; }
    60%  { transform: scale(1.3) rotate(8deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
}
@keyframes updBanner {
    0%   { transform: translateX(-26px); opacity: 0; filter: brightness(2.2); }
    55%  { transform: translateX(4px); opacity: 1; filter: brightness(1.35); }
    100% { transform: translateX(0); opacity: 1; filter: brightness(1); }
}

/* Затемнение кликера и навбара во время катсцены */
body.upd-cine-live .click-area,
body.upd-cine-live .nav-bar { filter: brightness(0.5); transition: filter 0.6s ease; }

/* Кнопка пропуска катсцены */
.upd-cine-skip {
    position: absolute; bottom: 28px; right: 20px; z-index: 4200;
    padding: 8px 18px; border-radius: 99px;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
    color: rgba(255,255,255,0.65); font-size: 0.82rem; cursor: pointer;
    pointer-events: all;
    transition: background 0.2s, color 0.2s;
}
.upd-cine-skip:hover { background: rgba(255,255,255,0.2); color: white; }

/* Эконом-режим: катсцена мгновенно завершается */
body.no-liquid-animations .upd-cine,
body.no-liquid-animations .upd-finale { display: none !important; }

@media (prefers-reduced-motion: reduce) {
    .upd-cine, .upd-finale,
    .upd-finale-decor span,
    body.rv-event .halloween-header,
    body.rv-event .user-panel-mini,
    body.rv-event .halloween-pool,
    body.rv-event .top-section,
    body.rv-event .hw-rewards-section,
    body.rv-odds .wheel-prize-item,
    body.upd-sweep .content > .tab.upd-swept .hw-decor span,
    body.upd-sweep .content > .tab.upd-swept .halloween-banner {
        animation-duration: 0.01s !important;
        animation-iteration-count: 1 !important;
    }
}
`;
fs.writeFileSync('style.css', src.slice(0, idx) + block, 'utf8');
console.log('done. new length:', (src.slice(0, idx) + block).split('\n').length);
