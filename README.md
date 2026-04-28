# 🚀 Artemis II — 3D Space Experience

A scroll-driven 3D storytelling website built with React, Three.js, and GSAP.
Inspired by NASA's Artemis II mission.

---

## Quick Start (For Teammates)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

That's it. No special setup needed.

---

## Project Structure

```
src/
├── context/
│   └── SceneContext.jsx     ← Shared state between ALL 3D sections
│
├── components/
│   ├── SceneManager.jsx     ← The ONE global Canvas lives here
│   ├── HeroScene.jsx        ← Lights, stars, camera logic
│   ├── Earth.jsx            ← The 3D Earth sphere + atmosphere
│   └── HeroOverlay.jsx      ← The text (Title, Subtitle, Stats)
│
├── App.jsx                  ← Root: mounts SceneManager + overlays
├── main.jsx                 ← React entry point
└── index.css                ← Global resets and scrollbar style
```

---

## The Most Important Rule: ONE Canvas Only

This project uses **a single `<Canvas>` that never unmounts**.

**Why does this matter?**

In React Three Fiber, every `<Canvas>` creates its own WebGL context.
If you had a Canvas in the Hero, another in the Mission section, another
in the Crew section — each one would:
- Create a brand new 3D scene from scratch
- Forget all camera positions
- Restart all animations
- Cause jarring jumps and resets

Instead, the Canvas is **fixed to the screen** (like a background layer),
and all the page sections scroll *over* it. The 3D scene keeps running
the whole time.

Think of it like a movie projector that stays on — we just change what's
in front of it as the user scrolls.

---

## How the Architecture Works (Mirabel — read this!)

### 1. The Fixed Canvas Pattern

```
┌─────────────────────────────────┐
│  <Canvas> — position: fixed     │  ← Always visible, never moves
│  (the 3D world lives here)      │
│                                 │
│   Stars, Earth, Moon, Lights    │
└─────────────────────────────────┘
         ↑ sits behind everything

┌─────────────────────────────────┐
│  DOM content — scrolls normally │  ← Text, buttons, sections
│  position: relative, z-index: 1 │
└─────────────────────────────────┘
```

The user scrolls the DOM. The Canvas doesn't scroll — but it *reacts*
to scroll through the `scrollProgress` value.

### 2. SceneContext — The Shared Brain

`SceneContext.jsx` is a React Context that holds three refs:

```js
const earthRef      = useRef()   // points to the Earth mesh
const cameraRef     = useRef()   // points to the R3F camera
const scrollProgress = useRef()  // a number from 0 to 1 (scroll position)
```

**What is a `ref`?**
A `useRef` is like a sticky note attached to a real object.
When you write `earthRef.current.rotation.y = 0.5`, you're directly
moving the Earth in 3D space — no re-render, no delay. This is important
for animation, where we need 60 updates per second.

**Why not `useState` for scrollProgress?**
`useState` triggers a re-render every time it changes.
Scroll fires dozens of times per second — using `useState` would cause
hundreds of unnecessary re-renders. A `ref` updates silently. ✅

### 3. How Scroll Drives the Animation

In `SceneManager.jsx`, there's a `ScrollTracker` component that listens
to the scroll event:

```js
const handleScroll = () => {
  const maxScroll = window.innerHeight   // one screen height = "full scroll"
  const current = Math.min(window.scrollY / maxScroll, 1)
  scrollProgress.current = current       // 0 at top, 1 at bottom of hero
}
```

Then in `HeroScene.jsx`, the `CameraController` component reads this
inside `useFrame` (which runs 60 times per second):

```js
useFrame(() => {
  const t = scrollProgress.current          // 0 → 1
  const targetZ = 6 + (3.5 - 6) * t        // camera moves from z=6 to z=3.5
  camera.position.z += (targetZ - camera.position.z) * 0.05  // smooth lerp
})
```

**What is lerp?**
"Lerp" = Linear Interpolation. Instead of jumping straight to the target,
we move 5% of the remaining distance each frame. This creates smooth,
cinematic movement.

```
Frame 1: position = 6.0, target = 3.5 → move to 5.875  (moved 5%)
Frame 2: position = 5.875, target = 3.5 → move to 5.756
Frame 3: ...and so on, smoothly approaching 3.5
```

### 4. The Earth Component

`Earth.jsx` also uses `useFrame` for its animations:

```js
useFrame((state, delta) => {
  // delta = time since last frame (usually ~0.016 seconds at 60fps)
  
  resolvedRef.current.rotation.y += delta * 0.06   // slow idle spin
  
  floatOffset.current += delta * 0.4
  resolvedRef.current.position.y = Math.sin(floatOffset.current) * 0.06  // float
  
  resolvedRef.current.position.x = scrollProgress.current * 0.5   // drift right on scroll
})
```

The `Suspense` wrapper means: show the fallback (blue sphere) while the
real textures are downloading, then swap in the textured version.

### 5. GSAP + ScrollTrigger (Overlay Text)

`HeroOverlay.jsx` handles the DOM text. It uses two GSAP techniques:

