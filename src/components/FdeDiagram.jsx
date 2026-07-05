import React, { useState } from 'react';
import { createPortal } from 'react-dom';

// Import the image (Astro returns a metadata object containing .src)
import tronCycleImg from '../assets/tron.png'; 

export default function FdeDiagram() {
    const [activePhase, setActivePhase] = useState('NONE');
    const [simStep, setSimStep] = useState(0); 
    const [inspectedNode, setInspectedNode] = useState(null);

    const ACCENTS = {
        CYAN: '#00bafa',
        PURPLE: '#8338ec',
        PINK: '#fe006f',
        YELLOW: '#febe0b'
    };

    const NODES = {
        pc: { title: "Program Counter (PC)", sub: "Pointer Register", desc: "Holds the memory address of the next machine instruction scheduled for retrieval. Increments automatically after a fetch cycle finishes." },
        mar: { title: "Memory Address Register (MAR)", sub: "Bus Interface Register", desc: "Holds the active physical memory address currently being read from or written to by the processing core configuration." },
        mdr: { title: "Memory Data Register (MDR)", sub: "Buffer Register", desc: "Acts as a temporary loading zone for binary data or instruction words pulled from main memory storage units." },
        ir: { title: "Instruction Register (IR)", sub: "Execution Pipeline Stage", desc: "Holds the raw operational code opcode bytes fetched from memory while the Control Unit maps its target routing vectors." },
        cu: { title: "Control Unit (CU)", sub: "Mainframe Logic Coordinator", desc: "Decodes binary machine instructions inside the IR, sending hardware execution step currents to sub-systems." },
        alu: { title: "Arithmetic Logic Unit (ALU)", sub: "Math Execution Core", desc: "Executes mathematical computations (addition, subtraction) and discrete boolean logic compares across register lines." },
        acc: { title: "Accumulator (ACC)", sub: "Primary Core Register", desc: "Instantly caches operational outputs produced directly by the ALU before they are moved back into deep storage registers." }
    };

    const handleSimTick = () => {
        setSimStep(prev => prev >= 3 ? 1 : prev + 1);
    };

    const toggleSimulation = () => {
        if (activePhase === 'SIMULATION') {
            setActivePhase('NONE');
            setSimStep(0);
        } else {
            setActivePhase('SIMULATION');
            setSimStep(1); 
        }
    };

    const currentActiveStream = activePhase === 'SIMULATION' 
        ? (simStep === 1 ? 'FETCH' : simStep === 2 ? 'DECODE' : 'EXECUTE')
        : activePhase;

    // Helper logic to color coordinates matching the flow sequence
    const getNodeStrokeColor = (nodeKey) => {
        if (currentActiveStream === 'FETCH' && ['pc', 'mar', 'mdr', 'ir'].includes(nodeKey)) return ACCENTS.CYAN;
        if (currentActiveStream === 'DECODE' && ['ir', 'cu'].includes(nodeKey)) return ACCENTS.PURPLE;
        if (currentActiveStream === 'EXECUTE' && ['cu', 'alu', 'acc'].includes(nodeKey)) return ACCENTS.PINK;
        return '#004d66'; 
    };

    return (
        <div style={{ 
            fontFamily: '"JetBrains Mono", "Courier New", monospace', 
            color: '#c0f3ff', 
            backgroundColor: '#020204',
            position: 'relative',
            padding: '20px', 
            width: '100%',
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            <style>{`
                .tron-line { position: absolute; background: ${ACCENTS.CYAN}; box-shadow: 0 0 10px ${ACCENTS.CYAN}, 0 0 20px ${ACCENTS.CYAN}; }
                .tron-top { top: 0; left: -100%; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, ${ACCENTS.CYAN}); animation: cycle-top 4s linear infinite; }
                .tron-right { top: -100%; right: 0; width: 2px; height: 100%; background: linear-gradient(180deg, transparent, ${ACCENTS.CYAN}); animation: cycle-right 4s linear infinite; animation-delay: 1s; }
                .tron-bottom { bottom: 0; right: -100%; width: 100%; height: 2px; background: linear-gradient(270deg, transparent, ${ACCENTS.CYAN}); animation: cycle-bottom 4s linear infinite; animation-delay: 2s; }
                .tron-left { bottom: -100%; left: 0; width: 2px; height: 100%; background: linear-gradient(360deg, transparent, ${ACCENTS.CYAN}); animation: cycle-left 4s linear infinite; animation-delay: 3s; }
                
                @keyframes cycle-top { 0% { left: -100%; } 50%, 100% { left: 100%; } }
                @keyframes cycle-right { 0% { top: -100%; } 50%, 100% { top: 100%; } }
                @keyframes cycle-bottom { 0% { right: -100%; } 50%, 100% { right: 100%; } }
                @keyframes cycle-left { 0% { bottom: -100%; } 50%, 100% { bottom: 100%; } }

                .svg-node { fill: #05080c; stroke-width: 2px; cursor: pointer; transition: all 0.2s ease-in-out; }
                .svg-node:hover { stroke: ${ACCENTS.YELLOW} !important; filter: drop-shadow(0 0 8px rgba(254, 190, 11, 0.4)); }
                .svg-text { fill: #c0f3ff; font-family: 'JetBrains Mono', monospace; font-size: 14px; pointer-events: none; text-anchor: middle; dominant-baseline: middle; font-weight: bold; }
                .cycle-glow { filter: drop-shadow(0 0 6px currentColor); }
            `}</style>

            <div className="tron-line tron-top"></div>
            <div className="tron-line tron-right"></div>
            <div className="tron-line tron-bottom"></div>
            <div className="tron-line tron-left"></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', zIndex: 10, position: 'relative' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span style={{ color: '#537a85', marginRight: '10px' }}>RUN TRACE:</span>
                    <button onClick={() => { setActivePhase(activePhase === 'FETCH' ? 'NONE' : 'FETCH'); setSimStep(0); }} style={{ background: activePhase === 'FETCH' ? ACCENTS.CYAN : '#05080c', color: activePhase === 'FETCH' ? '#000' : ACCENTS.CYAN, border: `1px solid ${ACCENTS.CYAN}`, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', transition: 'all 0.2s' }}>FETCH</button>
                    <button onClick={() => { setActivePhase(activePhase === 'DECODE' ? 'NONE' : 'DECODE'); setSimStep(0); }} style={{ background: activePhase === 'DECODE' ? ACCENTS.PURPLE : '#05080c', color: activePhase === 'DECODE' ? '#000' : ACCENTS.PURPLE, border: `1px solid ${ACCENTS.PURPLE}`, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', transition: 'all 0.2s' }}>DECODE</button>
                    <button onClick={() => { setActivePhase(activePhase === 'EXECUTE' ? 'NONE' : 'EXECUTE'); setSimStep(0); }} style={{ background: activePhase === 'EXECUTE' ? ACCENTS.PINK : '#05080c', color: activePhase === 'EXECUTE' ? '#000' : ACCENTS.PINK, border: `1px solid ${ACCENTS.PINK}`, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', transition: 'all 0.2s' }}>EXECUTE</button>
                    <span style={{ color: '#537a85', margin: '0 10px' }}>|</span>
                    <button onClick={toggleSimulation} style={{ background: activePhase === 'SIMULATION' ? ACCENTS.YELLOW : '#05080c', color: activePhase === 'SIMULATION' ? '#000' : ACCENTS.YELLOW, border: `1px solid ${ACCENTS.YELLOW}`, padding: '8px 16px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', transition: 'all 0.2s' }}>{activePhase === 'SIMULATION' ? 'HALT SIMULATION' : 'START SIMULATION'}</button>
                </div>

                {activePhase === 'SIMULATION' && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'rgba(254, 190, 11, 0.1)', padding: '10px', borderLeft: `3px solid ${ACCENTS.YELLOW}` }}>
                        <button onClick={handleSimTick} style={{ background: ACCENTS.YELLOW, color: '#000', border: 'none', padding: '6px 15px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold' }}>TICK CLOCK &gt;&gt;</button>
                        <span style={{ color: ACCENTS.YELLOW, fontSize: '0.9rem' }}>
                            Current Step: <strong style={{ color: '#fff' }}>{simStep === 1 ? '[1] FETCH' : simStep === 2 ? '[2] DECODE' : '[3] EXECUTE'}</strong>
                        </span>
                    </div>
                )}
            </div>

            <div style={{ width: '100%', border: '1px solid #002b3d', background: 'rgba(5, 8, 12, 0.8)', position: 'relative' }}>
                <svg viewBox="0 0 800 450" style={{ width: '100%', height: 'auto', display: 'block' }}>
                    <defs>
                        <g id="light-cycle">
                            {/* Visual light trailing ribbon behind vehicle */}
                            <rect x="-45" y="-1.5" width="45" height="3" fill="currentColor" opacity="0.7" />
                            <image href={tronCycleImg.src} x="-30" y="-20" width="60" height="40" preserveAspectRatio="xMidYMid meet" />
                        </g>

                        {/* Continuous loop maps driving through target sequences sequentially */}
                        <path id="seq-path-fetch" d="M 100 110 L 100 170 M 100 230 L 100 300 M 150 330 L 280 330 L 280 80 L 350 80" />
                        <path id="seq-path-decode" d="M 400 110 L 400 170" />
                        <path id="seq-path-execute" d="M 450 200 L 650 200 M 700 230 L 700 300 M 650 330 L 580 330 L 580 200 L 650 200" />
                    </defs>

                    {/* Passive bus grid blueprint lines */}
                    <g stroke="#002b3d" strokeWidth="2" strokeDasharray="4 4" fill="none">
                        <path d="M 100 110 L 100 170" />
                        <path d="M 100 230 L 100 300" />
                        <path d="M 150 330 L 280 330 L 280 80 L 350 80" />
                        <path d="M 400 110 L 400 170" />
                        <path d="M 450 200 L 650 200" />
                        <path d="M 700 230 L 700 300" />
                        <path d="M 650 330 L 580 330 L 580 200 L 650 200" />
                    </g>

                    {/* Single continuous light cycle movements per trace configuration */}
                    {currentActiveStream === 'FETCH' && (
                        <g color={ACCENTS.CYAN} fill="currentColor" className="cycle-glow">
                            <use href="#light-cycle">
                                <animateMotion dur="2.5s" repeatCount="indefinite" rotate="auto"><mpath href="#seq-path-fetch"/></animateMotion>
                            </use>
                        </g>
                    )}
                    
                    {currentActiveStream === 'DECODE' && (
                        <g color={ACCENTS.PURPLE} fill="currentColor" className="cycle-glow">
                            <use href="#light-cycle">
                                <animateMotion dur="1s" repeatCount="indefinite" rotate="auto"><mpath href="#seq-path-decode"/></animateMotion>
                            </use>
                        </g>
                    )}

                    {currentActiveStream === 'EXECUTE' && (
                        <g color={ACCENTS.PINK} fill="currentColor" className="cycle-glow">
                            <use href="#light-cycle">
                                <animateMotion dur="3s" repeatCount="indefinite" rotate="auto"><mpath href="#seq-path-execute"/></animateMotion>
                            </use>
                        </g>
                    )}

                    {/* Hardware Block Configurations with Dynamic Synced Colors */}
                    <g onClick={() => setInspectedNode('pc')}>
                        <rect x="50" y="50" width="100" height="60" rx="4" className="svg-node" stroke={getNodeStrokeColor('pc')} />
                        <text x="100" y="80" className="svg-text">PC</text>
                    </g>
                    <g onClick={() => setInspectedNode('mar')}>
                        <rect x="50" y="170" width="100" height="60" rx="4" className="svg-node" stroke={getNodeStrokeColor('mar')} />
                        <text x="100" y="200" className="svg-text">MAR</text>
                    </g>
                    <g onClick={() => setInspectedNode('mdr')}>
                        <rect x="50" y="300" width="100" height="60" rx="4" className="svg-node" stroke={getNodeStrokeColor('mdr')} />
                        <text x="100" y="330" className="svg-text">MDR</text>
                    </g>
                    <g onClick={() => setInspectedNode('ir')}>
                        <rect x="350" y="50" width="100" height="60" rx="4" className="svg-node" stroke={getNodeStrokeColor('ir')} />
                        <text x="400" y="80" className="svg-text">IR</text>
                    </g>
                    <g onClick={() => setInspectedNode('cu')}>
                        <rect x="350" y="170" width="100" height="60" rx="4" className="svg-node" stroke={getNodeStrokeColor('cu')} />
                        <text x="400" y="200" className="svg-text">CU</text>
                    </g>
                    <g onClick={() => setInspectedNode('alu')}>
                        <rect x="650" y="170" width="100" height="60" rx="4" className="svg-node" stroke={getNodeStrokeColor('alu')} />
                        <text x="700" y="200" className="svg-text">ALU</text>
                    </g>
                    <g onClick={() => setInspectedNode('acc')}>
                        <rect x="650" y="300" width="100" height="60" rx="4" className="svg-node" stroke={getNodeStrokeColor('acc')} />
                        <text x="700" y="330" className="svg-text">ACC</text>
                    </g>
                </svg>
            </div>

            {inspectedNode && typeof document !== 'undefined' && createPortal(
                <div style={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100vw', 
                    height: '100vh', 
                    backgroundColor: 'rgba(5, 8, 12, 0.92)', 
                    zIndex: 99999,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    backdropFilter: 'blur(4px)' 
                }}>
                    <div style={{ backgroundColor: '#020204', border: `2px solid #004d66`, padding: '30px', borderRadius: '4px', maxWidth: '400px', width: '90%', boxShadow: `0 0 20px rgba(0,186,250,0.1)`, position: 'relative' }}>
                        <button onClick={() => setInspectedNode(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#fe006f', fontSize: '1.2rem', cursor: 'pointer', fontFamily: 'inherit' }}>[X]</button>
                        <h2 style={{ margin: '0 0 5px 0', color: '#00bafa', fontSize: '1.3rem', letterSpacing: '1px' }}>🔎 {NODES[inspectedNode].title}</h2>
                        <span style={{ color: '#537a85', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{NODES[inspectedNode].sub}</span>
                        
                        <hr style={{ border: 'none', height: '1px', background: '#004d66', margin: '20px 0' }} />
                        
                        <p style={{ color: '#c0f3ff', lineHeight: '1.6', margin: 0, fontSize: '0.9rem' }}>{NODES[inspectedNode].desc}</p>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}