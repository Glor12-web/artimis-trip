import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { value: '384,400', unit: 'km', label: 'Distance from Earth' },
  { value: '70,000', unit: 'km', label: 'Closest Approach' },
  { value: '8', unit: 'min', label: 'Behind Far Side' },
]

export function MoonEncounter() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      gsap.fromTo('.moon-badge',
        { opacity: 0, y: -16 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      gsap.fromTo('.moon-heading',
        { opacity: 0, y: 60, skewY: 2 },
        {
          opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 65%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      gsap.fromTo('.moon-divider',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 1.4, ease: 'power3.inOut',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      gsap.fromTo('.moon-body',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      gsap.fromTo('.moon-stat',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 50%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      gsap.fromTo('.moon-tag',
        { opacity: 0, x: -12 },
        {
          opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 48%',
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

        {/* Layout — text left, stats right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '60px',
          alignItems: 'center',
          maxWidth: 1100,
        }}>

          {/* LEFT — main content */}
          <div>

            {/* Badge */}
            <div className="moon-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '5px 14px',
              borderRadius: 100,
              border: '1px solid rgba(100,180,255,0.3)',
              background: 'rgba(10,25,55,0.55)',
              backdropFilter: 'blur(10px)',
              marginBottom: 24,
              opacity: 0,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: '#c8bfa0',
                boxShadow: '0 0 8px rgba(200,191,160,0.8)',
              }} />
              <span style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 11,
                letterSpacing: '0.18em',
                color: '#c8d8e8',
                textTransform: 'uppercase',
              }}>
                05 · Lunar Flyby
              </span>
            </div>

            {/* Heading */}
            <h2 className="moon-heading" style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(48px, 7vw, 96px)',
              fontWeight: 300,
              lineHeight: 0.9,
              color: '#ffffff',
              margin: 0,
              opacity: 0,
            }}>
              Moon<br />
              <span style={{
                fontStyle: 'italic',
                background: 'linear-gradient(135deg, #e8e0cc 0%, #c8bfa0 50%, #a09070 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Encounter
              </span>
            </h2>

            {/* Divider */}
            <div className="moon-divider" style={{
              height: 1,
              width: '55%',
              background: 'linear-gradient(90deg, rgba(200,191,160,0.5), transparent)',
              margin: '24px 0',
            }} />

            {/* Body text */}
            <p className="moon-body" style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 'clamp(14px, 1.4vw, 17px)',
              color: 'rgba(200,220,235,0.75)',
              lineHeight: 1.8,
              maxWidth: 480,
              opacity: 0,
            }}>
              Artemis II swings around the lunar far side, using the Moon's
              gravity as a slingshot. For eight minutes the crew loses all
              contact with Earth — the most remote humans have ever been.
            </p>

            {/* Mission tags */}
            <div style={{ display: 'flex', gap: 10, marginTop: 28, flexWrap: 'wrap' }}>
              {['Gravity Assist', 'Far Side Pass', 'Radio Blackout', 'Free Return'].map(tag => (
                <div key={tag} className="moon-tag" style={{
                  padding: '6px 14px',
                  borderRadius: 100,
                  border: '1px solid rgba(200,191,160,0.2)',
                  background: 'rgba(200,191,160,0.06)',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  color: 'rgba(200,191,160,0.7)',
                  textTransform: 'uppercase',
                  opacity: 0,
                }}>
                  {tag}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — stat stack */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            minWidth: 200,
          }}>
            {stats.map((s, i) => (
              <div key={s.label} className="moon-stat" style={{
                padding: '22px 24px',
                borderRadius: i === 0 ? '16px 16px 4px 4px' : i === stats.length - 1 ? '4px 4px 16px 16px' : '4px',
                background: 'rgba(8,18,40,0.65)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(200,191,160,0.1)',
                opacity: 0,
              }}>
                <div style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 'clamp(28px, 3.5vw, 42px)',
                  fontWeight: 300,
                  color: '#ffffff',
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 6,
                }}>
                  {s.value}
                  <span style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 13,
                    color: 'rgba(200,191,160,0.6)',
                    fontStyle: 'normal',
                  }}>
                    {s.unit}
                  </span>
                </div>
                <div style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: 12,
                  color: 'rgba(160,200,220,0.55)',
                  letterSpacing: '0.08em',
                  marginTop: 6,
                  textTransform: 'uppercase',
                }}>
                  {s.label}
                </div>
              </div>
            ))}

            {/* Trajectory indicator */}
            <div style={{
              marginTop: 12,
              padding: '14px 24px',
              borderRadius: 12,
              border: '1px solid rgba(100,180,255,0.12)',
              background: 'rgba(5,12,30,0.5)',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.15em',
                color: 'rgba(140,190,220,0.5)',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                Trajectory
              </div>
              {/* Visual path line */}
              <svg width="100%" height="36" viewBox="0 0 160 36" fill="none">
                <circle cx="10" cy="18" r="6" fill="#1a6fa3" opacity="0.9"/>
                <text x="10" y="34" textAnchor="middle" fill="rgba(140,190,220,0.5)" fontSize="7" fontFamily="DM Mono">Earth</text>
                <path d="M18 18 Q80 2 142 18" stroke="rgba(100,180,255,0.35)" strokeWidth="1" strokeDasharray="3 3"/>
                <path d="M18 18 Q80 34 142 18" stroke="rgba(200,191,160,0.2)" strokeWidth="1" strokeDasharray="3 3"/>
                <circle cx="150" cy="18" r="8" fill="#6b6050" opacity="0.9"/>
                <text x="150" y="34" textAnchor="middle" fill="rgba(200,191,160,0.5)" fontSize="7" fontFamily="DM Mono">Moon</text>
              </svg>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}