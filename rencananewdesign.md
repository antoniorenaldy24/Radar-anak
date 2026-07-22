# 🏆 RADAR ANAK — Redesign v3: "Awwwards-Level Craft"

> Setiap teknik di bawah ini adalah teknik yang **benar-benar digunakan** di situs-situs pemenang Awwwards. Bukan generik, bukan template — ini adalah craft yang bikin website terasa **"mahal"**.

---

## 8 Teknik Inti yang Diimplementasi

| # | Teknik | Library | Lokasi |
|---|--------|---------|--------|
| 1 | **Kinetic Typography** | SplitType + GSAP (stagger, rotateX, skewY, custom cubic-bezier) | Hero, semua section headings |
| 2 | **Scroll-Driven Storytelling** | GSAP ScrollTrigger (pin, scrub, snap, timelines) | Story, Dampak, Gallery — section = "scene" |
| 3 | **Smooth Scroll + Momentum** | Lenis (tuned params: duration 1.4, lerp smoothing) | Seluruh halaman |
| 4 | **Custom Cursor + Magnetic Buttons** | GSAP spring physics + mouse proximity detection | Cursor global, semua CTA |
| 5 | **WebGL Image Distortion Shader** | OGL (~20KB) + custom GLSL displacement fragment shader | Gallery image hover |
| 6 | **Film Grain/Noise Texture Overlay** | Inline SVG `feTurbulence` filter + CSS `mix-blend-mode` | Full-page overlay |
| 7 | **Page Transition (Route)** | Next.js 16 `<ViewTransition>` + CSS `::view-transition` animations | Navigasi ke `/dashboard` |
| 8 | **Generative Noise Field Background** | Canvas 2D Simplex noise (organic flowing shapes) | Hero section background |

---

## Teknik 1: Kinetic Typography

**Bukan** sekadar `opacity: 0 → 1` atau `y: 30 → 0`. Ini adalah **dramatic character-level choreography**.

### Hero Headline: "RADAR ANAK"
```
Tiap karakter masuk dari bawah dengan rotasi 3D + skew:
  - from: { y: '120%', rotateX: -80, skewY: 8, opacity: 0, scale: 0.6 }
  - to:   { y: '0%',   rotateX: 0,   skewY: 0, opacity: 1, scale: 1 }
  - stagger: 0.04s
  - ease: CustomEase "expo.out" → cubic-bezier(0.16, 1, 0.3, 1)
  - duration: 1.2s
  - perspective parent: 1000px (membuat rotateX terasa 3D)
```

### Section Headings: Scroll-Synced Word Reveal
```
Setiap kata opacity 0.15 → 1.0, scrubbed ke scroll position:
  - SplitType(words)
  - ScrollTrigger: scrub: 0.5 (buttery smooth)
  - Setiap word: opacity dari 0.15 → 1 secara berurutan
  - User literally "reads" the heading by scrolling
```

### Subtitle Text: Line-by-Line Clip Reveal
```
Setiap baris di-clip dari bawah:
  - SplitType(lines)
  - clip-path: inset(0 0 100% 0) → inset(0 0 0% 0)
  - stagger: 0.1s per line
  - Triggered on scroll enter
```

---

## Teknik 2: Scroll-Driven Storytelling

Setiap section bukan "scroll biasa" — ini **scene** dalam cerita.

### Scene Architecture
```
SCENE 1 — HERO (pinned, scale-down exit)
   ↓ scroll melanjutkan cerita
SCENE 2 — MARQUEE DIVIDER (velocity-reactive)
   ↓ 
SCENE 3 — STORY (pinned split, clip-path wipe reveal)
   ↓
SCENE 4 — DAMPAK (staggered 3D card entrance)
   ↓
SCENE 5 — MARQUEE DIVIDER #2
   ↓
SCENE 6 — MAP (parallax entrance)
   ↓
SCENE 7 — GALLERY (WebGL distortion hover)
   ↓
SCENE 8 — DONASI (form entrance)
   ↓
SCENE 9 — FOOTER (massive text clip reveal)
```

### Hero → Story Transition (Scale-Down Peel)
```javascript
// Hero di-pin, lalu scale down sambil border + shadow muncul
gsap.timeline({
  scrollTrigger: {
    trigger: heroSection,
    start: 'top top',
    end: '+=100%',      // 1 viewport scroll
    scrub: 1,           // buttery smooth sync
    pin: true,
  }
})
.to('.hero-card', {
  scale: 0.85,
  rotateX: 4,           // subtle 3D tilt
  opacity: 0.3,
  borderColor: '#121212',
  boxShadow: '12px 12px 0px 0px #121212',
  transformOrigin: 'center top',
  ease: 'none',         // linear — scroll controls speed
});
```

