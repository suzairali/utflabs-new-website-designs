// Font preview picker. PREVIEW ONLY: remove this file and its <script> tag before launch.
// Lets the owner compare heading/body font pairings live. The choice is saved in localStorage.
(function () {
  var KEY = 'utf-font-preview';
  var OPTIONS = [
    { id: 'current', name: 'Barlow Condensed (current)', note: 'Bold condensed, like the logo letters',
      display: 'Barlow Condensed', text: 'Barlow', w: 700, caps: true, track: '0.005em', lead: 0.95, scaleCaps: 1, scaleSentence: 1.05 },
    { id: 'barlow-medium', name: 'Barlow Condensed, lighter', note: 'Same family, medium weight',
      display: 'Barlow Condensed', text: 'Barlow', w: 500, caps: true, track: '0.01em', lead: 0.98, scaleCaps: 1, scaleSentence: 1.05 },
    { id: 'barlow-semi', name: 'Barlow Semi Condensed', note: 'Wider and calmer, sentence case',
      display: 'Barlow Semi Condensed', text: 'Barlow', w: 600, caps: false, track: '-0.005em', lead: 1.0, scaleCaps: 0.86, scaleSentence: 0.92 },
    { id: 'saira', name: 'Saira Condensed + Saira', note: 'Rounded technical, close to the logo',
      display: 'Saira Condensed', text: 'Saira', w: 600, caps: true, track: '0.005em', lead: 0.98, scaleCaps: 1, scaleSentence: 1.05 },
    { id: 'archivo', wide: true, name: 'Archivo', note: 'Plain industrial grotesk',
      display: 'Archivo', text: 'Archivo', w: 600, caps: false, track: '-0.02em', lead: 1.02, scaleCaps: 0.72, scaleSentence: 0.8 },
    { id: 'redhat', wide: true, name: 'Red Hat Display + Text', note: 'Friendly, open and clear',
      display: 'Red Hat Display', text: 'Red Hat Text', w: 600, caps: false, track: '-0.02em', lead: 1.04, scaleCaps: 0.74, scaleSentence: 0.82 },
    { id: 'enstream', wide: true, name: 'En-Stream: Sora + IBM Plex Sans', note: 'The fonts used on en-stream.com',
      display: 'Sora', text: 'IBM Plex Sans', w: 600, caps: false, track: '-0.02em', lead: 1.06, scaleCaps: 0.7, scaleSentence: 0.78 },
    { id: 'schibsted', wide: true, name: 'Schibsted Grotesk', note: 'Editorial, firm and compact',
      display: 'Schibsted Grotesk', text: 'Schibsted Grotesk', w: 600, caps: false, track: '-0.02em', lead: 1.04, scaleCaps: 0.72, scaleSentence: 0.8 }
  ];
  var WEIGHTS = [{ v: 400, l: 'Regular' }, { v: 500, l: 'Medium' }, { v: 600, l: 'Semibold' }, { v: 700, l: 'Bold' }];
  var loaded = {};

  function loadFamily(fam, weights) {
    if (fam === 'Barlow' || loaded[fam]) return;
    loaded[fam] = true;
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=' + fam.replace(/ /g, '+') + ':wght@' + weights + '&display=swap';
    document.head.appendChild(link);
  }
  function byId(id) { for (var i = 0; i < OPTIONS.length; i++) if (OPTIONS[i].id === id) return OPTIONS[i]; return OPTIONS[0]; }

  var state = { id: 'current', w: 700, caps: true };
  try { var saved = JSON.parse(localStorage.getItem(KEY)); if (saved && saved.id) state = saved; } catch (e) {}

  function apply() {
    var o = byId(state.id), r = document.documentElement.style;
    loadFamily(o.display, '400;500;600;700');
    loadFamily(o.text, '400;500;600');
    if (state.id === 'current' && state.w === 700 && state.caps) {
      ['--font-display', '--font-text', '--dw', '--dw-2', '--dcase', '--dtrack', '--dlead', '--dscale', '--h1-measure'].forEach(function (k) { r.removeProperty(k); });
    } else {
      r.setProperty('--font-display', '"' + o.display + '", sans-serif');
      r.setProperty('--font-text', '"' + o.text + '", system-ui, sans-serif');
      r.setProperty('--dw', state.w);
      r.setProperty('--dw-2', Math.max(400, state.w - 100));
      r.setProperty('--dcase', state.caps ? 'uppercase' : 'none');
      r.setProperty('--dtrack', state.caps ? '0.01em' : o.track);
      r.setProperty('--dlead', state.caps ? o.lead : Math.max(o.lead, 1.0));
      r.setProperty('--dscale', state.caps ? o.scaleCaps : o.scaleSentence);
      if (o.wide) r.setProperty('--h1-measure', '100%'); else r.removeProperty('--h1-measure');
    }
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
    render();
  }

  // ---- UI ----
  var css = '' +
    '.fp-btn{position:fixed;right:16px;bottom:16px;z-index:60;width:52px;height:52px;border:0;cursor:pointer;background:var(--ink);color:var(--on-ink);font:600 18px/1 var(--font-text);clip-path:polygon(0 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%);box-shadow:0 10px 24px -10px rgb(0 0 0/.5);transition:transform .16s cubic-bezier(.16,1,.3,1)}' +
    '.fp-btn:hover{transform:translateY(-2px)}.fp-btn:active{transform:translateY(0)}.fp-btn:focus-visible{outline:3px solid var(--orange);outline-offset:3px}' +
    '.fp{position:fixed;right:16px;bottom:80px;z-index:60;width:320px;max-height:min(72vh,640px);overflow:auto;background:var(--ink);color:var(--on-ink);padding:18px;font:400 16px/1.4 "Barlow",system-ui,sans-serif;box-shadow:0 24px 48px -20px rgb(0 0 0/.55);clip-path:polygon(0 0,100% 0,100% calc(100% - 16px),calc(100% - 16px) 100%,0 100%)}' +
    '.fp[hidden]{display:none}.fp h2{margin:0 0 4px;font:600 16px/1.2 "Barlow",sans-serif}.fp p.fp-note{margin:0 0 14px;color:var(--on-ink-2);font-size:16px}' +
    '.fp fieldset{border:0;margin:0 0 14px;padding:0}.fp legend{font-weight:600;margin-bottom:8px;padding:0}' +
    '.fp-opt{display:block;width:100%;text-align:left;background:transparent;color:var(--on-ink);border:1px solid var(--ink-2);padding:10px 12px;margin-bottom:6px;cursor:pointer}' +
    '.fp-opt:hover{background:var(--ink-raise)}.fp-opt[aria-pressed=true]{border-color:var(--orange);background:var(--ink-raise)}.fp-opt:focus-visible,.fp-seg button:focus-visible,.fp-reset:focus-visible{outline:3px solid var(--orange);outline-offset:2px}' +
    '.fp-opt b{display:block;font-size:20px;line-height:1.1}.fp-opt span{display:block;font:400 16px/1.3 "Barlow",sans-serif;color:var(--on-ink-2);margin-top:3px}' +
    '.fp-seg{display:flex;gap:4px;flex-wrap:wrap}.fp-seg button{flex:1;min-width:64px;min-height:40px;background:transparent;color:var(--on-ink);border:1px solid var(--ink-2);cursor:pointer;font:500 16px/1 "Barlow",sans-serif}' +
    '.fp-seg button:hover{background:var(--ink-raise)}.fp-seg button[aria-pressed=true]{background:var(--orange);color:var(--ink);border-color:var(--orange)}' +
    '.fp-reset{background:none;border:0;color:var(--on-ink);text-decoration:underline;text-decoration-color:var(--orange);text-underline-offset:.2em;cursor:pointer;font:500 16px/1 "Barlow",sans-serif;padding:6px 0}' +
    '@media (max-width:480px){.fp{left:12px;right:12px;width:auto;bottom:76px}}@media print{.fp,.fp-btn{display:none}}';
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.className = 'fp-btn'; btn.type = 'button'; btn.textContent = 'Aa';
  btn.setAttribute('aria-label', 'Font preview'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', 'fp-panel');
  var panel = document.createElement('div');
  panel.className = 'fp'; panel.id = 'fp-panel'; panel.hidden = true;
  panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Font preview');
  document.body.appendChild(panel); document.body.appendChild(btn);

  function render() {
    var o = byId(state.id);
    var h = '<h2>Font preview</h2><p class="fp-note">Preview only. Pick a pairing, then adjust heading weight and case.</p>';
    h += '<fieldset><legend>Font pairing</legend>';
    OPTIONS.forEach(function (x) {
      h += '<button type="button" class="fp-opt" data-id="' + x.id + '" aria-pressed="' + (x.id === state.id) + '">' +
        '<b style="font-family:\'' + x.display + '\',sans-serif;font-weight:' + x.w + '">' + x.name + '</b><span>' + x.note + '</span></button>';
    });
    h += '</fieldset><fieldset><legend>Heading weight</legend><div class="fp-seg">';
    WEIGHTS.forEach(function (w) { h += '<button type="button" data-w="' + w.v + '" aria-pressed="' + (w.v === state.w) + '">' + w.l + '</button>'; });
    h += '</div></fieldset><fieldset><legend>Heading case</legend><div class="fp-seg">' +
      '<button type="button" data-caps="1" aria-pressed="' + state.caps + '">CAPITALS</button>' +
      '<button type="button" data-caps="0" aria-pressed="' + !state.caps + '">Sentence case</button></div></fieldset>' +
      '<button type="button" class="fp-reset">Reset to current</button>';
    panel.innerHTML = h;
  }

  panel.addEventListener('click', function (e) {
    var t = e.target.closest('button'); if (!t) return;
    if (t.dataset.id) { var o = byId(t.dataset.id); state = { id: o.id, w: o.w, caps: o.caps }; }
    else if (t.dataset.w) state.w = +t.dataset.w;
    else if (t.dataset.caps) state.caps = t.dataset.caps === '1';
    else if (t.classList.contains('fp-reset')) state = { id: 'current', w: 700, caps: true };
    var focusKey = t.dataset.id ? '[data-id="' + t.dataset.id + '"]' : t.dataset.w ? '[data-w="' + t.dataset.w + '"]' : t.dataset.caps ? '[data-caps="' + t.dataset.caps + '"]' : '.fp-reset';
    apply();
    var again = panel.querySelector(focusKey); if (again) again.focus();
  });
  function setOpen(open) {
    panel.hidden = !open; btn.setAttribute('aria-expanded', String(open));
    if (open) { OPTIONS.forEach(function (x) { loadFamily(x.display, '400;500;600;700'); }); }
  }
  btn.addEventListener('click', function () { setOpen(panel.hidden); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); btn.focus(); } });
  document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) setOpen(false); });

  apply();
})();
