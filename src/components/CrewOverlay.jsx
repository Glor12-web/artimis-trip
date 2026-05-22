import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const crew = [
  {
    role: 'Commander',
    name: 'Reid Wiseman',
    bio: 'U.S. Navy test pilot & veteran ISS commander',
    quote: '"We\'re going back to the Moon — and this time we\'re staying"',
    tags: ['🇺🇸 American', '1 prev. mission', 'Navy Captain'],
    color: '#4fc3f7',
    glow: 'rgba(79,195,247,0.25)',
    direction: 'left',
  },
  {
    role: 'Pilot',
    name: 'Victor Glover',
    bio: 'First Black astronaut on a long-duration ISS mission',
    quote: '"I want my children to see that anything is possible"',
    tags: ['🇺🇸 American', '1 prev. mission', 'Navy Commander'],
    color: '#ffd54f',
    glow: 'rgba(255,213,79,0.22)',
    direction: 'right',
  },
  {
    role: 'Mission Specialist',
    name: 'Christina Koch',
    bio: 'Record holder for longest single spaceflight by a woman — 328 days',
    quote: '"Exploration is in our nature"',
    tags: ['🇺🇸 American', '328 days in space', '1 prev. mission'],
    color: '#ce93d8',
    glow: 'rgba(206,147,216,0.22)',
    direction: 'left',
  },
  {
    role: 'Mission Specialist',
    name: 'Jeremy Hansen',
    bio: 'First Canadian to leave Earth\'s orbit on a crewed mission',
    quote: '"This is humanity\'s next giant leap"',
    tags: ['🇨🇦 Canadian', 'First lunar orbit', 'CF-18 pilot'],
    color: '#80cbc4',
    glow: 'rgba(128,203,196,0.22)',
    direction: 'right',
  },
]

function AstronautIcon({ color, glow }) {
  return (
    <div style={{
      width: 120,
      height: 120,
      flexShrink: 0,
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '50%',
        background: glow,
        filter: 'blur(16px)',
        animation: 'crew-pulse 3s ease-in-out infinite',
      }} />
      <svg
        width="90"
        height="90"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <circle cx="30" cy="26" r="18" stroke={color} strokeWidth="1.5" fill="rgba(5,15,35,0.7)"
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
        <path d="M18 26 Q18 16 30 16 Q42 16 42 26 Q42 32 30 34 Q18 32 18 26Z" fill={color} opacity="0.15" />
        <path d="M20 25 Q20 18 30 18 Q40 18 40 25 Q40 30 30 31.5 Q20 30 20 25Z" fill={color} opacity="0.08" />
        <line x1="23" y1="21" x2="27" y2="19" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" />
        <rect x="22" y="43" width="16" height="4" rx="2" fill={color} opacity="0.5" />
        <path d="M20 44 Q20 58 30 58 Q40 58 40 44" stroke={color} strokeWidth="1.5" fill="rgba(5,15,35,0.5)" opacity="0.6" />
        <rect x="24" y="43" width="12" height="2" rx="1" fill={color} opacity="0.8" />
        <circle cx="30" cy="7" r="1.5" fill={color} style={{
          animation: 'crew-blink 2s ease-in-out infinite',
          filter: `drop-shadow(0 0 4px ${color})`
        }} />
        <line x1="30" y1="8.5" x2="30" y2="12" stroke={color} strokeWidth="1.5" />
        <circle cx="13" cy="26" r="2" fill={color} opacity="0.4" />
        <circle cx="47" cy="26" r="2" fill={color} opacity="0.4" />
        <circle cx="30" cy="52" r="3" stroke={color} strokeWidth="1" fill="none" opacity="0.5" />
        <circle cx="30" cy="52" r="1" fill={color} opacity="0.6" />
      </svg>
    </div>
  )
}