### Story Section (Pinned Clip-Path Wipe)
```javascript
// Section di-pin selama 250vh scroll. 
// Panel kanan terungkap via clip-path, scrubbed ke scroll.
gsap.timeline({
  scrollTrigger: {
    trigger: storySection,
    start: 'top top',
    end: '+=250%',
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  }
})
// Phase 1: Klaim text reads (word-by-word opacity scrub)
.to('.klaim-words .word', { opacity: 1, stagger: 0.05, duration: 0.3 })
// Phase 2: Reality panel wipes in from right  
.to('.reality-panel', { 
  clipPath: 'inset(0 0% 0 0)',  // reveal from right
  duration: 0.4 
})
// Phase 3: Stats animate in
.from('.stat-bar-fill', { scaleX: 0, stagger: 0.08, duration: 0.2 })
.from('.stat-number', { textContent: 0, snap: { textContent: 1 }, duration: 0.2 }, '<');
```

---

## Teknik 3: Smooth Scroll + Momentum

### Lenis Tuning (bukan default params)
```javascript
const lenis = new Lenis({
  duration: 1.4,          // slightly longer = more "luxury" feel
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo decay
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 1.5,   // better mobile feel  
});

// Expose scroll velocity untuk marquee speed control
lenis.on('scroll', ({ velocity }) => {
  ScrollTrigger.update();
  // Velocity digunakan oleh VelocityMarquee component
  window.__lenisVelocity = velocity;
});
```

---

## Teknik 4: Custom Cursor + Magnetic Buttons

### Sticker Cursor
```
Cursor utama:
  - Lingkaran kecil (12px) warna #121212
  - Mengikuti mouse dengan GSAP spring: { x, y, ease: 'power3.out', duration: 0.5 }
  - mix-blend-mode: difference (selalu terlihat di atas warna apapun)

Saat hover elemen interaktif:
  - Scale up ke 60px
  - Menampilkan label teks (e.g. "LIHAT", "KLIK", "EXPLORE")
  - Background berubah ke accent color

Saat hover gambar (Gallery):
  - Scale ke 80px
  - Label "LIHAT KARYA"
  - Border-radius tetap circle
```

### Magnetic Buttons
```javascript
// Setiap button memiliki "medan magnet" radius ~80px
// Saat cursor mendekat, button bergerak sedikit ke arah cursor

button.addEventListener('mousemove', (e) => {
  const rect = button.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;
  const distance = Math.sqrt(x * x + y * y);
  
  if (distance < 80) {
    gsap.to(button, {
      x: x * 0.3,      // 30% attraction strength
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  }
});

button.addEventListener('mouseleave', () => {
  gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  // elastic.out memberikan efek "snap back" yang satisfying
});
```

---

## Teknik 5: WebGL Image Distortion Shader (OGL)

Ini yang membuat situs awwwards terasa **"mahal"**. Saat hover gambar di Gallery, gambar di-distort dengan efek liquid/ripple.

### Implementasi
```
Stack: OGL (lightweight WebGL, ~20KB gzipped) + custom GLSL shader

Flow:
1. Setiap gambar di Gallery di-render sebagai OGL Mesh dengan PlaneGeometry
2. Texture gambar di-load ke GPU
3. Displacement map (Perlin noise texture, di-generate via canvas) di-pass ke shader
4. Uniform `uHover` (0.0 → 1.0) di-tween oleh GSAP saat hover
5. Fragment shader menggunakan uHover untuk mengontrol intensitas distortion
```

### Fragment Shader (GLSL)
```glsl
precision highp float;

uniform sampler2D uTexture;          // gambar utama
uniform sampler2D uDisplacement;     // noise displacement map
uniform float uHover;                // 0.0 = normal, 1.0 = full distort
uniform float uTime;                 // untuk subtle animation

varying vec2 vUv;

void main() {
    vec4 displacement = texture2D(uDisplacement, vUv);
    
    // Distort UV coordinates berdasarkan displacement + hover intensity
    float displaceForce = displacement.r * uHover * 0.15;
    
    vec2 distortedUV = vec2(
        vUv.x + displaceForce * sin(vUv.y * 10.0 + uTime),
        vUv.y + displaceForce * cos(vUv.x * 10.0 + uTime)
    );
    
    vec4 color = texture2D(uTexture, distortedUV);
    gl_FragColor = color;
}
```

