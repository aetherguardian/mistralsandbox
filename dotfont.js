(function (global) {
  'use strict';

  var CW = 5;
  var CH = 7;

  var G = {
    'A': ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
    'B': ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
    'C': ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
    'D': ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
    'E': ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
    'F': ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
    'G': ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
    'H': ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
    'I': ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
    'J': ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
    'K': ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
    'L': ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
    'M': ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
    'N': ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
    'O': ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
    'P': ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
    'Q': ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
    'R': ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
    'S': ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
    'T': ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
    'U': ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
    'V': ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
    'W': ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
    'X': ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
    'Y': ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
    'Z': ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
    '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
    '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
    '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
    '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
    '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
    '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
    '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
    '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
    '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
    '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
    ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
    '.': ['00000', '00000', '00000', '00000', '00000', '00110', '00110'],
    ',': ['00000', '00000', '00000', '00000', '00110', '00110', '00100'],
    ':': ['00000', '00110', '00110', '00000', '00110', '00110', '00000'],
    ';': ['00000', '00110', '00110', '00000', '00110', '00110', '00100'],
    '-': ['00000', '00000', '00000', '11111', '00000', '00000', '00000'],
    '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
    '?': ['01110', '10001', '00001', '00010', '00100', '00000', '00100'],
    "'": ['00100', '00100', '01000', '00000', '00000', '00000', '00000'],
    '(': ['00010', '00100', '01000', '01000', '01000', '00100', '00010'],
    ')': ['01000', '00100', '00010', '00010', '00010', '00100', '01000'],
    '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
    '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
    '=': ['00000', '00000', '11111', '00000', '11111', '00000', '00000'],
    '>': ['01000', '00100', '00010', '00001', '00010', '00100', '01000'],
    '<': ['00010', '00100', '01000', '10000', '01000', '00100', '00010'],
    '_': ['00000', '00000', '00000', '00000', '00000', '00000', '11111'],
    '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
    '%': ['11001', '11010', '00010', '00100', '01000', '01011', '10011'],
    '×': ['00000', '10001', '01010', '00100', '01010', '10001', '00000'],
    '•': ['00000', '00000', '01110', '01110', '01110', '00000', '00000'],
    'Æ': ['01111', '10100', '10100', '11110', '10100', '10101', '10111']
  };

  function glyphFor(ch) {
    if (G[ch]) return G[ch];
    var up = String(ch).toUpperCase();
    if (G[up]) return G[up];
    if (ch === 'æ') return G['Æ'];
    return G['?'];
  }

  function colsFor(text) {
    return Array.from(text).length * (CW + 1) - 1;
  }

  function layout(text, pitch, tracking) {
    tracking = tracking || 0;
    var chars = Array.from(text);
    var w = (colsFor(text) + 1) * pitch;
    var h = (CH + 1) * pitch;
    var dots = [];
    chars.forEach(function (ch, i) {
      var g = glyphFor(ch);
      var x0 = i * ((CW + 1) * pitch + tracking);
      for (var r = 0; r < CH; r++) {
        var row = g[r] || '00000';
        for (var c = 0; c < CW; c++) {
          if (row[c] === '1') {
            dots.push({ x: x0 + (c + 0.5) * pitch, y: (r + 0.5) * pitch, ch: ch, gx: c, gy: r });
          }
        }
      }
    });
    return { dots: dots, w: w, h: h, pitch: pitch };
  }

  function setupCanvas(canvas, w, h, dprCap) {
    var dpr = Math.min(global.devicePixelRatio || 1, dprCap || 2);
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    var ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return ctx;
  }

  function drawStatic(canvas, text, opts) {
    opts = opts || {};
    var pitch = opts.pitch || 10;
    var ratio = opts.ratio || 0.36;
    var L = layout(text, pitch, opts.tracking || 0);
    var ctx = setupCanvas(canvas, L.w, L.h);
    var r = pitch * ratio;
    ctx.fillStyle = opts.color || '#101010';
    ctx.beginPath();
    for (var i = 0; i < L.dots.length; i++) {
      var d = L.dots[i];
      ctx.moveTo(d.x + r, d.y);
      ctx.arc(d.x, d.y, r, 0, 6.2832);
    }
    ctx.fill();
    return L;
  }

  function fitPitch(text, targetW) {
    return targetW / (colsFor(text) + 1);
  }

  function animate(canvas, text, opts) {
    opts = opts || {};
    var pitch = opts.pitch || 18;
    var ratio = opts.ratio || 0.36;
    var color = opts.color || '#101010';
    var L = layout(text, pitch, opts.tracking || 0);
    var ctx = setupCanvas(canvas, L.w, L.h);
    var cx = L.w / 2;
    var cy = L.h / 2;
    var maxD = Math.hypot(cx, cy) || 1;
    var stagger = opts.stagger == null ? 900 : opts.stagger;
    var dots = L.dots.map(function (d) {
      var dist = Math.hypot(d.x - cx, d.y - cy);
      return {
        x: d.x, y: d.y,
        phase: Math.random() * Math.PI * 2,
        delay: (dist / maxD) * stagger
      };
    });
    var mouse = { x: -1e5, y: -1e5 };
    var mouseRadius = opts.mouseRadius || 160;
    var raf = 0;
    var t0 = 0;
    var running = false;

    function frame(t) {
      if (!running) return;
      if (!t0) t0 = t;
      var el = t - t0;
      ctx.clearRect(0, 0, L.w, L.h);
      ctx.fillStyle = color;
      ctx.beginPath();
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var p = Math.min(1, Math.max(0, (el - d.delay) / 650));
        var ease = 1 - Math.pow(1 - p, 3);
        var r = pitch * ratio * ease;
        r *= 1 + 0.16 * Math.sin(t * 0.0014 + d.phase);
        var dx = d.x - mouse.x;
        var dy = d.y - mouse.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouseRadius) {
          var b = 1 - dist / mouseRadius;
          r *= 1 + b * 1.5;
        }
        if (r > 0.05) {
          ctx.moveTo(d.x + r, d.y);
          ctx.arc(d.x, d.y, r, 0, 6.2832);
        }
      }
      ctx.fill();
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      t0 = 0;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    function setMouse(x, y) {
      mouse.x = x;
      mouse.y = y;
    }

    return { start: start, stop: stop, setMouse: setMouse, layout: L };
  }

  global.DotFont = {
    CW: CW,
    CH: CH,
    glyphs: G,
    layout: layout,
    drawStatic: drawStatic,
    fitPitch: fitPitch,
    animate: animate
  };
})(window);