**Entrance animations** — play once on page load:
```js
gsap.fromTo(titleRef.current,
  { opacity: 0, y: 50 },          // FROM: invisible, 50px below
  { opacity: 1, y: 0,             // TO: visible, in place
    duration: 1.4, delay: 0.6 }   // takes 1.4 seconds, starts after 0.6s
)
```

**Scroll-driven exit** — fades out as user scrolls:
```js
ScrollTrigger.create({
  start: 'top top',
  end: '40% top',
  scrub: 1.2,                      // "scrub" = tied to scroll position
  onUpdate: (self) => {
    overlay.style.opacity = 1 - self.progress * 1.5   // fade out
    overlay.style.transform = `translateY(${-self.progress * 60}px)`  // rise up
  }
})
```

---

## How to Add the Next Section (Teammate Guide)

Say you want to add a "Meet the Crew" section below the hero.

### Step 1 — Create a DOM overlay component

```jsx
// src/components/CrewOverlay.jsx
export function CrewOverlay() {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      height: '100vh',
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    }}>
      <h2>Meet the Crew</h2>
    </div>
  )
}
```

### Step 2 — Add a 3D scene component (renders inside the Canvas)

```jsx
// src/components/CrewScene.jsx
import { useScene } from '../context/SceneContext'
import { useFrame } from '@react-three/fiber'

export function CrewScene() {
  const { earthRef, scrollProgress } = useScene()

  useFrame(() => {
    const t = scrollProgress.current
    // Example: continue moving Earth as scroll goes past 1.0
    if (earthRef.current) {
      earthRef.current.scale.setScalar(1 + t * 0.3)  // Earth grows slightly
    }
  })

  return null  // or add new 3D objects here
}
```

### Step 3 — Register in SceneManager and App

In `SceneManager.jsx`:
```jsx
// Inside CanvasContent:
<HeroScene />
<CrewScene />   ← add this
```

In `SceneManager.jsx`, increase the scroll spacer height:
```jsx
<div style={{ height: '600vh' }} />   // was 300vh, now gives more scroll room
```

In `App.jsx`:
```jsx
<HeroOverlay />
<CrewOverlay />   ← add this
```

**The Earth, camera, and stars are already there. You're just continuing
the journey, not starting a new one.**

---

## Scroll Progress Ranges by Section

Use these ranges when writing scroll-based animations so sections
don't fight each other:

| Section | scrollProgress range | Scroll distance |
|---------|---------------------|-----------------|
| Hero    | 0.0 → 1.0           | 0 to 100vh      |
| Section 2 | 1.0 → 2.0         | 100vh to 200vh  |
| Section 3 | 2.0 → 3.0         | 200vh to 300vh  |

To target section 2 animations only, check `scrollProgress.current > 1.0`.

---

## Earth Textures

The Earth loads textures from Three.js's GitHub:
- Color map (the actual satellite photo look)
- Normal map (gives the surface fake 3D bumps under light)
- Specular map (controls which parts are shiny — oceans — vs matte — land)

If these URLs ever break or load slowly, the `<Suspense>` fallback kicks in
and shows a plain blue-green sphere until textures arrive. For production,
download the textures and host them in `public/textures/`.

---

## Tech Stack & What Each Library Does

| Library | What it does in this project |
|---------|------------------------------|
| **React** | UI component structure |
| **Vite** | Dev server + build tool (fast) |
| **Three.js** | The 3D engine — creates the WebGL scene |
| **React Three Fiber** | Lets you write Three.js as React components |
| **@react-three/drei** | Helper components: `<Stars />`, `<OrbitControls />`, etc |
| **GSAP** | Animation library for the DOM text |
| **ScrollTrigger** | GSAP plugin — links animations to scroll position |
| **Tailwind CSS** | Utility CSS classes (not heavily used here, ready for sections) |

---

## Common Questions

**Q: Why is the Canvas `position: fixed`?**
So it doesn't scroll with the page. The page content scrolls over it
like a transparency over a projector.

**Q: Why `useRef` instead of `useState` for the Earth?**
React re-renders the component whenever state changes. For 3D animation,
we need to update objects 60 times per second — using state would be
extremely expensive. Refs let us update objects directly without React
even knowing about it.

**Q: What is `useFrame`?**
A React Three Fiber hook that runs a function every animation frame
(60fps). It's like `requestAnimationFrame` but scoped to the R3F Canvas.

**Q: How do I add a new planet/object to the scene?**
Add it inside `HeroScene.jsx` (or create a new scene component and
register it in `CanvasContent` inside `SceneManager.jsx`).

**Q: The Earth textures aren't loading — what do I do?**
The `<Suspense>` fallback will show a blue sphere automatically.
For a permanent fix, download the texture files from the Three.js repo
and put them in `public/textures/`, then update the URLs in `Earth.jsx`.

---

## Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Deploy that folder to Netlify,
Vercel, or any static host.

---

*Built with React Three Fiber + GSAP. Architecture designed for
multi-section scroll storytelling with a single persistent WebGL scene.*