### GSAP Integration
```javascript
// Hover in: tween uHover ke 1.0 dengan ease smooth
img.addEventListener('mouseenter', () => {
  gsap.to(mesh.program.uniforms.uHover, {
    value: 1.0,
    duration: 1.0,
    ease: 'power2.out'
  });
});

// Hover out: tween kembali ke 0.0 
img.addEventListener('mouseleave', () => {
  gsap.to(mesh.program.uniforms.uHover, {
    value: 0.0,
    duration: 0.8,
    ease: 'power2.inOut'
  });
});
```

---

## Teknik 6: Film Grain/Noise Texture Overlay

Subtle film-grain di atas SELURUH layout. Memberikan tekstur tanpa mengganggu readability.

### Implementasi (Zero Network Requests)
```html
<!-- Inline SVG filter — no external assets needed -->
<svg style="display: none;">
  <filter id="grain-filter">
    <feTurbulence 
      type="fractalNoise" 
      baseFrequency="0.65" 
      numOctaves="3" 
      stitchTiles="stitch" />
    <feColorMatrix 
      type="saturate" 
      values="0" />
  </filter>
</svg>
```

```css
/* Full-page grain overlay */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.04;                    /* sangat subtle — hanya kasih tekstur */
  mix-blend-mode: multiply;
}
.grain-overlay::after {
  content: '';
  position: absolute;
  inset: -200%;                     /* oversized untuk animation */
  filter: url(#grain-filter);
  animation: grain-shift 0.5s steps(4) infinite;
}

@keyframes grain-shift {
  0%, 100% { transform: translate(0, 0); }
  25%      { transform: translate(-2%, -3%); }
  50%      { transform: translate(3%, 1%); }
  75%      { transform: translate(-1%, 4%); }
}
```

> Efeknya: halaman terasa seperti dicetak di atas kertas bertekstur. Sangat subtle, tapi otak kita mendeteksinya sebagai "premium".

---

## Teknik 7: Page Transition (Route)

Next.js 16 mendukung `<ViewTransition>` secara native.

### Setup
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
};
```

### CSS Transition Animations
```css
/* Halaman keluar: slide up + fade */
::view-transition-old(root) {
  animation: page-exit 0.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

/* Halaman masuk: slide up from bottom + fade in */
::view-transition-new(root) {
  animation: page-enter 0.5s cubic-bezier(0.65, 0, 0.35, 1) forwards;
}

@keyframes page-exit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-30px); }
}

