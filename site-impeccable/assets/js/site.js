// UTF Labs: nav, services menu, contact form, footer year.
(function () {
  var year = document.querySelectorAll('[data-year]');
  for (var i = 0; i < year.length; i++) year[i].textContent = new Date().getFullYear();

  // Scroll motion: tag elements, stagger siblings, mark .in when they enter view.
  var groups = [['.section-head', false], ['.way', true], ['.build .svc', true], ['.work > li', true], ['.steps > li', true], ['.answers > div', true]];
  var targets = [];
  groups.forEach(function (g) {
    var els = document.querySelectorAll(g[0]);
    for (var n = 0; n < els.length; n++) {
      if (g[1]) { els[n].classList.add('rise'); els[n].style.setProperty('--d', (n % 4) * 90 + 'ms'); }
      targets.push(els[n]);
    }
  });
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('in'); });
  }

  // Click-to-play video: loads YouTube only when asked.
  var facades = document.querySelectorAll('.video-facade[data-youtube]');
  for (var v = 0; v < facades.length; v++) {
    facades[v].addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + this.getAttribute('data-youtube') + '?autoplay=1&rel=0';
      f.title = 'TickrMeter video';
      f.allow = 'autoplay; encrypted-media; picture-in-picture';
      f.allowFullscreen = true;
      this.parentNode.replaceChild(f, this);
      f.focus();
    });
  }

  // Theme switch: remembers the choice; until then follows the device setting.
  var root = document.documentElement;
  var switches = document.querySelectorAll('.theme-switch');
  function syncSwitch() {
    var dark = root.getAttribute('data-theme') === 'dark';
    for (var n = 0; n < switches.length; n++) {
      switches[n].setAttribute('aria-pressed', String(dark));
      switches[n].setAttribute('aria-label', dark ? 'Light theme' : 'Dark theme');
    }
  }
  for (var m = 0; m < switches.length; m++) {
    switches[m].addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('utf-theme', next); } catch (e) {}
      syncSwitch();
    });
  }
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      try { if (localStorage.getItem('utf-theme')) return; } catch (err) {}
      root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      syncSwitch();
    });
  }
  syncSwitch();

  // Mobile menu
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? 'Menu' : 'Close';
      nav.classList.toggle('open', !open);
    });
  }

  // Services submenu
  var trigger = document.querySelector('.nav-trigger');
  var menu = document.getElementById('services-menu');
  function setMenu(open) {
    trigger.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
  }
  if (trigger && menu) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      setMenu(trigger.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target)) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && trigger.getAttribute('aria-expanded') === 'true') { setMenu(false); trigger.focus(); }
    });
  }

  // Contact form: validate, then show the success message.
  // The developer wires the real POST endpoint; until then the form confirms locally.
  var form = document.querySelector('.form');
  if (!form) return;
  var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  function check(input) {
    var ok = input.value.trim() !== '' && (input.type !== 'email' || emailRe.test(input.value.trim()));
    var err = document.getElementById(input.getAttribute('aria-describedby'));
    input.setAttribute('aria-invalid', String(!ok));
    if (err) err.classList.toggle('show', !ok);
    return ok;
  }
  var required = form.querySelectorAll('[required]');
  for (var r = 0; r < required.length; r++) {
    required[r].addEventListener('blur', function () { if (this.value) check(this); });
    required[r].addEventListener('input', function () { if (this.getAttribute('aria-invalid') === 'true') check(this); });
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    for (var k = 0; k < required.length; k++) { if (!check(required[k]) && !first) first = required[k]; }
    if (first) { first.focus(); return; }
    var btn = form.querySelector('button[type="submit"]');
    btn.classList.add('is-loading');
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = 'Sending…';
    setTimeout(function () {
      var done = document.createElement('p');
      done.className = 'form-success';
      done.setAttribute('role', 'status');
      done.setAttribute('tabindex', '-1');
      done.textContent = 'Thanks. We will reply within one working day.';
      form.innerHTML = '';
      form.appendChild(done);
      done.focus();
    }, 600);
  });
})();
