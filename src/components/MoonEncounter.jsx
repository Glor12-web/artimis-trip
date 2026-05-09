import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MoonEncounter() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: document.body,
            start: '35% top',
            end: '65% top',
            scrub: true,
          },
        }
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: '10vw',
        opacity: 0,
      }}
    >
      <div
        style={{
          maxWidth: '620px',
          padding: '28px',
          borderRadius: '24px',
          background: 'rgba(0, 8, 20, 0.38)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(120, 190, 255, 0.18)',
        }}
      >
        <p
          style={{
            color: '#7dd3fc',
            fontSize: '14px',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            marginBottom: '16px',
          }}
        >
          Lunar Flyby
        </p>

        <h2
          style={{
            color: '#ffffff',
            fontSize: 'clamp(52px, 6vw, 84px)',
            fontWeight: 300,
            lineHeight: 1,
            marginBottom: '22px',
          }}
        >
          Moon <span style={{ color: '#7dd3fc', fontStyle: 'italic' }}>Encounter</span>
        </h2>

        <p
          style={{
            color: 'rgba(220, 235, 245, 0.86)',
            fontSize: '20px',
            lineHeight: 1.7,
          }}
        >
          Artemis II approaches the Moon, using lunar gravity to guide the
          spacecraft around the far side before beginning the journey back to Earth.
        </p>
      </div>
    </div>
  )
}