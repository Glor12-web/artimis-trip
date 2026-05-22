import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function MissionPrologue() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.prologue-text',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 1.5, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 10vw', position: 'relative', zIndex: 10 }}>
      <div className="prologue-text" style={{ maxWidth: '800px', textAlign: 'center', opacity: 0 }}>
        <h3 style={{ 
          fontFamily: "'DM Mono', monospace", 
          fontSize: '12px', 
          color: '#4fc3f7', 
          letterSpacing: '0.3em', 
          textTransform: 'uppercase',
          marginBottom: '24px'
        }}>
          The Awakening
        </h3>
        <p style={{ 
          fontFamily: "'Cormorant Garamond', serif", 
          fontSize: 'clamp(24px, 3.5vw, 42px)', 
          lineHeight: 1.3, 
          color: '#ffffff', 
          fontWeight: 300,
          fontStyle: 'italic'
        }}>
          "Fifty years after the last Apollo mission, humanity is reaching out once more. Not just to visit, but to learn, to live, and to prepare for the long journey to Mars."
        </p>
        <div style={{
          width: '60px',
          height: '1px',
          background: 'rgba(79, 195, 247, 0.4)',
          margin: '32px auto'
        }} />
      </div>
    </div>
  )
}
