import React, { useEffect, useRef, useState } from 'react';

const PHASES = [
  {
    phase: 1,
    startDay: 'Day 01',
    date: 'April 01, 2026',
    title: 'Trans-Lunar Injection',
    stat: 'v = 39,000 km/h',
    text: 'Following a successful launch from Kennedy Space Center, the SLS Upper Stage performs the critical TLI burn. This maneuver provides the necessary velocity to break Earth\'s gravitational pull and set Orion on a precise trajectory toward the Moon.',
    details: [
      { label: 'Altitude', value: '420 km' },
      { label: 'Fuel', value: '88%' },
      { label: 'System', value: 'Nominal' }
    ]
  },
  {
    phase: 2,
    startDay: 'Day 06',
    date: 'April 06, 2026',
    title: 'Lunar Gravity Assist',
    stat: 'Alt: 7,500 km',
    text: 'Orion enters the lunar sphere of influence. The spacecraft utilizes the Moon\'s gravity to slingshot into a distant retrograde orbit. During the far-side pass, the crew experiences a 20-minute radio blackout, the most profound isolation in human history.',
    details: [
      { label: 'Velocity', value: '2,100 km/h' },
      { label: 'Signal', value: 'Blackout Risk' },
      { label: 'Orbit', value: 'Flyby' }
    ]
  },
  {
    phase: 3,
    startDay: 'Day 10',
    date: 'April 11, 2026',
    title: 'Atmospheric Entry',
    stat: 'Temp: 2,760°C',
    text: 'The return journey concludes with a high-velocity entry. Orion hits the upper atmosphere at Mach 32. The innovative "skip reentry" technique is employed to manage heat loads and G-forces before the final parachute deployment in the Pacific.',
    details: [
      { label: 'G-Force', value: '4.2 G' },
      { label: 'Shield', value: 'Ablating' },
      { label: 'Status', value: 'Descending' }
    ]
  }
];

export function JourneyOverlay() {
  const [activePhase, setActivePhase] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const phase = parseInt(entry.target.dataset.phase, 10);
            setActivePhase(phase);
          }
        });
      },
      {
        root: null,
        rootMargin: '-40% 0px -40% 0px',
        threshold: 0
      }
    );

    const sentinels = sectionRef.current.querySelectorAll('.phase-sentinel');
    sentinels.forEach(s => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  const phaseData = PHASES.find(p => p.phase === activePhase) || PHASES[0];

  return (
    <div ref={sectionRef} style={{ position: 'relative', height: '300vh', zIndex: 20 }}>
      {/* Sentinels for scroll tracking within this section */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div className="phase-sentinel" data-phase="1" style={{ height: '100vh' }}></div>
        <div className="phase-sentinel" data-phase="2" style={{ height: '100vh' }}></div>
        <div className="phase-sentinel" data-phase="3" style={{ height: '100vh' }}></div>
      </div>

      {/* Fixed HUD - Left Side */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        padding: '0 6vw',
        pointerEvents: 'none',
        zIndex: 50,
      }}>
        <div
          style={{
            width: 'min(440px, 40vw)',
            opacity: activePhase > 0 ? 1 : 0,
            transform: activePhase > 0 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 1s ease-out, transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
            background: 'rgba(10, 15, 25, 0.4)',
            backdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '24px',
            padding: '40px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)',
            pointerEvents: 'auto',
          }}
        >
          {/* Header Section */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '16px'
            }}>
              <span style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '11px',
                letterSpacing: '0.2em',
                color: '#4fc3f7',
                textTransform: 'uppercase',
                background: 'rgba(79, 195, 247, 0.1)',
                padding: '4px 10px',
                borderRadius: '6px',
                border: '1px solid rgba(79, 195, 247, 0.2)'
              }}>
                Phase 0{activePhase || 1}
              </span>
              <div style={{
                height: '1px',
                flex: 1,
                background: 'linear-gradient(90deg, rgba(79, 195, 247, 0.3), transparent)'
              }} />
            </div>

            <h2 style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontSize: '2.5rem',
              fontWeight: 300,
              lineHeight: 1.1,
              color: '#ffffff',
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              {phaseData.title}
            </h2>
          </div>

          {/* Description */}
          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '15px',
            color: 'rgba(255, 255, 255, 0.6)',
            lineHeight: '1.7',
            marginBottom: '32px',
            fontWeight: 300,
          }}>
            {phaseData.text}
          </p>

          {/* Detailed Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
            marginBottom: '40px',
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.05)'
          }}>
            {phaseData.details.map((detail, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: '9px',
                  color: 'rgba(255, 255, 255, 0.3)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '4px'
                }}>
                  {detail.label}
                </div>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontSize: '13px',
                  color: '#ffffff',
                  fontWeight: 500
                }}>
                  {detail.value}
                </div>
              </div>
            ))}
          </div>

          {/* Footer / Progress */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{
              fontFamily: '"DM Mono", monospace',
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.4)'
            }}>
              {phaseData.startDay}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3].map(num => (
                <div
                  key={num}
                  style={{
                    height: '4px',
                    width: activePhase === num ? '24px' : '8px',
                    backgroundColor: activePhase === num ? '#4fc3f7' : 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '2px',
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=DM+Sans:wght@300;400;500&family=DM+Mono&display=swap');
        `}
      </style>
    </div>
  );
}