@keyframes page-enter {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Shared Element Transitions
```css
/* Elemen "RADAR ANAK" brand text di hero + footer + dashboard header 
   bisa morph antar halaman */
.brand-text {
  view-transition-name: brand-identity;
}
```

> Navigasi ke `/dashboard` akan terasa seperti **scene change**, bukan page reload.

---

## Teknik 8: Generative Noise Field Background

Canvas 2D organic noise field untuk hero background — bukan gradient statis, bukan particles, ini **flowing organic shapes**.

### Konsep
```
- Canvas full-viewport di belakang hero content
- Simplex noise algorithm menghasilkan flowing blob shapes
- Warna: accent yellow (#FDE047) dengan opacity sangat rendah (5-8%)
- Shape bergerak sangat lambat — terasa "hidup" tapi tidak distracting
- Di-combine dengan SVG grid pattern yang sudah ada
```

### Implementasi
```javascript
// Simplified Simplex noise field
function drawNoiseField(ctx, time) {
  const { width, height } = ctx.canvas;
  
  for (let x = 0; x < width; x += 20) {
    for (let y = 0; y < height; y += 20) {
      const noise = simplex.noise3D(x * 0.003, y * 0.003, time * 0.0003);
      
      if (noise > 0.3) {
        ctx.fillStyle = `rgba(253, 224, 71, ${noise * 0.08})`; // yellow, very transparent
        ctx.beginPath();
        ctx.arc(x, y, noise * 15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// RAF loop — 30fps cap untuk performance
let lastFrame = 0;
function animate(time) {
  if (time - lastFrame > 33) { // ~30fps
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawNoiseField(ctx, time);
    lastFrame = time;
  }
  requestAnimationFrame(animate);
}
```

---

## Section Flow Lengkap

### 1️⃣ HERO
- **BG**: `#FAF9F5` + Canvas noise field + SVG grid (opacity 10%)
- **Headline**: "RADAR ANAK: DETEKSI DINI HAK SEKOLAH" — Kinetic char-by-char (Teknik 1)
- **Subtitle**: Line-by-line clip reveal
- **CTAs**: Magnetic buttons (Teknik 4)  
- **Badge**: Slide-in + rotate entrance
- **Scroll indicator**: Bouncing chevron with fade pulse
- **Exit**: Pin → scale(0.85) + rotateX(4°) + shadow appear (Teknik 2)

### 2️⃣ MARQUEE DIVIDER
- **BG**: `#121212` (dark strip)
- **Content**: "DETEKSI • LAPOR • RUJUK • SEKOLAHKAN" — infinite scroll
- **Speed**: Tied ke Lenis scroll velocity (Teknik 3) — scroll cepat = marquee cepat

### 3️⃣ STORY (Pinned Scene)
- **BG**: `#FAF9F5` (kiri) + `#FDE047` hanya panel kanan reveal
- **Pinned**: 250vh scroll distance
- **Left panel**: Klaim text — word-by-word opacity scrub (Teknik 1)
- **Right panel**: Clip-path wipe dari kanan — reveal kenyataan (Teknik 2)
- **Stats**: Bar fill + counter scrubbed ke scroll
- **Stickers**: Floating decorative shapes parallax (brutalist stars, arrows)

### 4️⃣ DAMPAK (3D Card Entrance)
- **BG**: `#FAF9F5` — clean, no background color
- **Heading**: Word-by-word scrub reveal
- **3 Cards**: `from({y:120, rotateX:15, rotateZ:random(-4,4), scale:0.8, opacity:0})` stagger 0.2s
- **Tilt effect**: Mouse-tracking 3D rotation on hover (Teknik 4)
- **Counters**: Odometer snap count dari 0
- **Hover**: `translateY(-10px)` + shadow grows + `scale(1.03)` + elastic ease

### 5️⃣ MARQUEE DIVIDER #2
- **BG**: `#E11D48` (rose accent)
- **Content**: "5 ANAK BERHASIL KEMBALI BERSEKOLAH" — infinite scroll

### 6️⃣ MAP
- **BG**: `#FAF9F5`
- **Heading**: Char-by-char scroll reveal
- **Map**: OpenStreetMap standard tiles, `scale(0.95) opacity(0)` → normal entrance
- **Markers**: Custom pulse markers + brutalist popups

### 7️⃣ GALLERY (WebGL Distortion)
- **BG**: `#F3F0EB` (subtle warm alternation)
- **Heading**: Word-by-word scrub
- **Images**: OGL WebGL distortion shader on hover (Teknik 5)
- **Cards**: Staggered masonry entrance + tilt hover
- **Cursor**: Changes to "LIHAT KARYA" label on image hover

### 8️⃣ DONASI
- **BG**: `#FAF9F5`
- **Form card**: `from({y:60, opacity:0})` entrance
- **Input focus**: Border accent transition + subtle shadow glow
- **Submit**: Magnetic button + loading shimmer

### 9️⃣ FOOTER
- **BG**: `#121212`
- **"RADAR ANAK"**: Massive serif (15vw), clip-path reveal dari bawah scrubbed ke scroll
- **Links**: Staggered fade-in, magnetic micro-hover

---

## New Dependencies

```json
{
  "ogl": "^1.0.8",
  "simplex-noise": "^4.0.3"
}
```

| Package | Size (gzipped) | Fungsi |
|---------|---------------|--------|
| `ogl` | ~20KB | WebGL image distortion shader (Gallery hover) |
| `simplex-noise` | ~3KB | Generative noise field (Hero background) |

> Total tambahan: **~23KB gzipped**. Sangat ringan. Tanpa Three.js (150KB+).

---

## Proposed File Changes

### Config

#### [MODIFY] [next.config.ts](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/next.config.ts)
- Enable `experimental.viewTransition: true`

#### [MODIFY] [config.ts](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/lib/motion/config.ts)
- Add custom easings: `spring`, `elastic`, `dramatic`
- Add durations: `dramatic: 1.2`, `epic: 1.6`
- Add scroll-scrub presets

---

### Design System

#### [MODIFY] [globals.css](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/styles/globals.css)
- Add grain overlay styles + SVG filter
- Add `::view-transition` CSS animations
- Add marquee keyframes
- Add perspective utility classes
- Refine color palette (less per-section colors)
- Add noise-field canvas styles

#### [MODIFY] [layout.tsx](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/app/layout.tsx)
- Add `JetBrains Mono` as third font (data/mono accent)
- Add inline SVG grain filter to body
- Add grain overlay div
- Wrap with `<ViewTransition>` component

---

### New Components (10 files)

| File | Teknik |
|------|--------|
| **[NEW]** `components/public/StickerCursor.tsx` | Teknik 4 — custom cursor dot, label display, mix-blend-mode |
| **[NEW]** `components/public/MagneticButton.tsx` | Teknik 4 — button dengan proximity attraction + elastic snapback |
| **[NEW]** `components/public/KineticText.tsx` | Teknik 1 — reusable char/word/line reveal wrapper, configurable trigger |
| **[NEW]** `components/public/ScrollScene.tsx` | Teknik 2 — reusable pinned scroll section wrapper, configurable duration |
| **[NEW]** `components/public/VelocityMarquee.tsx` | Teknik 3 — infinite scroll ticker, speed linked ke Lenis velocity |
| **[NEW]** `components/public/TiltCard.tsx` | Teknik 4 — card dengan 3D mouse-tracking rotation |
| **[NEW]** `components/public/WebGLImage.tsx` | Teknik 5 — OGL-powered image dengan GLSL distortion on hover |
| **[NEW]** `components/public/GrainOverlay.tsx` | Teknik 6 — SVG feTurbulence filter + animated grain |
| **[NEW]** `components/public/NoiseCanvas.tsx` | Teknik 8 — Canvas 2D simplex noise generative background |
| **[NEW]** `components/public/ParallaxSticker.tsx` | Floating decorative neo-brutalist elements + parallax scroll |

### Modified Components (5 files)

| File | Perubahan |
|------|-----------|
| **[MODIFY]** [Button.tsx](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/components/public/Button.tsx) | Add magnetic variant, upgrade hover animations |
| **[MODIFY]** [Card.tsx](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/components/public/Card.tsx) | Add tilt variant, perspective transform support |
| **[MODIFY]** [StatCounter.tsx](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/components/public/StatCounter.tsx) | Odometer snap effect, JetBrains Mono font, larger sizing |
| **[MODIFY]** [MapTransparency.tsx](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/components/public/MapTransparency.tsx) | OpenStreetMap tiles, animated markers, brutalist popups |
| **[MODIFY]** [SmoothScrollProvider.tsx](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/components/public/SmoothScrollProvider.tsx) | Expose scroll velocity, tune Lenis params |

### Pages

| File | Perubahan |
|------|-----------|
| **[MODIFY]** [page.tsx](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/app/%28public%29/page.tsx) | **Complete rewrite** — semua 9 scenes + semua 8 teknik terintegrasi |
| **[MODIFY]** [layout.tsx (public)](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/app/%28public%29/layout.tsx) | Add StickerCursor, GrainOverlay, refined theme class |
| **[MODIFY]** [layout.tsx (root)](file:///c:/Users/renal/Downloads/RadarAnak%28KKN%29/app/layout.tsx) | Add JetBrains Mono font, ViewTransition, grain SVG |

---

## Verification Plan

### Performance
- Target: 60fps pada semua animasi scroll (Chrome DevTools Performance)
- Lighthouse Performance: > 80
- OGL WebGL: hanya aktif di desktop (gsap.matchMedia)
- Canvas noise field: 30fps cap, disabled on mobile
- Grain overlay: pure CSS, zero JS cost

### Responsive Strategy
- **Mobile** (< 768px): Disable WebGL distortion, tilt, magnetic cursor, noise canvas. Keep kinetic text + scroll storytelling
- **Tablet** (768-1024px): Reduced tilt intensity, no WebGL, keep scroll scenes
- **Desktop** (> 1024px): Full experience — all 8 techniques active

### Build
- `npm run build` → no errors
- No hydration mismatches (semua animasi `"use client"`)
- View Transitions: graceful fallback di browser yang belum support

### Manual Testing
- Smooth scroll tidak conflict dengan GSAP ScrollTrigger pins
- Map scroll tidak hijack page scroll
- WebGL canvas cleanup proper (no memory leaks)
- Grain overlay tidak mengganggu interaktivitas (pointer-events: none)
- `prefers-reduced-motion`: semua animasi disabled gracefully
