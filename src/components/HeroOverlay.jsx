import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function HeroOverlay() {
  const overlayRef   = useRef(null)
  const titleRef     = useRef(null)
  const subtitleRef  = useRef(null)
  const badgeRef     = useRef(null)
  const scrollHintRef = useRef(null)
  const statsRef     = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // === ENTRANCE ANIMATION ===
      // Badge
      gsap.fromTo(badgeRef.current,
        { opacity: 0, y: -20, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out', delay: 0.3 }
      )

      // Title — staggered letter-by-line reveal
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50, skewY: 2 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.4, ease: 'power4.out', delay: 0.6 }
      )

      // Subtitle
      gsap.fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 1.0 }
      )

      // Stats row
      gsap.fromTo('.stat-item',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power2.out', delay: 1.4 }
      )

      // Scroll hint pulse
      gsap.fromTo(scrollHintRef.current,
        { opacity: 0 },
        { opacity: 0.6, duration: 1, delay: 2.2, ease: 'power2.out' }
      )
      gsap.to(scrollHintRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.4,
        ease: 'sine.inOut',
        delay: 2.5,
      })

      // === SCROLL EXIT ===
      // Entire overlay fades + lifts as user scrolls
    ScrollTrigger.create({
  trigger: document.body,
  start: 'top top',
  end: '40% top',
  scrub: 1.2,
  onUpdate: (self) => {
    const t = self.progress
    if (overlayRef.current) {
      const opacity = Math.max(0, 1 - t * 1.5)
      overlayRef.current.style.opacity = opacity
      overlayRef.current.style.transform = `translateY(${-t * 60}px)`
      // Once fully invisible, pull it out of the stacking context
      overlayRef.current.style.pointerEvents = opacity === 0 ? 'none' : 'none'
      overlayRef.current.style.visibility = opacity <= 0 ? 'hidden' : 'visible'
    }
  },
})

    })

    return () => ctx.revert()
  }, [])

  return (
    // Fixed overlay — always on top of the canvas
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '0 8vw',
      }}
    >
      {/* Mission Badge */}
      <div
        ref={badgeRef}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '100px',
          border: '1px solid rgba(100,180,255,0.35)',
          background: 'rgba(10,30,60,0.5)',
          backdropFilter: 'blur(8px)',
          marginBottom: '24px',
          opacity: 0,
        }}
      >
        <div style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: '#4fc3f7',
          boxShadow: '0 0 8px #4fc3f7',
          animation: 'pulse-dot 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: "'DM Mono', 'Courier New', monospace",
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: '#a8d8f0',
          textTransform: 'uppercase',
        }}>
          NASA · 2025 Mission
        </span>
      </div>

      {/* Main Title */}
      <h1
        ref={titleRef}
        style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: 'clamp(52px, 9vw, 128px)',
          fontWeight: 300,
          lineHeight: 0.92,
          letterSpacing: '-0.02em',
          color: '#ffffff',
          margin: 0,
          opacity: 0,
          maxWidth: '720px',
        }}
      >
        Artemis<br />
        <span style={{
          fontStyle: 'italic',
          background: 'linear-gradient(135deg, #c8e6fa 0%, #5ab4e8 50%, #1a7abf 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          II
        </span>
        <span style={{ color: '#ffffff' }}> Mission</span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        style={{
          fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
          fontSize: 'clamp(15px, 2vw, 20px)',
          fontWeight: 300,
          color: 'rgba(180, 215, 240, 0.85)',
          marginTop: '28px',
          marginBottom: '0',
          letterSpacing: '0.04em',
          maxWidth: '440px',
          lineHeight: 1.6,
          opacity: 0,
        }}
      >
        Returning humans to the Moon.<br />
        Four astronauts. One historic voyage.
      </p>

      {/* Stats Row */}
      <div
        ref={statsRef}
        style={{
          display: 'flex',
          gap: '40px',
          marginTop: '52px',
        }}
      >
        {[
          { value: '4', label: 'Crew Members' },
          { value: '10', label: 'Day Journey' },
          { value: '385K', label: 'km to Moon' },
        ].map((stat) => (
          <div key={stat.label} className="stat-item" style={{ opacity: 0 }}>
            <div style={{
              fontFamily: "'DM Mono', 'Courier New', monospace",
              fontSize: 'clamp(26px, 4vw, 44px)',
              fontWeight: 400,
              color: '#ffffff',
              lineHeight: 1,
            }}>
              {stat.value}
            </div>
            <div style={{
              fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
              fontSize: '11px',
              color: 'rgba(140,190,220,0.7)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: '6px',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
          opacity: 0,
        }}
      >
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: 'rgba(150,200,230,0.6)',
          textTransform: 'uppercase',
        }}>
          Scroll
        </span>
        <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
          <rect x="1" y="1" width="18" height="28" rx="9" stroke="rgba(100,180,255,0.4)" strokeWidth="1.5"/>
          <rect x="9" y="6" width="2" height="7" rx="1" fill="rgba(100,180,255,0.7)"/>
        </svg>
      </div>

      {/* Vignette bottom gradient */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '30vh',
        background: 'linear-gradient(to top, rgba(0,3,8,0.6) 0%, transparent 100%)',
        pointerEvents: 'none',
        zIndex: -1,
      }} />

      {/* CSS for pulsing dot */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&family=DM+Mono:wght@300;400&display=swap');

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
      `}</style>
    </div>
  )
}
