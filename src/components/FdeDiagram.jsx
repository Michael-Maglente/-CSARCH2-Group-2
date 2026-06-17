import React, { useState } from 'react';

export default function FdeDiagram() {
    // 1. Unlocked State: Users can jump anywhere freely
    const [activePhase, setActivePhase] = useState('NONE');
    const [simStep, setSimStep] = useState(0); 
    const [inspectedNode, setInspectedNode] = useState(null);
    
    // Track answers independently per phase so they aren't reset
    const [quizAnswers, setQuizAnswers] = useState({});

    // Neon Cyberpunk Colors
    const COLORS = { FETCH: '#00f0ff', DECODE: '#bc52ee', EXECUTE: '#ff3366', SIMULATION: '#6DA55F', NONE: '#2a2f3a' };

    // --- SOUND ENGINE ---
    const playSound = (freq, type = 'sine', duration = 0.1) => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            console.log("Audio requires user interaction first.");
        }
    };

    // 2. The Optional Quiz Data
    const QUIZ_DATA = {
        FETCH: {
            question: "What exactly is the PC sending to the MAR?",
            options: ["The actual binary instruction", "The memory address", "A mathematical result"],
            correct: 1,
            explanation: "The PC only holds the ADDRESS. The MAR uses this address to find the actual data inside the RAM."
        },
        DECODE: {
            question: "Which component translates the binary code?",
            options: ["The ALU", "The Main Memory", "The Control Unit (CU)"],
            correct: 2,
            explanation: "The Control Unit translates the raw binary held in the IR to figure out which electrical paths to activate."
        },
        EXECUTE: {
            question: "Where does the ALU send immediate calculation results?",
            options: ["Directly to the hard drive", "Into the Registers", "To the Program Counter"],
            correct: 1,
            explanation: "Registers are ultra-fast temporary storage spots right next to the ALU, perfect for holding active data."
        }
    };

    // Upgraded Node Data
    const NODES = {
        PC: { top: '10%', left: '10%', title: 'PC', sub: 'Program Counter', desc: 'Holds the memory address of the next instruction.' },
        MAR: { top: '40%', left: '10%', title: 'MAR', sub: 'Memory Address Register', desc: 'Holds the exact memory address that the CPU is currently accessing.' },
        RAM: { top: '70%', left: '10%', title: 'RAM', sub: 'Main Memory', desc: 'External storage containing instructions and variables.' },
        IR: { top: '70%', left: '40%', title: 'IR', sub: 'Instruction Register', desc: 'Holds the actual instruction just pulled from RAM.' },
        CU: { top: '40%', left: '40%', title: 'Control Unit', sub: 'Decoder', desc: 'Translates the binary instruction and fires signals.' },
        ALU: { top: '40%', left: '70%', title: 'ALU', sub: 'Arithmetic Logic', desc: 'Performs mathematical calculations and logical comparisons.' },
        REG: { top: '70%', left: '70%', title: 'Registers', sub: 'General Purpose', desc: 'Temporary storage spots right next to the ALU.' }
    };

    // 3. Mapping lines for the Interactive Map
    const TOUR_STAGES = {
        FETCH: { nodes: ['PC', 'MAR', 'RAM', 'IR'], lines: [{ x1: '20%', y1: '25%', x2: '20%', y2: '37%' }, { x1: '20%', y1: '55%', x2: '20%', y2: '67%' }, { x1: '30%', y1: '77.5%', x2: '37%', y2: '77.5%' }], packets: [{ top: '30%', left: '22%', text: 'Addr: 0x00A4' }, { top: '60%', left: '22%', text: 'Addr: 0x00A4' }, { top: '73%', left: '31%', text: 'Data: 10110010' }] },
        DECODE: { nodes: ['IR', 'CU'], lines: [{ x1: '50%', y1: '70%', x2: '50%', y2: '58%' }], packets: [{ top: '63%', left: '52%', text: 'Opcode: 10110010' }] },
        EXECUTE: { nodes: ['CU', 'ALU', 'REG'], lines: [{ x1: '60%', y1: '47.5%', x2: '67%', y2: '47.5%' }, { x1: '80%', y1: '55%', x2: '80%', y2: '67%' }], packets: [{ top: '43%', left: '61%', text: 'Signal: ADD' }, { top: '60%', left: '82%', text: 'Result: 15' }] },
        NONE: { nodes: [], lines: [], packets: [] }
    };

    // 4. Tick-by-Tick Simulation
    const CLOCK_STEPS = [
        { phaseName: "FETCH (Tick 1)", color: '#00f0ff', nodes: ['PC', 'MAR'], lines: [{ x1: '20%', y1: '25%', x2: '20%', y2: '37%' }], packets: [{ top: '30%', left: '22%', text: 'Addr: 0x0010' }], thoughts: [{ comp: 'System Clock', text: "TICK 1 ⚡" }, { comp: 'PC', text: "Sending memory address to MAR." }] },
        { phaseName: "FETCH (Tick 2)", color: '#00f0ff', nodes: ['MAR', 'RAM'], lines: [{ x1: '20%', y1: '55%', x2: '20%', y2: '67%' }], packets: [{ top: '60%', left: '22%', text: 'Accessing...' }], thoughts: [{ comp: 'System Clock', text: "TICK 2 ⚡" }, { comp: 'RAM', text: "Retrieving instruction at address 0x0010." }] },
        { phaseName: "FETCH (Tick 3)", color: '#00f0ff', nodes: ['RAM', 'IR'], lines: [{ x1: '30%', y1: '77.5%', x2: '37%', y2: '77.5%' }], packets: [{ top: '73%', left: '31%', text: 'Inst: ADD R1' }], thoughts: [{ comp: 'System Clock', text: "TICK 3 ⚡" }, { comp: 'IR', text: "Loading the raw ADD instruction." }] },
        { phaseName: "DECODE (Tick 4)", color: '#bc52ee', nodes: ['IR', 'CU'], lines: [{ x1: '50%', y1: '70%', x2: '50%', y2: '58%' }], packets: [{ top: '63%', left: '52%', text: 'Opcode: ADD' }], thoughts: [{ comp: 'System Clock', text: "TICK 4 ⚡" }, { comp: 'CU', text: "Decoding the ADD opcode and fetching required data." }] },
        { phaseName: "EXECUTE (Tick 5)", color: '#ff3366', nodes: ['CU', 'ALU'], lines: [{ x1: '60%', y1: '47.5%', x2: '67%', y2: '47.5%' }], packets: [{ top: '43%', left: '61%', text: 'Signal: ADD' }], thoughts: [{ comp: 'System Clock', text: "TICK 5 ⚡" }, { comp: 'ALU', text: "Performing addition (e.g., 5 + 10)." }] },
        { phaseName: "EXECUTE (Tick 6)", color: '#ff3366', nodes: ['ALU', 'REG'], lines: [{ x1: '80%', y1: '55%', x2: '80%', y2: '67%' }], packets: [{ top: '60%', left: '82%', text: 'Result: 15' }], thoughts: [{ comp: 'System Clock', text: "TICK 6 ⚡" }, { comp: 'REG', text: "Storing final result 15 into memory." }] }
    ];

    let currentRenderData;
    let currentColor;
    if (activePhase === 'SIMULATION') {
        currentRenderData = CLOCK_STEPS[simStep];
        currentColor = CLOCK_STEPS[simStep].color;
    } else {
        currentRenderData = TOUR_STAGES[activePhase];
        currentColor = COLORS[activePhase];
    }

    const { nodes, lines, packets } = currentRenderData;
    const currentQuiz = (activePhase === 'FETCH' || activePhase === 'DECODE' || activePhase === 'EXECUTE') ? QUIZ_DATA[activePhase] : null;
    const answeredPhaseObj = quizAnswers[activePhase]; 

    // Event Handlers with Audio Integration
    const handleTick = (direction) => {
        playSound(440, 'square', 0.05); // Mechanical tick sound
        if (direction === 'next') {
            setSimStep(Math.min(CLOCK_STEPS.length - 1, simStep + 1));
        } else {
            setSimStep(Math.max(0, simStep - 1));
        }
    };

    const handleAnswer = (idx) => {
        if (answeredPhaseObj !== undefined) return;
        
        const isCorrect = idx === currentQuiz.correct;
        playSound(isCorrect ? 880 : 150, isCorrect ? 'sine' : 'sawtooth', 0.2); // Success/Error chime
        
        setQuizAnswers({
            ...quizAnswers,
            [activePhase]: { choice: idx, correct: isCorrect }
        });
    };

    const changePhase = (phase) => {
        playSound(600, 'triangle', 0.05); // Phase shift blip
        setActivePhase(phase); 
        setSimStep(0); 
    };

    return (
        <div style={{ backgroundColor: '#0b0f19', padding: '25px', borderRadius: '12px', color: '#fff', border: '1px solid #1f2430', maxWidth: '900px', margin: '30px auto', fontFamily: 'sans-serif' }}>
            
            {/* CSS ANIMATIONS */}
            <style>
                {`
                    @keyframes dataFlow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
                    @keyframes packetPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
                    @keyframes quizGlow { 
                        0% { box-shadow: 0 0 5px ${currentColor}40; } 
                        50% { box-shadow: 0 0 20px ${currentColor}80; } 
                        100% { box-shadow: 0 0 5px ${currentColor}40; } 
                    }
                    .animated-data-line { stroke-dasharray: 8 6; animation: dataFlow 0.5s linear infinite; }
                    .hover-node { transition: all 0.2s ease; cursor: pointer; pointer-events: auto; }
                    .hover-node:hover { transform: scale(1.05); filter: brightness(1.3); z-index: 10 !important; }
                    .data-packet { animation: packetPulse 1.5s infinite ease-in-out; }
                    .quiz-panel { animation: quizGlow 2.5s infinite ease-in-out; }
                `}
            </style>

            <h3 style={{ textAlign: 'center', color: '#fff', marginTop: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
                Interactive CPU Architecture
            </h3>
            
            {/* UNLOCKED NAVIGATION */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px', flexWrap: 'wrap' }}>
                {['NONE', 'FETCH', 'DECODE', 'EXECUTE', 'SIMULATION'].map((phase) => {
                    const isActive = activePhase === phase;
                    const btnColor = COLORS[phase] || '#888';
                    return (
                        <button 
                            key={phase} 
                            onClick={() => changePhase(phase)}
                            style={{ padding: '10px 20px', borderRadius: '6px', border: `2px solid ${isActive ? btnColor : '#333'}`, background: isActive ? `${btnColor}20` : 'transparent', color: isActive ? '#fff' : '#888', fontWeight: 'bold', fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                            {phase === 'NONE' ? 'IDLE (CLEAR)' : (phase === 'SIMULATION' ? '⏱️ TICK SIMULATOR' : `${phase} PHASE`)}
                        </button>
                    );
                })}
            </div>

            {/* DIAGRAM GRID */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', backgroundColor: '#05070a', borderRadius: '8px', border: `1px solid ${currentColor}`, overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '4% 6%', transition: 'border 0.3s ease' }}>
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}>
                    <defs><marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill={currentColor} /></marker></defs>
                    {lines.map((line, idx) => <line key={idx} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={currentColor} strokeWidth="3" className="animated-data-line" markerEnd="url(#arrowhead)" />)}
                </svg>

                {Object.keys(NODES).map((key) => {
                    const node = NODES[key];
                    const isActive = nodes.includes(key);
                    return (
                        <div key={key} className="hover-node" onClick={() => setInspectedNode(key)} style={{ position: 'absolute', top: node.top, left: node.left, width: '20%', height: '15%', backgroundColor: '#0d1117', border: `2px solid ${isActive ? currentColor : '#2a2f3a'}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? `0 0 20px ${currentColor}40, inset 0 0 10px ${currentColor}20` : 'none', zIndex: 2, textAlign: 'center', padding: '5px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: isActive ? '#fff' : '#888', textShadow: isActive ? `0 0 5px ${currentColor}` : 'none' }}>{node.title}</span>
                            <span style={{ fontSize: '0.65rem', color: isActive ? '#ccc' : '#555', marginTop: '4px' }}>{node.sub}</span>
                        </div>
                    );
                })}

                {packets && packets.map((packet, idx) => (
                    <div key={`packet-${idx}`} className="data-packet" style={{ position: 'absolute', top: packet.top, left: packet.left, backgroundColor: '#0d1117', border: `1px solid ${currentColor}`, color: '#fff', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', boxShadow: `0 0 10px ${currentColor}80`, zIndex: 3, fontFamily: 'monospace', pointerEvents: 'none' }}>
                        {packet.text}
                    </div>
                ))}
            </div>

            {/* DYNAMIC BOTTOM PANEL */}
            <div style={{ marginTop: '25px' }}>
                
                {/* IDLE */}
                {activePhase === 'NONE' && (
                    <div style={{ textAlign: 'center', padding: '30px', backgroundColor: '#0d1117', borderRadius: '8px', border: '1px dashed #444' }}>
                        <p style={{ color: '#ccc', margin: 0 }}>System is currently idle. Click a phase above to explore the architecture, or jump straight into the Simulation.</p>
                    </div>
                )}

                {/* THE TOUR (FETCH, DECODE, EXECUTE) WITH SIDE-BY-SIDE QUIZ */}
                {(activePhase === 'FETCH' || activePhase === 'DECODE' || activePhase === 'EXECUTE') && (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        
                        {/* Left Side: Explanation */}
                        <div style={{ flex: '1 1 300px', backgroundColor: '#0d1117', padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${currentColor}` }}>
                            <h4 style={{ margin: '0 0 10px 0', color: currentColor }}>📍 {activePhase} PHASE ACTIVE</h4>
                            <p style={{ margin: 0, fontSize: '0.95rem', color: '#ccc', lineHeight: '1.5' }}>
                                {activePhase === 'FETCH' && "The Program Counter (PC) address flows to the MAR. The MAR retrieves data from RAM, routing the raw binary instruction into the IR."}
                                {activePhase === 'DECODE' && "The Instruction Register (IR) feeds the binary code to the Control Unit, which activates the necessary electrical paths."}
                                {activePhase === 'EXECUTE' && "The Control Unit fires execution signals to the ALU, processing logic and outputting the final results to the Registers."}
                            </p>
                        </div>

                        {/* Right Side: Optional Animated Quiz */}
                        <div className={answeredPhaseObj === undefined ? "quiz-panel" : ""} style={{ flex: '1 1 300px', backgroundColor: '#161b22', padding: '20px', borderRadius: '8px', border: `1px solid ${answeredPhaseObj ? '#333' : currentColor}` }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '0.95rem' }}>⚡ Optional Knowledge Check</h4>
                            <p style={{ margin: '0 0 15px 0', color: '#aaa', fontSize: '0.85rem' }}>{currentQuiz.question}</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {currentQuiz.options.map((opt, idx) => {
                                    const isSelected = answeredPhaseObj?.choice === idx;
                                    const isCorrect = idx === currentQuiz.correct;
                                    
                                    let btnBg = '#1b1f24', btnBorder = '#333';
                                    if (answeredPhaseObj !== undefined) {
                                        if (isSelected) { btnBg = isCorrect ? '#1b3a20' : '#3a1b1b'; btnBorder = isCorrect ? '#4caf50' : '#f44336'; } 
                                        else if (isCorrect) { btnBorder = '#4caf50'; }
                                    }
                                    return (
                                        <button key={idx} onClick={() => handleAnswer(idx)} disabled={answeredPhaseObj !== undefined} style={{ padding: '8px 12px', textAlign: 'left', backgroundColor: btnBg, border: `1px solid ${btnBorder}`, color: '#fff', borderRadius: '4px', cursor: answeredPhaseObj === undefined ? 'pointer' : 'default', transition: 'all 0.2s', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                                            <span>{opt}</span>{answeredPhaseObj !== undefined && isSelected && (<span>{isCorrect ? '✅' : '❌'}</span>)}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Quiz Feedback */}
                            {answeredPhaseObj !== undefined && (
                                <p style={{ margin: '15px 0 0 0', color: answeredPhaseObj.correct ? '#4caf50' : '#f44336', fontSize: '0.85rem', lineHeight: '1.4' }}>
                                    {currentQuiz.explanation}
                                </p>
                            )}
                        </div>

                    </div>
                )}

                {/* THE FULL CYCLE SIMULATION (THE CLOCK TICKS) */}
                {activePhase === 'SIMULATION' && (
                    <div style={{ backgroundColor: '#1b2333', padding: '20px', borderRadius: '8px', borderLeft: `4px solid ${currentColor}` }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #334', paddingBottom: '15px', marginBottom: '15px' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', color: currentColor, textTransform: 'uppercase' }}>⏱️ System Clock Active</h4>
                                <span style={{ color: '#aaa', fontSize: '0.85rem' }}>Tick {simStep + 1} of {CLOCK_STEPS.length}</span>
                            </div>
                            <span style={{ backgroundColor: '#0d1117', padding: '5px 12px', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid #445', color: currentColor }}>
                                STATUS: {currentRenderData.phaseName}
                            </span>
                        </div>

                        {/* COMPONENT THOUGHTS CONSOLE */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                            {currentRenderData.thoughts.map((thought, idx) => (
                                <div key={idx} style={{ backgroundColor: '#0d1117', padding: '12px', borderRadius: '6px', borderLeft: `2px solid ${currentColor}`, fontFamily: 'monospace', fontSize: '0.9rem' }}>
                                    <strong style={{ color: currentColor, display: 'inline-block', width: '110px' }}>{thought.comp}:</strong> 
                                    <span style={{ color: '#ccc' }}> "{thought.text}"</span>
                                </div>
                            ))}
                        </div>

                        {/* CLOCK NAVIGATION BUTTONS */}
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={() => handleTick('prev')} disabled={simStep === 0} style={{ flex: 1, padding: '12px', backgroundColor: simStep === 0 ? '#1b1f24' : '#2a2f3a', color: simStep === 0 ? '#555' : '#fff', border: 'none', borderRadius: '6px', cursor: simStep === 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                ◀ Previous Tick
                            </button>
                            <button onClick={() => handleTick('next')} disabled={simStep === CLOCK_STEPS.length - 1} style={{ flex: 1, padding: '12px', backgroundColor: simStep === CLOCK_STEPS.length - 1 ? '#1b1f24' : currentColor, color: simStep === CLOCK_STEPS.length - 1 ? '#555' : '#000', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: simStep === CLOCK_STEPS.length - 1 ? 'not-allowed' : 'pointer', fontSize: '1rem', transition: 'all 0.2s' }}>
                                Next Tick ⏱️ ➡️
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* THE "ZOOM IN" INSPECTOR MODAL */}
            {inspectedNode && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', borderRadius: '12px' }}>
                    <div style={{ backgroundColor: '#0d1117', border: `2px solid #aaa`, padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%', boxShadow: `0 0 30px rgba(255,255,255,0.1)`, position: 'relative' }}>
                        <button onClick={() => setInspectedNode(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
                        <h2 style={{ margin: '0 0 5px 0', color: '#fff' }}>🔎 {NODES[inspectedNode].title}</h2>
                        <span style={{ color: '#888', fontSize: '0.9rem', display: 'block', marginBottom: '15px' }}>{NODES[inspectedNode].sub}</span>
                        <p style={{ color: '#aaa', lineHeight: '1.5', margin: 0 }}>{NODES[inspectedNode].desc}</p>
                    </div>
                </div>
            )}
        </div>
    );
}