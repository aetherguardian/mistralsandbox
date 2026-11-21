(function () {
  'use strict';

  var DF = window.DotFont;
  var INK = '#101010';
  var PAPER = '#f4f3ee';
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  var bg = $('#bg');
  var bgCtx = bg ? bg.getContext('2d') : null;
  var bgDots = [];
  var bgPitch = 38;
  var bgW = 0;
  var bgH = 0;
  var bgMouse = { x: -1e5, y: -1e5 };
  var bgRaf = 0;

  function buildBg() {
    if (!bgCtx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
    bgW = window.innerWidth;
    bgH = window.innerHeight;
    bg.width = Math.round(bgW * dpr);
    bg.height = Math.round(bgH * dpr);
    bg.style.width = bgW + 'px';
    bg.style.height = bgH + 'px';
    bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bgPitch = Math.max(26, Math.min(46, Math.round(bgW / 44)));
    bgDots = [];
    for (var y = bgPitch / 2; y < bgH; y += bgPitch) {
      for (var x = bgPitch / 2; x < bgW; x += bgPitch) {
        var nx = x / bgW;
        var ny = y / bgH;
        var d = Math.pow(ny, 1.7) * 0.8 + Math.pow(1 - nx, 2.2) * 0.4;
        if (d > 1) d = 1;
        bgDots.push({ x: x, y: y, d: d, phase: Math.random() * Math.PI * 2 });
      }
    }
  }

  function drawBg(t) {
    if (!bgCtx) return;
    bgCtx.clearRect(0, 0, bgW, bgH);
    bgCtx.fillStyle = INK;
    bgCtx.beginPath();
    var mr = 170;
    for (var i = 0; i < bgDots.length; i++) {
      var dot = bgDots[i];
      var r = 0.4 + dot.d * bgPitch * 0.3;
      if (!reduced) r *= 1 + 0.08 * Math.sin(t * 0.0009 + dot.phase);
      var dx = dot.x - bgMouse.x;
      var dy = dot.y - bgMouse.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mr) {
        var b = 1 - dist / mr;
        r *= 1 + b * 1.1;
      }
      if (r > 0.15) {
        bgCtx.moveTo(dot.x + r, dot.y);
        bgCtx.arc(dot.x, dot.y, r, 0, 6.2832);
      }
    }
    bgCtx.fill();
  }

  function bgLoop(t) {
    drawBg(t || 0);
    bgRaf = requestAnimationFrame(bgLoop);
  }

  var staticCanvases = [];

  function renderStaticCanvas(canvas) {
    var text = canvas.getAttribute('data-dot');
    if (!text) return;
    var color = canvas.getAttribute('data-color') || INK;
    var maxW = parseFloat(canvas.getAttribute('data-max')) || 0;
    var parentW = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
    var target = parentW * 0.94;
    if (maxW > 0) target = Math.min(maxW, target);
    var pitch;
    if (canvas.hasAttribute('data-pitch')) {
      pitch = parseFloat(canvas.getAttribute('data-pitch'));
    } else {
      pitch = DF.fitPitch(text, target);
    }
    DF.drawStatic(canvas, text, { pitch: pitch, color: color, ratio: 0.36 });
    staticCanvases.push({ canvas: canvas, text: text, color: color, maxW: maxW });
  }

  function renderStatics() {
    staticCanvases = [];
    $all('canvas[data-dot]').forEach(renderStaticCanvas);
  }

  var heroAnimator = null;
  var heroVisible = false;

  function buildHero() {
    var canvas = $('#heroWord');
    var sub = $('#heroSub');
    if (!canvas || !sub) return;
    var vw = window.innerWidth;
    var target = Math.min(vw * 0.92, 1150);
    var pitch = DF.fitPitch('ÆTHER', target);
    pitch = Math.max(12, Math.min(38, pitch));
    if (heroAnimator) heroAnimator.stop();
    if (reduced) {
      DF.drawStatic(canvas, 'ÆTHER', { pitch: pitch, color: INK, ratio: 0.36 });
    } else {
      heroAnimator = DF.animate(canvas, 'ÆTHER', { pitch: pitch, color: INK, ratio: 0.36, mouseRadius: Math.max(120, pitch * 5), stagger: 1000 });
      if (heroVisible) heroAnimator.start();
    }
    var subTarget = Math.min(vw * 0.52, 620);
    var subPitch = Math.max(7, Math.min(16, DF.fitPitch('SOFTWARE', subTarget)));
    DF.drawStatic(sub, 'SOFTWARE', { pitch: subPitch, color: INK, ratio: 0.36 });
  }

  function setupHero() {
    var hero = $('#hero');
    var canvas = $('#heroWord');
    if (!hero || !canvas) return;
    if (!reduced) {
      hero.addEventListener('mousemove', function (e) {
        if (!heroAnimator) return;
        var rect = canvas.getBoundingClientRect();
        heroAnimator.setMouse(e.clientX - rect.left, e.clientY - rect.top);
      });
      hero.addEventListener('mouseleave', function () {
        if (heroAnimator) heroAnimator.setMouse(-1e5, -1e5);
      });
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            heroVisible = en.isIntersecting;
            if (!heroAnimator) return;
            if (heroVisible) heroAnimator.start(); else heroAnimator.stop();
          });
        }, { threshold: 0.15 }).observe(hero);
      } else {
        heroVisible = true;
        if (heroAnimator) heroAnimator.start();
      }
    }
  }

  function setupMarquee() {
    var track = $('#mqTrack');
    if (!track) return;
    if (reduced) return;
    track.innerHTML += track.innerHTML;
  }

  function setupNav() {
    var nav = $('#nav');
    function onScroll() {
      if (window.scrollY > 24) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function setupReveals() {
    var els = $all('.reveal');
    if (!('IntersectionObserver' in window) || reduced) {
      els.forEach(function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  function setupMisc() {
    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());
    window.addEventListener('mousemove', function (e) {
      bgMouse.x = e.clientX;
      bgMouse.y = e.clientY;
    }, { passive: true });
  }

  var resizeTimer = 0;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      buildBg();
      if (!reduced) drawBg(0);
      renderStatics();
      buildHero();
    }, 160);
  }

  function init() {
    buildBg();
    if (reduced) drawBg(0);
    else bgRaf = requestAnimationFrame(bgLoop);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        if (bgRaf) cancelAnimationFrame(bgRaf);
        bgRaf = 0;
        if (heroAnimator) heroAnimator.stop();
      } else if (!reduced) {
        bgRaf = requestAnimationFrame(bgLoop);
        if (heroAnimator && heroVisible) heroAnimator.start();
      }
    });
    renderStatics();
    buildHero();
    setupHero();
    setupMarquee();
    setupNav();
    setupReveals();
    setupMisc();
    window.addEventListener('resize', onResize);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
