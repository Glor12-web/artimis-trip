import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const crew = [
  {
    role: 'Commander',
    name: 'Reid Wiseman',
    bio: 'U.S. Navy test pilot & veteran ISS commander',
    color: '#4fc3f7',
    glow: 'rgba(79,195,247,0.25)',
    iconAccent: '#4fc3f7',
  },
  {
    role: 'Pilot',
    name: 'Victor Glover',
    bio: 'First Black astronaut on a long-duration ISS mission',
    color: '#ffd54f',
    glow: 'rgba(255,213,79,0.22)',
    iconAccent: '#ffd54f',
  },
  {
    role: 'Mission Specialist',
    name: 'Christina Koch',
    bio: 'Holds the record for longest single spaceflight by a woman',
    color: '#ce93d8',
    glow: 'rgba(206,147,216,0.22)',
    iconAccent: '#ce93d8',
  },
  {
    role: 'Mission Specialist',
    name: 'Jeremy Hansen',
    bio: 'First Canadian to leave Earth\'s orbit',
    color: '#80cbc4',
    glow: 'rgba(128,203,196,0.22)',
    iconAccent: '#80cbc4',
  },
]

// Animated SVG astronaut helmet icon — unique accent color per crew member
function AstronautIcon({ color, glow }) {
  return (
    <div style={{
      width: 72,
      height: 72,
      margin: '0 auto 20px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Glow ring behind icon */}
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: glow,
        filter: 'blur(10px)',
        animation: 'crew-pulse 3s ease-in-out infinite',
      }} />

      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Helmet outer shell */}
        <circle
          cx="30"
          cy="26"
          r="18"
          stroke={color}
          strokeWidth="1.5"
          fill="rgba(5,15,35,0.7)"
          style={{ filter: `drop-shadow(0 0 6px ${color}66)` }}
        />

        {/* Visor */}
        <path
          d="M18 26 Q18 16 30 16 Q42 16 42 26 Q42 32 30 34 Q18 32 18 26Z"
          fill={color}
          opacity="0.15"
        />
        <path
          d="M20 25 Q20 18 30 18 Q40 18 40 25 Q40 30 30 31.5 Q20 30 20 25Z"
          fill={color}
          opacity="0.08"
        />

        {/* Visor reflection streak */}
        <line
          x1="23" y1="21"
          x2="27" y2="19"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Neck ring */}
        <rect
          x="22" y="43"
          width="16" height="4"
          rx="2"
          fill={color}
          opacity="0.5"
        />

        {/* Suit collar */}
        <path
          d="M20 44 Q20 58 30 58 Q40 58 40 44"
          stroke={color}
          strokeWidth="1.5"
          fill="rgba(5,15,35,0.5)"
          opacity="0.6"
        />

        {/* Helmet connector */}
        <rect
          x="24" y="43"
          width="12" height="2"
          rx="1"
          fill={color}
          opacity="0.8"
        />

        {/* Antenna */}
        <line
          x1="30" y1="8"
          x2="30" y2="8"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="30" y1="8"
          x2="30" y2="8"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          style={{ animation: 'crew-blink 2s ease-in-out infinite' }}
        />
        <circle cx="30" cy="7" r="1.5" fill={color} style={{
          animation: 'crew-blink 2s ease-in-out infinite',
          filter: `drop-shadow(0 0 3px ${color})`
        }} />
        <line x1="30" y1="8" x2="30" y2="8.5" stroke={color} strokeWidth="1.5" />

        {/* Small antenna line */}
        <line x1="30" y1="8" x2="30" y2="8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="30" y1="7.5" x2="30" y2="8.5" stroke={color} strokeWidth="1.5" />

        {/* Side detail dots */}
        <circle cx="13" cy="26" r="2" fill={color} opacity="0.4" />
        <circle cx="47" cy="26" r="2" fill={color} opacity="0.4" />

        {/* Chest patch */}
        <circle
          cx="30"
          cy="52"
          r="3"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
        <circle cx="30" cy="52" r="1" fill={color} opacity="0.6" />
      </svg>
    </div>
  )
}

export function CrewOverlay() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Heading fades up on scroll enter
      gsap.fromTo('.crew-heading',
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

      // Divider draws left to right
      gsap.fromTo('.crew-line',
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

      // Cards stagger in
      gsap.fromTo('.crew-card',
        { opacity: 0, y: 50 },
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
            03 · The Crew
          </span>
        </div>

        {/* Heading */}
        <h2 className="crew-heading" style={{
          fontFamily: 'Cormorant Garamond, Georgia, serif',
          fontSize: 'clamp(36px, 6vw, 80px)',
          fontWeight: 300,
          color: '#ffffff',
          lineHeight: 1,
          margin: 0,
          opacity: 0,
          marginBottom: 8,
        }}>
          The Crew
        </h2>

        {/* Animated divider */}
        <div className="crew-line" style={{
          height: 1,
          background: 'linear-gradient(90deg, rgba(100,180,255,0.6), transparent)',
          width: '40%',
          marginBottom: 40,
          marginTop: 16,
        }} />

        {/* Crew cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 20,
          maxWidth: 960,
        }}>
          {crew.map((member) => (
            <div
              key={member.name}
              className="crew-card"
              style={{
                padding: '28px 20px 24px',
                border: `1px solid ${member.color}22`,
                borderRadius: 16,
                background: 'rgba(5,15,35,0.6)',
                backdropFilter: 'blur(12px)',
                opacity: 0,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle top glow line matching accent color */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '20%',
                right: '20%',
                height: 1,
                background: `linear-gradient(90deg, transparent, ${member.color}88, transparent)`,
              }} />

              {/* Animated astronaut icon */}
              <AstronautIcon color={member.color} glow={member.glow} />

              {/* Role label */}
              <div style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: 10,
                letterSpacing: '0.15em',
                color: member.color,
                textTransform: 'uppercase',
                marginBottom: 8,
                opacity: 0.8,
              }}>
                {member.role}
              </div>

              {/* Name */}
              <div style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(18px, 2vw, 22px)',
                fontWeight: 400,
                color: '#ffffff',
                lineHeight: 1.2,
                marginBottom: 10,
              }}>
                {member.name}
              </div>

              {/* Bio line */}
              <div style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: 12,
                color: 'rgba(150,200,230,0.65)',
                lineHeight: 1.5,
              }}>
                {member.bio}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes crew-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.15); }
        }
        @keyframes crew-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  )
}