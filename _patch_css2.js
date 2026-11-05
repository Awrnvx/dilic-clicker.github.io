const fs = require('fs');
const extra = `
/* ---------- Перетабная анимация во время катсцены ---------- */
body.upd-reveal-ctl .content > .tab:not(.upd-swept) .hw-decor,
body.upd-reveal-ctl .content > .tab:not(.upd-swept) .halloween-banner { display: none !important; }
`;
fs.appendFileSync('style.css', extra);
const s = fs.readFileSync('style.css', 'utf8');
console.log('appended. total lines:', s.split('\n').length);
