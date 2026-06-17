import React, { useState } from 'react';

// The missions bridge High-Level Code to Hardware Routing
const MISSIONS = [
    {
        instruction: "let score = 100;  // Variable Assignment",
        objective: "The game just started! The CPU needs to fetch this line of code, understand it, and save the number '100' into its temporary workspace.",
        steps: [
            { target: "PC_TO_MAR", hint: "You need to find where the code lives first. Route the Program Counter (PC) to the Address Register (MAR)." },
            { target: "RAM_TO_IR", hint: "Now that you have the address, pull the actual instruction out of Main Memory (RAM) and into the Instruction Register (IR)." },
            { target: "IR_TO_CU", hint: "The CPU needs to understand what 'let score = 100' means. Send it to the Control Unit (CU) to decode." },
            { target: "RAM_TO_REG", hint: "The CU realizes it's saving a number! Route the value '100' from RAM into the CPU's Registers." }
        ]
    },
    {
        instruction: "score = score + 50;  // Math Operation",
        objective: "The player just collected a coin! The CPU needs to fetch this code, bring the current score to the calculator, add 50, and save it.",
        steps: [
            { target: "PC_TO_MAR", hint: "Find the next line of code by sending the Program Counter (PC) address to the MAR." },
            { target: "RAM_TO_IR", hint: "Load the addition command from RAM into the Instruction Register (IR)." },
            { target: "IR_TO_CU", hint: "Send the command to the Control Unit (CU) so it can prepare the calculator." },
            { target: "REG_TO_ALU", hint: "Send the current score and the number 50 from the Registers into the ALU to be added together." },
            { target: "ALU_TO_REG", hint: "Route the final calculated sum from the ALU back into the Registers to update the score." }
        ]
    }
];

