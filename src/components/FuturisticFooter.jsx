import React, { useEffect, useRef, useState } from 'react';

export function FuturisticFooter() {
    const [isVisible, setIsVisible] = useState(false);
    const footerRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => {
            if (footerRef.current) {
                observer.unobserve(footerRef.current);
            }
        };
    }, []);

    return (
        <div className="relative w-full z-50 pointer-events-auto" ref={footerRef}>
            {/* Main solid black footer container with domed top edge */}
            <div
                className="w-full pt-16 pb-16 px-8 relative"
                style={{
                    // Creates an arch: 50% width horizontal radius, 100px vertical radius
                    borderRadius: '50% 50% 0 0 / 120px 120px 0 0',
                    background: '#000000',
                    borderTop: '2px solid rgba(79, 195, 247, 0.3)',
                    marginTop: '-60px' // Slightly pull up over the scene
                }}
            >
                <div
                    className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center transition-all duration-1000"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(40px)'
                    }}
                >
                    {/* Brand & Mission Status */}
                    <div className="mb-8 md:mb-0 text-center md:text-left">
                        <h2
                            className="text-4xl mb-2 font-serif text-white tracking-wider"
                            style={{ fontFamily: '"Cormorant Garamond", serif', textShadow: '0 0 20px rgba(255,255,255,0.1)' }}
                        >
                            ARTEMIS II
                        </h2>
                        <p
                            className="text-sm font-mono tracking-widest text-[#4fc3f7] opacity-80 mb-1"
                            style={{ fontFamily: '"DM Mono", monospace' }}
                        >
                            MISSION STATUS: SUCCESSFULLY COMPLETED
                        </p>
                        <p
                            className="text-xs font-mono tracking-widest text-gray-400 opacity-80"
                            style={{ fontFamily: '"DM Mono", monospace' }}
                        >
                            SPLASHDOWN: APRIL 11, 2026
                        </p>
                    </div>

                    {/* Links Section */}
                    <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-center md:text-left">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-white font-mono text-xs tracking-widest uppercase mb-2 border-b border-[#4fc3f7] opacity-40 pb-1 w-max mx-auto md:mx-0">Mission Logs</h4>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors font-sans text-sm hover:translate-x-1 inline-block transform duration-300 w-max mx-auto md:mx-0">Post-Mission Report</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors font-sans text-sm hover:translate-x-1 inline-block transform duration-300 w-max mx-auto md:mx-0">Crew Recovery</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors font-sans text-sm hover:translate-x-1 inline-block transform duration-300 w-max mx-auto md:mx-0">Orion Diagnostics</a>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="text-white font-mono text-xs tracking-widest uppercase mb-2 border-b border-[#4fc3f7] opacity-40 pb-1 w-max mx-auto md:mx-0">Archives</h4>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors font-sans text-sm hover:translate-x-1 inline-block transform duration-300 w-max mx-auto md:mx-0">Flight Path Data</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors font-sans text-sm hover:translate-x-1 inline-block transform duration-300 w-max mx-auto md:mx-0">Lunar Flyby Gallery</a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors font-sans text-sm hover:translate-x-1 inline-block transform duration-300 w-max mx-auto md:mx-0">Splashdown Telemetry</a>
                        </div>
                    </div>
                </div>

                {/* Separator / Copyright */}
                <div
                    className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center transition-all duration-1000 delay-300"
                    style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
                    }}
                >
                    <p className="text-gray-500 font-sans text-xs mb-4 sm:mb-0">
                        &copy; {new Date().getFullYear()} Artemis Program Visualization. FOR DEMONSTRATION PURPOSES.
                    </p>
                    <div className="flex gap-4">
                        {/* Simple decorative squares / tech elements */}
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="w-2 h-2 rounded-sm bg-[#4fc3f7] opacity-50"
                                style={{
                                    animation: `pulse ${2 + i * 0.5}s infinite ease-in-out`
                                }}
                            />
                        ))}
                        <style>
                            {`
                @keyframes pulse {
                  0%, 100% { opacity: 0.3; transform: scale(1); }
                  50% { opacity: 0.8; transform: scale(1.2); box-shadow: 0 0 10px #4fc3f7; }
                }
              `}
                        </style>
                    </div>
                </div>
            </div>
        </div>
    );
}