// Each crew member gets their own section component
function CrewMemberSection({ member, index, isFirst }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const fromX = member.direction === 'left' ? -100 : 100

      // Badge only shows on first member
      if (isFirst) {
        gsap.fromTo('.crew-section-badge',
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            }
          }
        )

        gsap.fromTo('.crew-section-heading',
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            }
          }
        )

        gsap.fromTo('.crew-section-line',
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.2, ease: 'power3.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 55%',
              toggleActions: 'play none none reverse',
            }
          }
        )
      }

      // Member card slides in
      gsap.fromTo(`.crew-card-${index}`,
        { opacity: 0, x: fromX },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Tags stagger in
      gsap.fromTo(`.crew-tags-${index} .crew-tag`,
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
          delay: 0.3,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          }
        }
      )

      // Quote fades in last
      gsap.fromTo(`.crew-quote-${index}`,
        { opacity: 0, y: 8 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 55%',
            toggleActions: 'play none none reverse',
          }
        }
      )

    }, sectionRef)

    return () => ctx.revert()
  }, [index, isFirst, member.direction])

  return (
    // Each member owns 80vh of scroll space to tighten spacing
    <div ref={sectionRef} style={{ height: '80vh', position: 'relative', zIndex: 10 }}>
      <div style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 8vw',
          pointerEvents: 'none',
          overflow: 'visible',
          marginTop: '-4vh', // Shift up slightly
        }}>

        {/* Badge + Heading + Divider — only on first member */}
        {isFirst && (
          <>
            <div
              className="crew-section-badge"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '5px 12px',
                border: '1px solid rgba(100,180,255,0.3)',
                borderRadius: 100,
                background: 'rgba(10,30,60,0.5)',
                backdropFilter: 'blur(8px)',
                width: 'fit-content',
                marginBottom: 16,
                opacity: 0,
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

            <h2
              className="crew-section-heading"
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 'clamp(36px, 6vw, 80px)',
                fontWeight: 300,
                color: '#ffffff',
                lineHeight: 1,
                margin: 0,
                marginBottom: 8,
                opacity: 0,
              }}>
              The Crew
            </h2>

            <div
              className="crew-section-line"
              style={{
                height: 1,
                background: 'linear-gradient(90deg, rgba(100,180,255,0.6), transparent)',
                width: '40%',
                marginBottom: 32,
                marginTop: 12,
                transformOrigin: 'left center',
                transform: 'scaleX(0)',
              }}
            />
          </>
        )}

        {/* Member card */}
        <div
          className={`crew-card-${index}`}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 40,
            padding: '32px 36px',
            height: 'auto',
            border: `1px solid ${member.color}25`,
            borderRadius: 20,
            background: 'rgba(5,15,35,0.6)',
            backdropFilter: 'blur(14px)',
            opacity: 0,
            position: 'relative',
            overflow: 'hidden',
            maxWidth: 860,
            flexDirection: member.direction === 'right' ? 'row-reverse' : 'row',
          }}
        >
          {/* Top accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 1,
            background: `linear-gradient(90deg, transparent, ${member.color}66, transparent)`,
          }} />

          {/* Side accent line */}
          <div style={{
            position: 'absolute',
            top: '10%',
            bottom: '10%',
            [member.direction === 'left' ? 'left' : 'right']: 0,
            width: 2,
            background: `linear-gradient(180deg, transparent, ${member.color}44, transparent)`,
          }} />

          <AstronautIcon color={member.color} glow={member.glow} />

          <div style={{
            flex: 1,
            textAlign: member.direction === 'right' ? 'right' : 'left',
          }}>
            {/* Role */}
            <div style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 11,
              letterSpacing: '0.15em',
              color: member.color,
              textTransform: 'uppercase',
              marginBottom: 8,
              opacity: 0.9,
            }}>
              {member.role}
            </div>

            {/* Name */}
            <div style={{
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 1.1,
              marginBottom: 12,
            }}>
              {member.name}
            </div>

            {/* Bio */}
            <div style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14,
              color: 'rgba(150,200,230,0.75)',
              lineHeight: 1.6,
              marginBottom: 16,
              maxWidth: 420,
              marginLeft: member.direction === 'right' ? 'auto' : 0,
            }}>
              {member.bio}
            </div>

            {/* Tags */}
            <div
              className={`crew-tags-${index}`}
              style={{
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                marginBottom: 16,
                justifyContent: member.direction === 'right' ? 'flex-end' : 'flex-start',
              }}
            >
              {member.tags.map((tag) => (
                <span
                  key={tag}
                  className="crew-tag"
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: 10,
                    letterSpacing: '0.1em',
                    padding: '4px 12px',
                    borderRadius: 100,
                    textTransform: 'uppercase',
                    background: `${member.color}15`,
                    border: `1px solid ${member.color}35`,
                    color: member.color,
                    opacity: 0,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Quote */}
            <div
              className={`crew-quote-${index}`}
              style={{
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontSize: 15,
                fontStyle: 'italic',
                color: `${member.color}aa`,
                lineHeight: 1.5,
                opacity: 0,
                borderLeft: member.direction === 'left' ? `2px solid ${member.color}44` : 'none',
                borderRight: member.direction === 'right' ? `2px solid ${member.color}44` : 'none',
                paddingLeft: member.direction === 'left' ? 14 : 0,
                paddingRight: member.direction === 'right' ? 14 : 0,
                maxWidth: 400,
                marginLeft: member.direction === 'right' ? 'auto' : 0,
              }}
            >
              {member.quote}
            </div>
          </div>
        </div>

        {/* Member number indicator bottom right */}
        <div style={{
          position: 'absolute',
          bottom: 32,
          right: '8vw',
          fontFamily: 'DM Mono, monospace',
          fontSize: 11,
          color: `${member.color}55`,
          letterSpacing: '0.2em',
        }}>
          {String(index + 1).padStart(2, '0')} / 04
        </div>

      </div>
    </div>
  )
}

export function CrewOverlay() {
  return (
    <>
      {crew.map((member, i) => (
        <CrewMemberSection
          key={member.name}
          member={member}
          index={i}
          isFirst={i === 0}
        />
      ))}

      <style>{`
        @keyframes crew-pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes crew-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
      `}</style>
    </>
  )
}