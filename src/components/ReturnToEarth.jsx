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
    label: 'Mission Phase',
    value: 'Return to Earth',
    desc: 'Final stage of the mission bringing crew safely back home'
  },
  {
    label: 'Reentry Vehicle',
    value: 'Orion Capsule',
    desc: 'Designed to withstand extreme heat during atmospheric reentry'
  },
  {
    label: 'Reentry Profile',
    value: 'Skip Reentry',
    desc: 'Technique that reduces heat and G-forces by briefly exiting the atmosphere'
  },
  {
    label: 'Landing',
    value: 'Ocean Splashdown',
    desc: 'Crew lands in the Pacific Ocean followed by recovery operations'
  },
]

export function ReturnToEarth() {
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
    <div ref={sectionRef} style={{ height: '150vh', position: 'relative', zIndex: 10 }}>
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
            04 · Returning To Earth
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
          The Return To Earth 
        </h2>

        {/* Animated divider line */}
        <div className="mission-line" style={{
          height: 1,
          background: 'linear-gradient(90deg, rgba(100,180,255,0.6), transparent)',
          width: '40%',
          marginBottom: 40,
          marginTop: 16,
        }} />

        {/* Cards - Hexagon Timeline */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '60px',
          maxWidth: 900,
          position: 'relative',
          paddingTop: 20,
          paddingBottom: 20,
        }}>
          {/* Center timeline line */}
          <div style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 2,
            background: 'linear-gradient(180deg, rgba(100,180,255,0.3), rgba(100,180,255,0.1), rgba(100,180,255,0.3))',
            transform: 'translateX(-1px)',
            zIndex: 0,
          }} />

          {missions.map((item, idx) => {
            const colors = [
              { hex: '#64b5f6', border: '#42a5f5', icon: '#1976d2' },      // Light Blue - Earth orbit
              { hex: '#ffb74d', border: '#ffa726', icon: '#f57c00' },      // Light Orange - Spacecraft
              { hex: '#ff8a65', border: '#ff7043', icon: '#e64a19' },      // Light Coral - Heat/Reentry
              { hex: '#4dd0e1', border: '#26c6da', icon: '#00838f' },      // Light Cyan - Ocean/Water
            ]
            const isLeft = idx % 2 === 0
            const color = colors[idx % colors.length]

            return (
              <div
                key={item.label}
                className="mission-card"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  opacity: 0,
                  position: 'relative',
                  zIndex: 1,
                }}>
                
                {isLeft ? (
                  <>
                    {/* Left content */}
                    <div style={{
                      flex: 1,
                      paddingRight: 40,
                      textAlign: 'right',
                    }}>
                      <div style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: 11,
                        letterSpacing: '0.15em',
                        color: 'rgba(140,190,220,0.5)',
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}>
                        PROCESS
                      </div>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 13,
                        color: 'rgba(150,200,230,0.75)',
                        lineHeight: 1.6,
                      }}>
                        {item.desc}
                      </div>
                    </div>

                    {/* Center hexagon */}
                    <div style={{
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                        {/* Hexagon background */}
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill={color.hex}
                          stroke={color.border}
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        {/* Simple geometric icon pattern */}
                        <g stroke={color.icon} strokeWidth="1.5" fill="none">
                          <circle cx="50" cy="50" r="20" />
                          <circle cx="50" cy="50" r="12" />
                          <line x1="50" y1="30" x2="50" y2="70" />
                          <line x1="30" y1="50" x2="70" y2="50" />
                        </g>
                      </svg>

                      {/* Timeline dot */}
                      <div style={{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'rgba(100,180,255,0.6)',
                        border: '3px solid rgba(0,5,15,0.9)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                      }} />
                    </div>

                    {/* Right number */}
                    <div style={{
                      flex: 1,
                      paddingLeft: 40,
                      textAlign: 'left',
                    }}>
                      <div style={{
                        fontFamily: 'Cormorant Garamond, Georgia, serif',
                        fontSize: 48,
                        fontWeight: 300,
                        color: color.hex,
                        letterSpacing: '2px',
                        lineHeight: 1,
                        marginBottom: 8,
                      }}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        color: color.border,
                        textTransform: 'uppercase',
                      }}>
                        
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Left number */}
                    <div style={{
                      flex: 1,
                      paddingRight: 40,
                      textAlign: 'right',
                    }}>
                      <div style={{
                        fontFamily: 'Cormorant Garamond, Georgia, serif',
                        fontSize: 48,
                        fontWeight: 300,
                        color: color.hex,
                        letterSpacing: '2px',
                        lineHeight: 1,
                        marginBottom: 8,
                      }}>
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: 10,
                        letterSpacing: '0.15em',
                        color: color.border,
                        textTransform: 'uppercase',
                      }}>
                        
                      </div>
                    </div>

                    {/* Center hexagon */}
                    <div style={{
                      width: 100,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                      <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
                        {/* Hexagon background */}
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill={color.hex}
                          stroke={color.border}
                          strokeWidth="2"
                          opacity="0.8"
                        />
                        {/* Simple geometric icon pattern */}
                        <g stroke={color.icon} strokeWidth="1.5" fill="none">
                          <circle cx="50" cy="50" r="20" />
                          <circle cx="50" cy="50" r="12" />
                          <line x1="50" y1="30" x2="50" y2="70" />
                          <line x1="30" y1="50" x2="70" y2="50" />
                        </g>
                      </svg>

                      {/* Timeline dot */}
                      <div style={{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: 'rgba(100,180,255,0.6)',
                        border: '3px solid rgba(0,5,15,0.9)',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 2,
                      }} />
                    </div>

                    {/* Right content */}
                    <div style={{
                      flex: 1,
                      paddingLeft: 40,
                      textAlign: 'left',
                    }}>
                      <div style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: 11,
                        letterSpacing: '0.15em',
                        color: 'rgba(140,190,220,0.5)',
                        textTransform: 'uppercase',
                        marginBottom: 8,
                      }}>
                        PROCESS
                      </div>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 13,
                        color: 'rgba(150,200,230,0.75)',
                        lineHeight: 1.6,
                      }}>
                        {item.desc}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>

      </div>
    </div>
  )
}