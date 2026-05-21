import React, { useEffect, useRef, useState } from 'react';
import { useScene } from '../context/SceneContext';

const PHASES = [
  {
    phase: 1,
    startDay: 'Day 1',
    date: 'April 1 2026',
    title: 'Launch',
    stat: '8.8M lbs of thrust',
    text: 'SLS rocket clears the tower, propelling Orion out of Earth\'s gravity well.'
  },
  {
    phase: 2,
    startDay: 'Day 6',
    date: 'April 6 2026',
    title: 'Lunar Flyby',
    stat: '385,000 km from Earth',
    text: 'Orion enters the lunar sphere of influence, losing communication with Earth at the far side (radio blackout).'
  },
  {
    phase: 3,
    startDay: 'Day 10',
    date: 'April 11 2026',
    title: 'Return & Splashdown',
    stat: '5,000°F heat shield',
    text: 'The crew enters Earth’s atmosphere traveling at nearly Mach 32. Splashdown in the Pacific Ocean.'
  }
];

export function JourneyOverlay() {
  const [activePhase, setActivePhase] = useState(0); // 0 = none, 1-3

  const spacerRef0 = useRef(null);
  const spacerRef1 = useRef(null);
  const spacerRef2 = useRef(null);
  const spacerRef3 = useRef(null);

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
        rootMargin: '-50% 0px -50% 0px', // Trigger exactly as it crosses the middle of screen
        threshold: 0
      }
    );

    if (spacerRef0.current) observer.observe(spacerRef0.current);
    if (spacerRef1.current) observer.observe(spacerRef1.current);
    if (spacerRef2.current) observer.observe(spacerRef2.current);
    if (spacerRef3.current) observer.observe(spacerRef3.current);

    return () => observer.disconnect();
  }, []);

  const phaseData = PHASES.find(p => p.phase === activePhase) || PHASES[0];

  return (
    <>
      {/* 3 scroll sentinels (each 100vh) placed exactly in sync with the SceneManager scroll space for this section */}
      <div style={{ position: 'absolute', top: '0', width: '1px', height: '400vh', pointerEvents: 'none', zIndex: 0 }}>
        <div ref={spacerRef0} data-phase="0" style={{ height: '100vh' }}></div>
        <div ref={spacerRef1} data-phase="1" style={{ height: '100vh' }}></div>
        <div ref={spacerRef2} data-phase="2" style={{ height: '100vh' }}></div>
        <div ref={spacerRef3} data-phase="3" style={{ height: '100vh' }}></div>
      </div>

      {/* Fixed HUD container wrapper */}
      <div style={{
        position: 'fixed',
        top: '15vh',
        right: '5vw',
        width: '400px',
        pointerEvents: 'none',
        zIndex: 50,
        opacity: activePhase > 0 ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out',
        background: 'rgba(10, 20, 35, 0.6)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(100, 180, 255, 0.2)',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      }}>
        <div
          key={activePhase} // Force re-render for animation trigger
          style={{
            animation: 'fadeInUp 0.6s ease-out forwards',
            opacity: 0,
            transform: 'translateY(10px)'
          }}
        >
          <style>
            {`
              @keyframes fadeInUp {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>

          <div style={{
            fontFamily: '"DM Mono", monospace',
            color: '#4fc3f7',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem'
          }}>
            {phaseData.startDay} &mdash; {phaseData.date}
          </div>

          <h2 style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '2rem',
            lineHeight: 1.1,
            color: 'white',
            marginBottom: '0.8rem'
          }}>
            {phaseData.title}
          </h2>

          <p style={{
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '0.9rem',
            color: 'rgba(180,215,240,0.9)',
            lineHeight: 1.5,
            marginBottom: '1.2rem'
          }}>
            {phaseData.text}
          </p>

          <div style={{
            display: 'inline-block',
            border: '1px solid rgba(79, 195, 247, 0.4)',
            padding: '4px 12px',
            borderRadius: '12px',
            fontFamily: '"DM Mono", monospace',
            fontSize: '0.75rem',
            color: '#4fc3f7',
            marginBottom: '1rem'
          }}>
            {phaseData.stat}
          </div>
        </div>

        {/* Indicators */}
        <div style={{
          display: 'flex',
          gap: '6px',
          marginTop: '10px'
        }}>
          {[1, 2, 3].map(num => (
            <div
              key={num}
              style={{
                height: '3px',
                width: activePhase === num ? '20px' : '8px',
                backgroundColor: activePhase === num ? '#4fc3f7' : 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}