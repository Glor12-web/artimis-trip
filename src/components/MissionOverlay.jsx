import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  HOW THIS WORKS 
  
  The OUTER div is 150vh tall. That is what owns this section's scroll space.
  The INNER div is position:sticky + top:0 + height:100vh.
  Sticky means: while you are scrolling through the 150vh outer div,
  the inner div PINS to the top of the screen the whole time.
  When the outer div ends the inner div unpins and the next section takes over.
  The Canvas behind everything is fixed and never moves — we are just scrolling
  DOM content over it.

  TO BUILD YOUR OWN SECTION — copy this file, change:
  1. The section number/title in the badge
  2. The heading text
  3. The content inside the cards grid
  4. The GSAP animations if you want different entrance effects
  Everything else stays the same.
*/

const missions = [
  {
    label: 'Mission Type',
    value: 'Crewed Lunar Flyby',
    desc: 'First crewed flight of Orion with SLS Block 1'
  },
  {
    label: 'Launch Vehicle',
    value: 'Space Launch System',
    desc: 'Most powerful rocket ever built by NASA'
  },
  {
    label: 'Destination',
    value: 'Distant Retrograde Orbit',
    desc: "70,000 km beyond the Moon's far side"
  },
  {
    label: 'Duration',
    value: '~10 Days',
    desc: 'Earth departure through Pacific Ocean splashdown'
  },
]

export function MissionOverlay() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Heading fades up when section enters view
      gsap.fromTo('.mission-heading',
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Cards stagger in one by one
      gsap.fromTo('.mission-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.7,
          stagger: 0.15, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Divider line draws itself left to right
      gsap.fromTo('.mission-line',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.2, ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ height: '100vh', position: 'relative', zIndex: 10 }}>
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 8vw',
        pointerEvents: 'none',
      }}>

        {/* Section badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '5px 12px',
          border: '1px solid rgba(100,180,255,0.3)',
          borderRadius: 100,
          background: 'rgba(10,30,60,0.5)',
          backdropFilter: 'blur(8px)',
          width: 'fit-content',
          marginBottom: 20,
        }}>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: 11,
            letterSpacing: '0.15em',
            color: '#a8d8f0',
            textTransform: 'uppercase',
          }}>
            02 · Mission Overview
          </span>
        </div>

        {/* Heading */}
        <h2 className="mission-heading" style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(36px, 6vw, 80px)',
          fontWeight: 300,
          color: '#ffffff',
          lineHeight: 1,
          margin: 0,
          opacity: 0,
          marginBottom: 8,
        }}>
          The Mission
        </h2>

        {/* Animated divider line */}
        <div className="mission-line" style={{
          height: 1,
          background: 'linear-gradient(90deg, rgba(100,180,255,0.6), transparent)',
          width: '40%',
          marginBottom: 40,
          marginTop: 16,
        }} />

        {/* Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          maxWidth: 900,
        }}>
          {missions.map((item) => (
            <div key={item.label} className="mission-card" style={{
              padding: '20px 24px',
              border: '1px solid rgba(100,180,255,0.15)',
              borderRadius: 12,
              background: 'rgba(5,15,35,0.6)',
              backdropFilter: 'blur(12px)',
              opacity: 0,
            }}>
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'rgba(140,190,220,0.6)',
                textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(18px, 2.5vw, 26px)',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: 8,
              }}>
                {item.value}
              </div>
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 13,
                color: 'rgba(150,200,230,0.65)',
                lineHeight: 1.5,
              }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}