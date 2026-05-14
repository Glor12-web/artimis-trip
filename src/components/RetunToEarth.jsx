import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const phases = [
  {
    index: '01',
    label: 'Mission Phase',
    headline: ['Return', 'to Earth'],
    sub: 'Final stage of the mission bringing crew safely back home after 25 days in deep space.',
    aside: 'Day 25 · Mission Complete',
    align: 'left',
    accent: '#c9a961',
    accentRgb: '201,169,97',
  },
  {
    index: '02',
    label: 'Reentry Vehicle',
    headline: ['Orion', 'Capsule'],
    sub: 'A state-of-the-art capsule engineered to endure temperatures exceeding 2,760°C during atmospheric entry.',
    aside: 'Shield temp · 2,760°C',
    align: 'right',
    accent: '#d4785a',
    accentRgb: '212,120,90',
  },
  {
    index: '03',
    label: 'Reentry Profile',
    headline: ['Skip', 'Reentry'],
    sub: 'A technique that briefly skips the capsule off the upper atmosphere, dramatically cutting heat and G-forces on the crew.',
    aside: 'G-force reduction · 40%',
    align: 'left',
    accent: '#7ab3d4',
    accentRgb: '122,179,212',
  },
  {
    index: '04',
    label: 'Landing',
    headline: ['Ocean', 'Splashdown'],
    sub: 'The crew descends into the Pacific Ocean under three main parachutes, followed by swift Navy recovery operations.',
    aside: 'Pacific Ocean · Recovery',
    align: 'right',
    accent: '#6ec9b4',
    accentRgb: '110,201,180',
  },
]

