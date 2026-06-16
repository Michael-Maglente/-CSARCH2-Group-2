import React, { useState } from 'react';

export default function FdeDiagram() {
    const [activePhase, setActivePhase] = useState('NONE');
    const [inspectedNode, setInspectedNode] = useState(null);

    // 1. Neon Cyberpunk Colors
    const COLORS = {
        FETCH: '#00f0ff',
        DECODE: '#bc52ee',
        EXECUTE: '#ff3366',
        NONE: '#2a2f3a'
    };

    const activeColor = COLORS[activePhase];

    // 2. Upgraded Node Data (Includes Deep-Dive HUD info)
    const NODES = {
        PC: { 
            top: '10%', left: '10%', title: 'PC', sub: 'Program Counter',
            desc: 'Holds the memory address of the next instruction. Once fetched, the PC increments automatically.',
            liveData: { NONE: '0x0000', FETCH: '0x00A4 ➡️ 0x00A5 (Incrementing)', DECODE: '0x00A5 (Idle)', EXECUTE: '0x00A5 (Idle)' }
        },
        MAR: { 
            top: '40%', left: '10%', title: 'MAR', sub: 'Memory Address Register',
            desc: 'Holds the exact memory address that the CPU is currently accessing in Main Memory.',
            liveData: { NONE: '0x0000', FETCH: 'Loading Address: 0x00A4', DECODE: '0x00A4', EXECUTE: '0x00A4' }
        },
        RAM: { 
            top: '70%', left: '10%', title: 'RAM', sub: 'Main Memory',
            desc: 'External storage containing instructions and variables. Responds to the MAR address.',
            liveData: { NONE: 'Awaiting Address...', FETCH: 'Found 0x00A4 -> Outputting Data', DECODE: 'Idle', EXECUTE: 'Idle' }
        },
        IR: { 
            top: '70%', left: '40%', title: 'IR', sub: 'Instruction Register',
            desc: 'Holds the actual instruction just pulled from RAM so the Control Unit can interpret it.',
            liveData: { NONE: '00000000', FETCH: 'Receiving Data...', DECODE: 'Holding Opcode: 10110010 (LOAD)', EXECUTE: '10110010' }
        },
        CU: { 
            top: '40%', left: '40%', title: 'Control Unit', sub: 'Decoder & Sequencer',
            desc: 'The brain of the CPU. Translates the binary instruction and fires signals to other components.',
            liveData: { NONE: 'Idle', FETCH: 'Idle', DECODE: 'Translating 10110010 -> Route to ALU', EXECUTE: 'Firing Control Signals ⚡' }
        },
        ALU: { 
            top: '40%', left: '70%', title: 'ALU', sub: 'Arithmetic Logic Unit',
            desc: 'The heavy lifter. Performs mathematical calculations and logical comparisons.',
            liveData: { NONE: '0', FETCH: '0', DECODE: 'Waking Up...', EXECUTE: 'Calculating: 5 + 10 = 15' }
        },
        REG: { 
            top: '70%', left: '70%', title: 'Registers', sub: 'General Purpose',
            desc: 'Ultra-fast, temporary storage spots right next to the ALU to hold immediate results.',
            liveData: { NONE: 'R1: 0, R2: 0', FETCH: 'R1: 0, R2: 0', DECODE: 'R1: 5, R2: 10', EXECUTE: 'Updating R3 -> 15' }
        }
    };

    // 3. Mapping lines, active boxes, AND floating data packets!
    const STAGES = {
        FETCH: { 
            nodes: ['PC', 'MAR', 'RAM', 'IR'], 
            lines: [
                { x1: '20%', y1: '25%', x2: '20%', y2: '37%' }, 
                { x1: '20%', y1: '55%', x2: '20%', y2: '67%' }, 
                { x1: '30%', y1: '77.5%', x2: '37%', y2: '77.5%' }
            ],
            packets: [
                { top: '30%', left: '22%', text: 'Addr: 0x00A4' },
                { top: '60%', left: '22%', text: 'Addr: 0x00A4' },
                { top: '73%', left: '31%', text: 'Data: 10110010' }
            ]
        },
        DECODE: { 
            nodes: ['IR', 'CU'], 
            lines: [
                { x1: '50%', y1: '70%', x2: '50%', y2: '58%' }
            ],
            packets: [
                { top: '63%', left: '52%', text: 'Opcode: 10110010' }
            ]
        },
        EXECUTE: { 
            nodes: ['CU', 'ALU', 'REG'], 
            lines: [
                { x1: '60%', y1: '47.5%', x2: '67%', y2: '47.5%' }, 
                { x1: '80%', y1: '55%', x2: '80%', y2: '67%' }
            ],
            packets: [
                { top: '43%', left: '61%', text: 'Signal: ADD' },
                { top: '60%', left: '82%', text: 'Result: 15' }
            ]
        },
        NONE: { nodes: [], lines: [], packets: [] }
    };

    const { nodes, lines, packets } = STAGES[activePhase];

    return (
        <div style={{ backgroundColor: '#0b0f19', padding: '25px', borderRadius: '12px', color: '#fff', border: '1px solid #1f2430', maxWidth: '850px', margin: '30px auto', fontFamily: 'sans-serif', position: 'relative' }}>
            
            {/* CSS ANIMATIONS */}
            <style>
                {`
                    @keyframes dataFlow { from { stroke-dashoffset: 24; } to { stroke-dashoffset: 0; } }
                    @keyframes packetPulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
                    .animated-data-line { stroke-dasharray: 8 6; animation: dataFlow 0.5s linear infinite; }
                    .hover-node { transition: all 0.2s ease; cursor: pointer; }
                    .hover-node:hover { transform: scale(1.05); filter: brightness(1.3); z-index: 10 !important; }
                    .data-packet { animation: packetPulse 1.5s infinite ease-in-out; }
                `}
            </style>

            <h3 style={{ textAlign: 'center', color: '#fff', marginTop: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>
                Interactive CPU Block Diagram
            </h3>
            
            {/* CONTROLLER BUTTONS */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                {['FETCH', 'DECODE', 'EXECUTE'].map((phase) => (
                    <button 
                        key={phase} onClick={() => setActivePhase(phase)} 
                        style={{ padding: '10px 24px', fontWeight: 'bold', borderRadius: '8px', border: `2px solid ${COLORS[phase]}`, background: activePhase === phase ? COLORS[phase] : 'transparent', color: activePhase === phase ? '#000' : COLORS[phase], cursor: 'pointer', boxShadow: activePhase === phase ? `0 0 15px ${COLORS[phase]}` : 'none', transition: 'all 0.2s ease', textTransform: 'uppercase' }}
                    >
                        {phase}
                    </button>
                ))}
                <button onClick={() => setActivePhase('NONE')} style={{ padding: '10px 24px', borderRadius: '8px', border: '1px solid #555', background: 'transparent', color: '#aaa', cursor: 'pointer' }}>CLEAR</button>
            </div>

            {/* DIAGRAM GRID */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/10', backgroundColor: '#05070a', borderRadius: '8px', border: '1px solid #1f2430', overflow: 'hidden', backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '4% 6%' }}>
                
                {/* SVG ARROWS */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                    <defs>
                        <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><polygon points="0 0, 6 3, 0 6" fill={activeColor} /></marker>
                    </defs>
                    {lines.map((line, idx) => <line key={idx} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={activeColor} strokeWidth="3" className="animated-data-line" markerEnd="url(#arrowhead)" />)}
                </svg>

                {/* HTML NODES */}
                {Object.keys(NODES).map((key) => {
                    const node = NODES[key];
                    const isActive = nodes.includes(key);

                    return (
                        <div 
                            key={key}
                            className="hover-node"
                            onClick={() => setInspectedNode(key)}
                            style={{ position: 'absolute', top: node.top, left: node.left, width: '20%', height: '15%', backgroundColor: '#0d1117', border: `2px solid ${isActive ? activeColor : '#2a2f3a'}`, borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: isActive ? `0 0 20px ${activeColor}40, inset 0 0 10px ${activeColor}20` : 'none', zIndex: 2, textAlign: 'center', padding: '5px' }}
                        >
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: isActive ? '#fff' : '#888', textShadow: isActive ? `0 0 5px ${activeColor}` : 'none' }}>{node.title}</span>
                            <span style={{ fontSize: '0.65rem', color: isActive ? '#ccc' : '#555', marginTop: '4px' }}>{node.sub}</span>
                        </div>
                    );
                })}

                {/* THE NEW FLOATING DATA PACKETS */}
                {packets.map((packet, idx) => (
                    <div 
                        key={`packet-${idx}`}
                        className="data-packet"
                        style={{
                            position: 'absolute',
                            top: packet.top,
                            left: packet.left,
                            backgroundColor: '#0d1117',
                            border: `1px solid ${activeColor}`,
                            color: '#fff',
                            padding: '4px 8px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            boxShadow: `0 0 10px ${activeColor}80`,
                            zIndex: 3,
                            fontFamily: 'monospace',
                            pointerEvents: 'none' // Ensures they don't block clicks
                        }}
                    >
                        {packet.text}
                    </div>
                ))}
            </div>

            {/* THE "ZOOM IN" INSPECTOR MODAL */}
            {inspectedNode && (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', borderRadius: '12px' }}>
                    <div style={{ backgroundColor: '#0d1117', border: `2px solid ${COLORS[activePhase] === '#2a2f3a' ? '#555' : COLORS[activePhase]}`, padding: '30px', borderRadius: '12px', maxWidth: '500px', width: '90%', boxShadow: `0 0 30px ${COLORS[activePhase] === '#2a2f3a' ? '#000' : COLORS[activePhase]}40`, position: 'relative' }}>
                        
                        <button onClick={() => setInspectedNode(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: '#888', fontSize: '1.2rem', cursor: 'pointer' }}>✖</button>
                        
                        <h2 style={{ margin: '0 0 5px 0', color: '#fff' }}>🔎 {NODES[inspectedNode].title} <span style={{ color: '#888', fontSize: '1rem', fontWeight: 'normal' }}>| {NODES[inspectedNode].sub}</span></h2>
                        <p style={{ color: '#aaa', lineHeight: '1.5', marginBottom: '20px' }}>{NODES[inspectedNode].desc}</p>
                        
                        <div style={{ backgroundColor: '#05070a', border: '1px solid #1f2430', padding: '15px', borderRadius: '8px', fontFamily: 'monospace' }}>
                            <span style={{ color: '#555', textTransform: 'uppercase', fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>Live Phase Data ({activePhase}):</span>
                            <span style={{ color: COLORS[activePhase] === '#2a2f3a' ? '#888' : COLORS[activePhase], fontSize: '1.1rem', fontWeight: 'bold' }}>
                                &gt; {NODES[inspectedNode].liveData[activePhase]}
                            </span>
                        </div>
                        
                    </div>
                </div>
            )}
        </div>
    );
}