export default function CulminatingActivity() {
    const [currentMissionIdx, setCurrentMissionIdx] = useState(0);
    const [stepIdx, setStepIdx] = useState(0);
    const [errorGlitch, setErrorGlitch] = useState(false);
    const [successWave, setSuccessWave] = useState(false);
    const [showHint, setShowHint] = useState(false); // New state for the hint bulb

    const mission = MISSIONS[currentMissionIdx];
    const currentStep = mission.steps[stepIdx];
    const isCompleted = stepIdx >= mission.steps.length;

    // Lightweight Synthesizer Sound Engine for feedback
    const playTone = (freq, type = 'sine', duration = 0.1) => {
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
        } catch (e) { console.log("Audio context not initialized"); }
    };

    const triggerBusConnection = (busId) => {
        if (isCompleted) return;

        if (busId === currentStep.target) {
            playTone(587.33, 'triangle', 0.15); // Confirm tone
            setShowHint(false); // Hide the hint for the next step!
            
            if (stepIdx + 1 >= mission.steps.length) {
                setSuccessWave(true);
                playTone(880, 'sine', 0.4); // Win tone
                setStepIdx(stepIdx + 1);
            } else {
                setStepIdx(stepIdx + 1);
            }
        } else {
            setErrorGlitch(true);
            playTone(150, 'sawtooth', 0.25); // Error buzzer
            setTimeout(() => setErrorGlitch(false), 400);
        }
    };

    const nextMission = () => {
        setSuccessWave(false);
        setStepIdx(0);
        setShowHint(false);
        setCurrentMissionIdx((currentMissionIdx + 1) % MISSIONS.length);
    };

    return (
        <div style={{ backgroundColor: '#070a14', padding: '30px', borderRadius: '16px', border: `2px solid ${successWave ? '#39ff14' : errorGlitch ? '#ff3366' : '#1a233a'}`, color: '#fff', fontFamily: 'sans-serif', position: 'relative', overflow: 'hidden', transition: 'all 0.2s ease' }}>
            
            <style>
                {`
                    @keyframes matrixGlitch {
                        0% { transform: translate(0); filter: hue-rotate(0deg); }
                        20% { transform: translate(-3px, 2px); filter: hue-rotate(90deg); }
                        40% { transform: translate(3px, -2px); }
                        60% { transform: translate(-2px, -2px); }
                        80% { transform: translate(2px, 2px); }
                        100% { transform: translate(0); filter: hue-rotate(0deg); }
                    }
                    .glitch-active { animation: matrixGlitch 0.2s infinite linear; border: 2px solid #ff3366 !important; }
                    .bus-line-btn { background: #0f172a; border: 1px solid #334155; color: #94a3b8; padding: 12px 16px; borderRadius: 8px; cursor: pointer; text-align: left; transition: all 0.2s; font-family: monospace; }
                    .bus-line-btn:hover { background: #1e293b; color: #f8fafc; border-color: #00f0ff; transform: translateY(-2px); }
                `}
            </style>

            <div className={errorGlitch ? "glitch-active" : ""}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #1e293b', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                        <span style={{ color: '#00f0ff', fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>⚙️ Mission {currentMissionIdx + 1}</span>
                        <h3 style={{ margin: '5px 0 0 0', fontSize: '1.4rem', color: '#fff', fontFamily: 'monospace' }}>Code: <span style={{ color: '#bc52ee' }}>{mission.instruction}</span></h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Routing Progress</span>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#39ff14' }}>{Math.min(stepIdx, mission.steps.length)} / {mission.steps.length} CONNECTIONS</div>
                    </div>
                </div>

                {/* OBJECTIVE */}
                <div style={{ background: '#0f172a', padding: '15px', borderRadius: '8px', borderLeft: '4px solid #00f0ff', marginBottom: '25px' }}>
                    <strong style={{ color: '#00f0ff', fontSize: '0.9rem', textTransform: 'uppercase' }}>The Goal:</strong>
                    <p style={{ margin: '5px 0 0 0', fontSize: '0.95rem', color: '#cbd5e1', lineHeight: '1.5' }}>{mission.objective}</p>
                </div>

                {!isCompleted ? (
                    <div>
                        {/* CONTROL PANEL HEADER WITH HINT BUTTON */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <h4 style={{ color: '#64748b', fontSize: '0.85rem', textTransform: 'uppercase', margin: 0 }}>Control Panel: Select the correct data pathway</h4>
                            <button 
                                onClick={() => setShowHint(!showHint)} 
                                style={{ 
                                    background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.4rem', 
                                    filter: showHint ? 'drop-shadow(0 0 8px #fbbf24)' : 'grayscale(100%) opacity(0.5)',
                                    transition: 'all 0.3s', padding: 0
                                }}
                                title="Need a hint?"
                            >
                                💡
                            </button>
                        </div>

                        {/* HINT DISPLAY */}
                        {showHint && (
                            <div style={{ background: '#451a03', padding: '12px 15px', borderRadius: '8px', border: '1px solid #f59e0b', marginBottom: '20px', color: '#fef3c7', fontSize: '0.95rem', animation: 'fadeIn 0.3s ease' }}>
                                <strong style={{ color: '#fbbf24' }}>Hint: </strong> {currentStep.hint}
                            </div>
                        )}

                        {/* INTERACTIVE BUS MATRIX */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("PC_TO_MAR")}>
                                <span style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'sans-serif' }}>📍 Find Address</span>
                                <span style={{ fontSize: '0.85rem' }}>🔌 Route: <span style={{ color: '#00f0ff' }}>PC ➔ MAR</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("RAM_TO_IR")}>
                                <span style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'sans-serif' }}>📥 Fetch Instruction</span>
                                <span style={{ fontSize: '0.85rem' }}>🔌 Route: <span style={{ color: '#00f0ff' }}>RAM ➔ IR</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("IR_TO_CU")}>
                                <span style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'sans-serif' }}>🧠 Decode Command</span>
                                <span style={{ fontSize: '0.85rem' }}>🔌 Route: <span style={{ color: '#bc52ee' }}>IR ➔ CU</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("RAM_TO_REG")}>
                                <span style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'sans-serif' }}>💾 Load Data</span>
                                <span style={{ fontSize: '0.85rem' }}>🔌 Route: <span style={{ color: '#ff3366' }}>RAM ➔ Registers</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("REG_TO_ALU")}>
                                <span style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'sans-serif' }}>🧮 Send to Calculator</span>
                                <span style={{ fontSize: '0.85rem' }}>🔌 Route: <span style={{ color: '#ff3366' }}>Registers ➔ ALU</span></span>
                            </button>
                            <button className="bus-line-btn" onClick={() => triggerBusConnection("ALU_TO_REG")}>
                                <span style={{ display: 'block', color: '#fff', fontWeight: 'bold', marginBottom: '6px', fontFamily: 'sans-serif' }}>📝 Save Result</span>
                                <span style={{ fontSize: '0.85rem' }}>🔌 Route: <span style={{ color: '#39ff14' }}>ALU ➔ Registers</span></span>
                            </button>
                        </div>
                    </div>
                ) : (
                    /* SUCCESS SCREEN */
                    <div style={{ textAlign: 'center', padding: '40px 20px', background: 'rgba(57, 255, 20, 0.05)', borderRadius: '10px', border: '1px dashed #39ff14' }}>
                        <h3 style={{ color: '#39ff14', fontSize: '1.6rem', margin: '0 0 15px 0' }}>🎉 EXECUTION SUCCESSFUL!</h3>
                        <p style={{ color: '#94a3b8', maxWidth: '550px', margin: '0 auto 25px auto', fontSize: '1rem', lineHeight: '1.6' }}>
                            You successfully took a high-level command and routed it through the physical hardware! This is exactly what your computer does billions of times per second.
                        </p>
                        <button onClick={nextMission} style={{ background: '#39ff14', color: '#000', padding: '14px 35px', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)', transition: 'transform 0.2s' }} onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
                            Load Next Mission ➡️
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}