export function ReturnToEarth() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Overline
      gsap.fromTo('.rte2-overline',
        { opacity: 0, y: -16 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 78%', toggleActions: 'play none none reverse' }
        }
      )

      // Hero title: word-by-word staggered wipe
      gsap.fromTo('.rte2-hero-word',
        { opacity: 0, y: 60, skewY: 4 },
        {
          opacity: 1, y: 0, skewY: 0,
          duration: 1.1, stagger: 0.12, ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 74%', toggleActions: 'play none none reverse' }
        }
      )

      // Per-chapter animations
      phases.forEach((_, i) => {
        const sel = `.rte2-chapter-${i}`

        gsap.fromTo(`${sel} .rte2-watermark`,
          { opacity: 0, scale: 1.25, filter: 'blur(18px)' },
          {
            opacity: 1, scale: 1, filter: 'blur(0px)',
            duration: 1.5, ease: 'expo.out',
            scrollTrigger: { trigger: sel, start: 'top 75%', toggleActions: 'play none none reverse' }
          }
        )

        gsap.fromTo(`${sel} .rte2-rule`,
          { scaleX: 0 },
          {
            scaleX: 1, duration: 1.3, ease: 'expo.inOut',
            scrollTrigger: { trigger: sel, start: 'top 72%', toggleActions: 'play none none reverse' }
          }
        )

        gsap.fromTo(`${sel} .rte2-line-a`,
          { opacity: 0, x: -90, filter: 'blur(5px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: 1.1, ease: 'expo.out', delay: 0.1,
            scrollTrigger: { trigger: sel, start: 'top 70%', toggleActions: 'play none none reverse' }
          }
        )

        gsap.fromTo(`${sel} .rte2-line-b`,
          { opacity: 0, x: 90, filter: 'blur(5px)' },
          {
            opacity: 1, x: 0, filter: 'blur(0px)',
            duration: 1.1, ease: 'expo.out', delay: 0.22,
            scrollTrigger: { trigger: sel, start: 'top 70%', toggleActions: 'play none none reverse' }
          }
        )

        gsap.fromTo(`${sel} .rte2-body`,
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.3,
            scrollTrigger: { trigger: sel, start: 'top 68%', toggleActions: 'play none none reverse' }
          }
        )

        gsap.fromTo(`${sel} .rte2-sigil`,
          { opacity: 0, scale: 0.4, rotation: 30 },
          {
            opacity: 1, scale: 1, rotation: 0,
            duration: 1, ease: 'back.out(2)', delay: 0.4,
            scrollTrigger: { trigger: sel, start: 'top 70%', toggleActions: 'play none none reverse' }
          }
        )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ height: '300vh', position: 'relative', zIndex: 10 }}>
      <style>{`
        @keyframes rte2Breathe {
          0%, 100% { opacity: 0.04; }
          50%       { opacity: 0.08; }
        }
        @keyframes rte2Dot {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.7); }
        }
        .rte2-rule { transform-origin: left center; }
        .rte2-rule.right { transform-origin: right center; }
        .rte2-sigil {
          transition: transform 0.4s cubic-bezier(.34,1.56,.64,1), filter 0.3s ease;
          cursor: default;
        }
        .rte2-sigil:hover {
          transform: scale(1.18) rotate(10deg) !important;
          filter: brightness(1.5);
        }
      `}</style>

      {/* ── Section header ── */}
      <div style={{
        padding: 'clamp(80px, 10vh, 130px) clamp(32px, 8vw, 110px) clamp(60px, 8vh, 100px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {/* Overline bar */}
        <div className="rte2-overline" style={{
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36,
        }}>
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 10,
            letterSpacing: '0.22em', color: 'rgba(255,255,255,0.25)',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>Chapter 06</span>
          <span style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{
            fontFamily: 'DM Mono, monospace', fontSize: 10,
            letterSpacing: '0.22em', color: 'rgba(201,169,97,0.55)',
            textTransform: 'uppercase', whiteSpace: 'nowrap',
          }}>Artemis III · 2026</span>
        </div>

        {/* Hero display headline — staggered words */}
        <div style={{ overflow: 'hidden' }}>
          {['The', 'Lunar', 'Return'].map((word, i) => (
            <div
              key={word}
              className="rte2-hero-word"
              style={{
                display: 'block',
                opacity: 0,
                fontFamily: 'Cormorant Garamond, Georgia, serif',
                fontWeight: 300,
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                lineHeight: 0.88,
                letterSpacing: '-0.02em',
                paddingLeft: i === 1 ? '0.16em' : i === 2 ? '0.32em' : 0,
                color: i === 2 ? '#c9a961' : '#ffffff',
                fontStyle: i === 2 ? 'italic' : 'normal',
              }}
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      {/* ── Phase chapters ── */}
      {phases.map((phase, i) => {
        const isRight = phase.align === 'right'

        return (
          <div
            key={phase.index}
            className={`rte2-chapter rte2-chapter-${i}`}
            style={{
              position: 'relative',
              overflow: 'hidden',
              padding: 'clamp(64px, 9vh, 110px) clamp(32px, 8vw, 110px)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'grid',
              gridTemplateColumns: isRight
                ? '1fr clamp(280px, 40%, 560px)'
                : 'clamp(280px, 40%, 560px) 1fr',
              gap: 'clamp(32px, 5vw, 80px)',
              alignItems: 'center',
            }}
          >
            {/* Ghost watermark number */}
            <div className="rte2-watermark" style={{
              position: 'absolute',
              [isRight ? 'left' : 'right']: '-0.04em',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'Cormorant Garamond, Georgia, serif',
              fontSize: 'clamp(120px, 18vw, 250px)',
              fontWeight: 700,
              lineHeight: 1,
              color: `rgba(${phase.accentRgb}, 1)`,
              opacity: 0,
              pointerEvents: 'none',
              userSelect: 'none',
              animation: `rte2Breathe 5s ease-in-out infinite`,
              animationDelay: `${i * 1.2}s`,
              zIndex: 0,
            }}>
              {phase.index}
            </div>

            {/* Left text column */}
            {!isRight && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <TextContent phase={phase} />
              </div>
            )}

            {/* Display headline column */}
            <div style={{
              position: 'relative', zIndex: 1,
              textAlign: isRight ? 'right' : 'left',
            }}>
              {/* Rule with inset label */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 18,
                flexDirection: isRight ? 'row-reverse' : 'row',
              }}>
                <div
                  className={`rte2-rule${isRight ? ' right' : ''}`}
                  style={{
                    flex: 1, height: 1,
                    background: `linear-gradient(${isRight ? '270deg' : '90deg'}, rgba(${phase.accentRgb},0.7), transparent)`,
                  }}
                />
                <span style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: 9, letterSpacing: '0.2em',
                  color: `rgba(${phase.accentRgb}, 0.5)`,
                  textTransform: 'uppercase', whiteSpace: 'nowrap',
                }}>
                  {phase.label}
                </span>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: phase.accent, display: 'inline-block',
                  animation: `rte2Dot 2.5s ease-in-out infinite`,
                  animationDelay: `${i * 0.55}s`,
                  flexShrink: 0,
                }} />
              </div>

              {/* Massive split headline */}
              <div style={{ overflow: 'hidden', lineHeight: 0.88 }}>
                <div className="rte2-line-a" style={{
                  display: 'block', opacity: 0,
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontWeight: 300,
                  fontSize: 'clamp(42px, 5.5vw, 85px)',
                  letterSpacing: '-0.015em',
                  color: '#ffffff',
                }}>
                  {phase.headline[0]}
                </div>
                <div className="rte2-line-b" style={{
                  display: 'block', opacity: 0,
                  fontFamily: 'Cormorant Garamond, Georgia, serif',
                  fontWeight: 300,
                  fontSize: 'clamp(42px, 5.5vw, 85px)',
                  letterSpacing: '-0.015em',
                  fontStyle: 'italic',
                  color: phase.accent,
                  textShadow: `0 0 60px rgba(${phase.accentRgb}, 0.2)`,
                }}>
                  {phase.headline[1]}
                </div>
              </div>

              {/* Stat aside */}
              <div className="rte2-body" style={{
                marginTop: 18, opacity: 0,
                fontFamily: 'DM Mono, monospace',
                fontSize: 10, letterSpacing: '0.16em',
                color: `rgba(${phase.accentRgb}, 0.4)`,
                textTransform: 'uppercase',
              }}>
                {phase.aside}
              </div>

              {/* Sigil */}
              <div className="rte2-sigil" style={{
                marginTop: 24, opacity: 0,
                display: 'inline-flex',
                alignItems: 'center', justifyContent: 'center',
                width: 44, height: 44, borderRadius: '50%',
                border: `1px solid rgba(${phase.accentRgb}, 0.22)`,
                background: `rgba(${phase.accentRgb}, 0.05)`,
                marginLeft: isRight ? 'auto' : 0,
              }}>
                <SigilIcon index={i} accent={phase.accent} />
              </div>
            </div>

            {/* Right text column */}
            {isRight && (
              <div style={{ position: 'relative', zIndex: 1 }}>
                <TextContent phase={phase} />
              </div>
            )}
          </div>
        )
      })}

      {/* ── Chapter end rule ── */}
      <div style={{
        padding: 'clamp(40px, 5vh, 60px) clamp(32px, 8vw, 110px)',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <span style={{
          fontFamily: 'DM Mono, monospace', fontSize: 9,
          letterSpacing: '0.2em', color: 'rgba(255,255,255,0.18)',
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}>
          End of Chapter 06
        </span>
        <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
      </div>
    </div>
  )
}

// ── Shared text content block ──
function TextContent({ phase }) {
  return (
    <div className="rte2-body" style={{ opacity: 0 }}>
      {/* Phase index chip */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        marginBottom: 22,
        padding: '4px 12px 4px 4px',
        border: `1px solid rgba(${phase.accentRgb}, 0.18)`,
        borderRadius: 100,
        background: `rgba(${phase.accentRgb}, 0.05)`,
      }}>
        <span style={{
          width: 22, height: 22, borderRadius: '50%',
          background: `rgba(${phase.accentRgb}, 0.14)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'DM Mono, monospace',
          fontSize: 9, letterSpacing: '0.08em',
          color: phase.accent,
        }}>
          {phase.index}
        </span>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: 9, letterSpacing: '0.18em',
          color: `rgba(${phase.accentRgb}, 0.45)`,
          textTransform: 'uppercase',
        }}>
          Phase
        </span>
      </div>

      {/* Body copy — large italic serif */}
      <p style={{
        fontFamily: 'Cormorant Garamond, Georgia, serif',
        fontSize: 'clamp(14px, 1.1vw, 16px)',
        fontStyle: 'italic',
        lineHeight: 1.72,
        color: 'rgba(210, 222, 238, 0.72)',
        margin: 0,
        maxWidth: 400,
      }}>
        {phase.sub}
      </p>

      {/* Editorial tick marks */}
      <div style={{
        display: 'flex', gap: 4, marginTop: 26, alignItems: 'center',
      }}>
        {[1, 0.55, 0.28, 0.12].map((op, j) => (
          <div key={j} style={{
            width: j === 0 ? 26 : 8, height: 1,
            background: `rgba(${phase.accentRgb}, ${op * 0.55})`,
          }} />
        ))}
      </div>
    </div>
  )
}

// ── Small sigil SVG icons ──
function SigilIcon({ index, accent }) {
  const icons = [
    <svg key="0" viewBox="0 0 24 24" fill="none" width="20" height="20">
      <circle cx="12" cy="12" r="8" stroke={accent} strokeWidth="1" opacity="0.7" />
      <ellipse cx="12" cy="12" rx="3.5" ry="8" stroke={accent} strokeWidth="0.7" opacity="0.4" />
      <line x1="4" y1="12" x2="20" y2="12" stroke={accent} strokeWidth="0.7" opacity="0.4" />
    </svg>,
    <svg key="1" viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M12 3 Q17 7 17 14 L12 17 L7 14 Q7 7 12 3Z" stroke={accent} strokeWidth="1" opacity="0.75" />
      <path d="M7 14 Q10 18 12 19 Q14 18 17 14" stroke={accent} strokeWidth="1.2" opacity="0.9" fill="none" />
    </svg>,
    <svg key="2" viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M3 15 Q8 10 12 13 Q16 16 21 9" stroke={accent} strokeWidth="1.2" opacity="0.85" />
      <circle cx="12" cy="13" r="1.5" fill={accent} opacity="0.9" />
    </svg>,
    <svg key="3" viewBox="0 0 24 24" fill="none" width="20" height="20">
      <path d="M8 11 Q9 5 12 5 Q15 5 16 11Z" stroke={accent} strokeWidth="1" opacity="0.75" />
      <line x1="8" y1="11" x2="12" y2="18" stroke={accent} strokeWidth="0.8" opacity="0.5" />
      <line x1="16" y1="11" x2="12" y2="18" stroke={accent} strokeWidth="0.8" opacity="0.5" />
      <path d="M5 21 Q9 19 12 21 Q15 23 19 21" stroke={accent} strokeWidth="1" opacity="0.6" fill="none" />
    </svg>,
  ]
  return icons[index % icons.length]
}