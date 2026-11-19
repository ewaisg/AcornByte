/* AcornByte interactive scenes.
 *
 * Hero: one of five full-width scenes (Flow, Terrain, Byte Field, Constellation,
 * Orbit). Each visit opens on the next scene in turn; a small switcher lets
 * visitors pick one (remembered) or pause motion.
 * About panel: the Seed scene, particles that form the One Bit acorn.
 *
 * Plain canvas 2D, no libraries. Pauses off-screen and in background tabs,
 * scales particle counts to the area, and draws a still frame for visitors
 * who prefer reduced motion. Colors come from the page's theme tokens, so
 * scenes follow the dark/light toggle.
 */
(() => {
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { /* storage unavailable */ } },
  };

  // ---------- color helpers ----------
  const hexToRgb = h => {
    const v = (h || '#000000').trim().replace('#', '');
    const f = v.length === 3 ? v.split('').map(c => c + c).join('') : v.slice(0, 6);
    return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
  };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;

  // ---------- one canvas stage: sizing, pointer, palette, loop ----------
  function createStage(el, canvas, paletteFrom) {
    const ctx = canvas.getContext('2d');
    const s = {
      el, canvas, ctx, W: 1, H: 1, dpr: 1,
      pointer: { x: -9999, y: -9999, sx: -9999, sy: -9999, active: false },
      pal: {}, scene: null, visible: true, paused: false, reduce: reduceMQ.matches,
    };
    s.readPalette = () => {
      const cs = getComputedStyle(paletteFrom || el);
      const light = document.documentElement.dataset.theme === 'light' && !el.closest('.about-panel');
      s.pal = {
        bg: hexToRgb(cs.getPropertyValue('--paper')),
        ink: hexToRgb(cs.getPropertyValue('--ink')),
        acc: hexToRgb(light ? cs.getPropertyValue('--gold') : cs.getPropertyValue('--gold-text')),
        light,
      };
    };
    s.resize = () => {
      const r = el.getBoundingClientRect();
      s.dpr = Math.min(window.devicePixelRatio || 1, 2);
      s.W = Math.max(1, Math.round(r.width));
      s.H = Math.max(1, Math.round(r.height));
      canvas.width = s.W * s.dpr;
      canvas.height = s.H * s.dpr;
      ctx.setTransform(s.dpr, 0, 0, s.dpr, 0, 0);
      if (s.scene) { s.scene.init(s); if (s.still()) s.scene.draw(s); }
    };
    s.still = () => s.reduce || s.paused;
    s.setScene = scene => {
      s.scene = scene;
      ctx.clearRect(0, 0, s.W, s.H);
      scene.init(s);
      if (s.still()) scene.draw(s);
    };
    const loop = () => {
      if (!s.visible || s.still() || document.hidden) { s.raf = 0; return; }
      const p = s.pointer;
      p.sx += (p.x - p.sx) * 0.18;
      p.sy += (p.y - p.sy) * 0.18;
      s.scene.draw(s);
      s.raf = requestAnimationFrame(loop);
    };
    s.kick = () => { if (!s.raf && s.scene && s.visible && !s.still() && !document.hidden) s.raf = requestAnimationFrame(loop); };

    const setPointer = e => {
      const r = el.getBoundingClientRect();
      const p = s.pointer;
      p.x = e.clientX - r.left; p.y = e.clientY - r.top;
      if (!p.active) { p.sx = p.x; p.sy = p.y; }
      p.active = true;
    };
    el.addEventListener('pointermove', setPointer, { passive: true });
    el.addEventListener('pointerdown', e => { setPointer(e); s.scene?.burst?.(s); }, { passive: true });
    el.addEventListener('pointerleave', () => { s.pointer.active = false; });
    new IntersectionObserver(([en]) => { s.visible = en.isIntersecting; s.kick(); }).observe(el);
    document.addEventListener('visibilitychange', s.kick);
    new ResizeObserver(() => s.resize()).observe(el);
    new MutationObserver(() => { s.readPalette(); if (s.still() && s.scene) { ctx.clearRect(0, 0, s.W, s.H); s.scene.draw(s); } })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    reduceMQ.addEventListener?.('change', () => { s.reduce = reduceMQ.matches; s.setScene(s.scene); s.kick(); });
    s.readPalette();
    s.resize();
    return s;
  }

  // ---------- scenes ----------
  const scenes = {};

  scenes.flow = {
    name: 'Flow',
    init(s) {
      const n = Math.round(Math.min(2200, (s.W * s.H) / 300));
      this.t = 0;
      this.ps = Array.from({ length: n }, () => this.spawn({}, s));
      this.frame = 0;
      s.ctx.clearRect(0, 0, s.W, s.H);
    },
    spawn(p, s) {
      p.x = Math.random() * s.W; p.y = Math.random() * s.H; p.px = p.x; p.py = p.y;
      p.life = 160 + Math.random() * 400; p.gold = Math.random() < 0.16;
      return p;
    },
    angle(x, y, t) {
      return (Math.sin(x * 0.0021 + t * 0.6) + Math.cos(y * 0.0027 - t * 0.45) + 0.6 * Math.sin((x + y) * 0.0013 + t * 0.3)) * Math.PI * 0.75;
    },
    draw(s) {
      const { ctx, pal, pointer } = s;
      const still = s.still();
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = `rgba(0,0,0,${still ? 1 : (++this.frame % 4 === 0 ? 0.12 : 0.04)})`;
      ctx.fillRect(0, 0, s.W, s.H);
      ctx.restore();
      if (!still) this.t += 0.0013;
      const R = s.W < 760 ? 120 : 170;
      ctx.lineWidth = 1.1;
      for (let k = 0; k < (still ? 70 : 1); k++) {
        for (const p of this.ps) {
          const a = this.angle(p.x, p.y, this.t);
          let vx = Math.cos(a) * 0.42, vy = Math.sin(a) * 0.42;
          let near = false;
          if (pointer.active) {
            const dx = p.x - pointer.sx, dy = p.y - pointer.sy, d = Math.hypot(dx, dy);
            if (d < R && d > 0.1) {
              const f = 1 - d / R; near = true;
              vx += (-dy / d) * f * 1.7 - (dx / d) * f * 0.35;
              vy += (dx / d) * f * 1.7 - (dy / d) * f * 0.35;
            }
          }
          p.px = p.x; p.py = p.y; p.x += vx; p.y += vy; p.life--;
          ctx.strokeStyle = (p.gold || near) ? rgba(pal.acc, near ? 0.95 : 0.72) : rgba(pal.ink, pal.light ? 0.4 : 0.4);
          ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
          if (p.life < 0 || p.x < -10 || p.x > s.W + 10 || p.y < -10 || p.y > s.H + 10) this.spawn(p, s);
        }
      }
    },
  };

  scenes.terrain = {
    name: 'Terrain',
    init(s) { this.t = 0; this.cols = s.W < 760 ? 40 : 66; this.rows = s.W < 760 ? 24 : 32; },
    draw(s) {
      const { ctx, pal, pointer, W, H } = s;
      ctx.clearRect(0, 0, W, H);
      if (!s.still()) this.t += 0.0036;
      const t = this.t, cols = this.cols, rows = this.rows;
      const f = Math.min(W, 1200) * 0.9, horizon = H * 0.42, camY = 150, spanX = 1700, depth = 1400, near = 260;
      for (let r = rows - 1; r >= 0; r--) {
        const z = near + (r / (rows - 1)) * depth;
        const fade = 1 - r / rows;
        const row = [];
        for (let c = 0; c < cols; c++) {
          const X = (c / (cols - 1) - 0.5) * spanX;
          let h = 26 * Math.sin(X * 0.006 + t * 1.3) + 22 * Math.cos(z * 0.007 - t) + 12 * Math.sin((X + z) * 0.011 + t * 1.7);
          const bx = W / 2 + (X * f) / z, by = horizon + (camY * f) / z;
          let lift = 0;
          if (pointer.active) {
            const d = Math.hypot(bx - pointer.sx, (by - pointer.sy) * 1.6);
            lift = Math.max(0, 1 - d / 190); lift = lift * lift * (3 - 2 * lift);
            h += lift * 120;
          }
          row.push([bx, horizon + ((camY - h) * f) / z, lift, h]);
        }
        ctx.strokeStyle = rgba(pal.ink, 0.05 + fade * (pal.light ? 0.18 : 0.15));
        ctx.lineWidth = 1;
        ctx.beginPath();
        row.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.stroke();
        for (const p of row) {
          const glow = Math.min(1, p[2] + Math.max(0, (p[3] - 40) / 60) * 0.35);
          const sz = 0.8 + fade * 2.4 + glow * 2.2;
          ctx.fillStyle = rgba(mix(pal.ink, pal.acc, glow), 0.2 + fade * 0.6 + glow * 0.3);
          ctx.fillRect(p[0] - sz / 2, p[1] - sz / 2, sz, sz);
        }
      }
    },
  };

  scenes.field = {
    name: 'Byte Field',
    init(s) {
      this.step = s.W < 600 ? 20 : 24;
      this.cells = [];
      const st = this.step, ox = (s.W % st) / 2 + st / 2, oy = (s.H % st) / 2 + st / 2;
      for (let y = oy; y < s.H; y += st) for (let x = ox; x < s.W; x += st) this.cells.push({ x, y, glow: 0, blink: 0 });
    },
    draw(s) {
      const { ctx, pal, pointer } = s;
      ctx.clearRect(0, 0, s.W, s.H);
      const R = s.W < 600 ? 110 : 160, base = pal.light ? 0.16 : 0.15, still = s.still();
      for (const c of this.cells) {
        const dx = c.x - pointer.sx, dy = c.y - pointer.sy, d = Math.hypot(dx, dy);
        const target = pointer.active ? Math.max(0, 1 - d / R) : 0;
        c.glow += (target - c.glow) * (still ? 1 : 0.09);
        if (!still && Math.random() < 0.0002) c.blink = 1;
        c.blink *= 0.965;
        const g = Math.min(1, c.glow * c.glow * 1.4 + c.blink * 0.9);
        const push = c.glow * 7, nx = d > 0.1 ? dx / d : 0, ny = d > 0.1 ? dy / d : 0;
        const sz = 2.4 + g * 4.2;
        ctx.fillStyle = rgba(mix(pal.ink, pal.acc, g), base + g * 0.85);
        ctx.fillRect(c.x + nx * push - sz / 2, c.y + ny * push - sz / 2, sz, sz);
      }
    },
  };

  scenes.net = {
    name: 'Constellation',
    init(s) {
      const n = Math.round(Math.min(110, (s.W * s.H) / 9500));
      this.pts = Array.from({ length: n }, () => ({
        x: Math.random() * s.W, y: Math.random() * s.H,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      }));
    },
    draw(s) {
      const { ctx, pal, pointer, W, H } = s;
      ctx.clearRect(0, 0, W, H);
      const link = W < 600 ? 95 : 125, reach = 190, still = s.still();
      for (const p of this.pts) {
        if (!still) { p.x += p.vx; p.y += p.vy; }
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        if (pointer.active) {
          const dx = p.x - pointer.sx, dy = p.y - pointer.sy, d = Math.hypot(dx, dy);
          if (d < 90 && d > 0.1) { p.x += (dx / d) * (90 - d) * 0.03; p.y += (dy / d) * (90 - d) * 0.03; }
        }
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < this.pts.length; i++) {
        const a = this.pts[i];
        for (let j = i + 1; j < this.pts.length; j++) {
          const b = this.pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = rgba(pal.ink, (1 - d / link) * (pal.light ? 0.32 : 0.3));
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        if (pointer.active) {
          const d = Math.hypot(a.x - pointer.sx, a.y - pointer.sy);
          if (d < reach) {
            ctx.strokeStyle = rgba(pal.acc, (1 - d / reach) * 0.75);
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(pointer.sx, pointer.sy); ctx.stroke();
          }
        }
      }
      for (const p of this.pts) {
        const near = pointer.active && Math.hypot(p.x - pointer.sx, p.y - pointer.sy) < reach;
        ctx.fillStyle = near ? rgba(pal.acc, 0.95) : rgba(pal.ink, pal.light ? 0.45 : 0.4);
        ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
      }
    },
  };

  // Orbit on the site: a large dotted planet rising from the bottom edge of the hero.
  scenes.orbit = {
    name: 'Orbit',
    init(s) {
      this.R = Math.max(s.W * 0.56, 420);
      this.cx = s.W / 2;
      this.cy = s.H + this.R * 0.3;
      this.rotY = 0; this.tiltX = -0.25; this.tX = -0.25;
      const n = s.W < 760 ? 900 : 1700, golden = Math.PI * (3 - Math.sqrt(5));
      this.pts = Array.from({ length: n }, (_, i) => {
        const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
        return [Math.cos(th) * r, y, Math.sin(th) * r];
      });
      this.arcs = [];
      for (let i = 0; i < 5; i++) this.addArc(0.22 * i);
    },
    addArc(t0) {
      for (let tries = 0; tries < 20; tries++) {
        const a = this.pts[(Math.random() * this.pts.length) | 0], b = this.pts[(Math.random() * this.pts.length) | 0];
        const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
        if (dot < 0.7 && dot > 0) { this.arcs.push({ a, b, t: t0, om: Math.acos(dot) }); return; }
      }
    },
    rot(v) {
      const cy = Math.cos(this.rotY), sy = Math.sin(this.rotY), cx = Math.cos(this.tiltX), sx = Math.sin(this.tiltX);
      const x1 = v[0] * cy + v[2] * sy, z1 = -v[0] * sy + v[2] * cy;
      return [x1, v[1] * cx - z1 * sx, v[1] * sx + z1 * cx];
    },
    draw(s) {
      const { ctx, pal, pointer, W, H } = s;
      const still = s.still();
      ctx.clearRect(0, 0, W, H);
      if (!still) this.rotY += 0.0008;
      this.tX = pointer.active ? -0.25 + ((pointer.sy / H) - 0.5) * 0.35 : -0.25;
      if (pointer.active && !still) this.rotY += ((pointer.sx / W) - 0.5) * 0.004;
      this.tiltX += (this.tX - this.tiltX) * 0.035;
      const R = this.R;
      const g = ctx.createRadialGradient(this.cx, this.cy, R * 0.6, this.cx, this.cy, R * 1.25);
      g.addColorStop(0, rgba(pal.acc, 0)); g.addColorStop(0.75, rgba(pal.acc, pal.light ? 0.06 : 0.08)); g.addColorStop(1, rgba(pal.acc, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      for (const v of this.pts) {
        const [x, y, z] = this.rot(v);
        const sx = this.cx + x * R, sy = this.cy - y * R;
        if (sy > H + 4 || sy < -4) continue;
        const front = (z + 1) / 2, sz = 1.1 + front * 2;
        ctx.fillStyle = rgba(pal.ink, 0.14 + front * front * 0.8);
        ctx.fillRect(sx - sz / 2, sy - sz / 2, sz, sz);
      }
      if (!still && Math.random() < 0.06 && this.arcs.length < 12) this.addArc(0);
      ctx.lineWidth = 1.3;
      for (const arc of this.arcs) {
        if (!still) arc.t += 0.003;
        const N = 48, so = Math.sin(arc.om) || 1, head = Math.min(1, arc.t), tail = Math.max(0, arc.t - 0.45);
        let prev = null;
        for (let i = 0; i <= N; i++) {
          const u = i / N, k1 = Math.sin((1 - u) * arc.om) / so, k2 = Math.sin(u * arc.om) / so, lift = 1 + Math.sin(u * Math.PI) * 0.18;
          const [x, y, z] = this.rot([(arc.a[0] * k1 + arc.b[0] * k2) * lift, (arc.a[1] * k1 + arc.b[1] * k2) * lift, (arc.a[2] * k1 + arc.b[2] * k2) * lift]);
          const pt = [this.cx + x * R, this.cy - y * R];
          if (prev && u <= head && u >= tail && z > -0.15) {
            ctx.strokeStyle = rgba(pal.acc, 0.2 + 0.65 * ((u - tail) / Math.max(0.01, head - tail)));
            ctx.beginPath(); ctx.moveTo(prev[0], prev[1]); ctx.lineTo(pt[0], pt[1]); ctx.stroke();
          }
          if (Math.abs(u - head) < 0.5 / N && head < 1 && z > -0.15) { ctx.fillStyle = rgba(pal.acc, 1); ctx.fillRect(pt[0] - 2.5, pt[1] - 2.5, 5, 5); }
          prev = pt;
        }
      }
      this.arcs = this.arcs.filter(a => a.t < 1.5);
    },
  };

  // Seed: particles form the One Bit acorn (used in the About panel).
  const NUT = 'M22 50 H78 C79.5 64 75 80.5 50 96 C25 80.5 20.5 64 22 50 Z';
  const CAP = 'M14 44.5 C14 31 29 23.5 50 23.5 C71 23.5 86 31 86 44.5 Q86 45.5 85 45.5 H15 Q14 45.5 14 44.5 Z';
  scenes.seed = {
    name: 'Seed',
    init(s) {
      const size = Math.min(s.H * 0.58, s.W * 0.46);
      this.scale = size / 100;
      this.ox = s.W - size - Math.max(16, s.W * 0.06);
      this.oy = s.H - size - s.H * 0.09;
      const off = document.createElement('canvas');
      off.width = off.height = 100;
      const o = off.getContext('2d');
      o.fillStyle = '#f00'; o.fill(new Path2D(CAP)); o.fillRect(45.5, 10, 9, 9);
      o.fillStyle = '#00f'; o.fill(new Path2D(NUT));
      const img = o.getImageData(0, 0, 100, 100).data;
      const step = size < 260 ? 2.8 : 2.3;
      this.ps = [];
      for (let y = 0; y < 100; y += step) for (let x = 0; x < 100; x += step) {
        const i = ((y | 0) * 100 + (x | 0)) * 4;
        if (img[i + 3] < 200) continue;
        const hx = this.ox + x * this.scale, hy = this.oy + y * this.scale;
        this.ps.push({ hx, hy, x: s.still() ? hx : Math.random() * s.W, y: s.still() ? hy : Math.random() * s.H, vx: 0, vy: 0, gold: img[i] > img[i + 2] });
      }
    },
    burst(s) {
      if (s.still()) return;
      const cx = this.ox + 50 * this.scale, cy = this.oy + 55 * this.scale;
      for (const p of this.ps) {
        const a = Math.atan2(p.hy - cy, p.hx - cx) + (Math.random() - 0.5) * 0.6, v = 5 + Math.random() * 8;
        p.vx += Math.cos(a) * v; p.vy += Math.sin(a) * v;
      }
    },
    draw(s) {
      const { ctx, pal, pointer } = s;
      ctx.clearRect(0, 0, s.W, s.H);
      const R = s.W < 600 ? 60 : 85, sz = this.scale < 2.6 ? 2 : 2.4, still = s.still();
      for (const p of this.ps) {
        if (!still) {
          let ax = (p.hx - p.x) * 0.011, ay = (p.hy - p.y) * 0.011;
          if (pointer.active) {
            const dx = p.x - pointer.sx, dy = p.y - pointer.sy, d = Math.hypot(dx, dy);
            if (d < R && d > 0.1) { const f = (1 - d / R) * 3; ax += (dx / d) * f; ay += (dy / d) * f; }
          }
          p.vx = (p.vx + ax) * 0.86; p.vy = (p.vy + ay) * 0.86;
          p.x += p.vx; p.y += p.vy;
        }
        const away = Math.min(1, Math.hypot(p.x - p.hx, p.y - p.hy) / 60);
        ctx.fillStyle = p.gold ? rgba(pal.acc, 0.95) : rgba(pal.ink, 0.88 - away * 0.35);
        ctx.fillRect(p.x - sz / 2, p.y - sz / 2, sz, sz);
      }
    },
  };

  // ---------- hero: scene per visit + switcher ----------
  const HERO_SCENES = ['flow', 'terrain', 'field', 'net', 'orbit'];
  const heroStage = document.getElementById('hero-stage');
  if (heroStage) {
    const stage = createStage(heroStage, heroStage.querySelector('.fx-canvas'));
    const buttons = [...heroStage.querySelectorAll('[data-scene]')];
    const nameEl = heroStage.querySelector('[data-scene-name]');
    const pauseBtn = heroStage.querySelector('[data-scene-pause]');

    // A visitor's own pick wins; otherwise each visit opens on the next scene.
    let key = store.get('ab-scene-pick');
    if (!HERO_SCENES.includes(key)) {
      const next = ((parseInt(store.get('ab-scene-visit'), 10) || 0) + 1) % HERO_SCENES.length;
      store.set('ab-scene-visit', String(next));
      key = HERO_SCENES[next];
    }
    stage.paused = store.get('ab-scene-paused') === '1';

    const show = k => {
      key = k;
      heroStage.dataset.scene = k;
      buttons.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.scene === k)));
      if (nameEl) nameEl.textContent = scenes[k].name;
      stage.setScene(scenes[k]);
      stage.kick();
    };
    buttons.forEach(b => b.addEventListener('click', () => { store.set('ab-scene-pick', b.dataset.scene); show(b.dataset.scene); }));
    const syncPause = () => {
      if (!pauseBtn) return;
      pauseBtn.setAttribute('aria-pressed', String(stage.paused));
      pauseBtn.textContent = stage.paused ? 'Play' : 'Pause';
      pauseBtn.setAttribute('aria-label', stage.paused ? 'Play background motion' : 'Pause background motion');
    };
    pauseBtn?.addEventListener('click', () => {
      stage.paused = !stage.paused;
      store.set('ab-scene-paused', stage.paused ? '1' : '0');
      syncPause();
      if (stage.paused) stage.setScene(scenes[key]); else stage.kick();
    });
    syncPause();
    show(key);
  }

  // ---------- About panel: Seed ----------
  const about = document.querySelector('.about-panel');
  const aboutCanvas = about?.querySelector('.fx-canvas');
  if (about && aboutCanvas) {
    const stage = createStage(about, aboutCanvas);
    stage.setScene(scenes.seed);
    stage.kick();
  }
})();
