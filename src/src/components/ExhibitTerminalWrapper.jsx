import React, { useState, useRef, useEffect } from 'react';
import InstinctGame from './InstinctGame.jsx';
import FdeDiagram from './FdeDiagram.jsx';
import CulminatingActivity from './CulminatingActivity.jsx';
import FdeTheoryRoom from './FdeTheoryRoom.jsx';

// Import the pre-rendered movie-accurate warp audio file
import warpSoundUrl from '../assets/warpsound.mp3';

const INITIAL_LINES = [
    { text: "[!] ENCOM OS v2.1.13 - LAB TERMINAL SYSTEM", color: "#febe0b" },
    { text: "> L3_SYSTEM_ENGINES: ACTIVE", color: "#537a85" },
    { text: "> RUNNING_TARGET: FETCH_DECODE_EXECUTE_CYCLE", color: "#537a85" },
    { text: "> WARNING: USER DETECTED.", color: "#fa0000" },
    { text: "PROCEED AND INTERCONNECT WITH THE GRID? (TYPE 'YES' OR 'NO')", color: "#c0f3ff" }
];

export default function ExhibitTerminalWrapper() {
    // STATES: STANDBY (Click to wake), TYPING (Animating), IDLE (Waiting for input), BOOTING, ONLINE
    const [gridStatus, setGridStatus] = useState('STANDBY'); 
    
    // CLI State
    const [inputValue, setInputValue] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    
    const inputRef = useRef(null);
    const audioCtxRef = useRef(null);

    // Auto-focus input when animation finishes
    useEffect(() => {
        if (gridStatus === 'IDLE' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [gridStatus]);

    // --- AUDIO: MUTED MORSE CODE TYPING ---
    const playKeystroke = () => {
        try {
            if (!audioCtxRef.current) return;
            const ctx = audioCtxRef.current;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine'; 
            osc.frequency.setValueAtTime(750, ctx.currentTime); 
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.01);
            gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {}
    };

    // --- AUDIO: LOAD AND PLAY MOVIE MP3 VIA WEB AUDIO API ---
    const playWarpSound = async () => {
        try {
            const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)();
            
            // Fetch and decode the custom asset audio stream
            const response = await fetch(warpSoundUrl);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
            
            // Create buffer source node
            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            
            // Attach gain node for optional safety limits
            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(1.0, ctx.currentTime);
            
            source.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            source.start(ctx.currentTime);
        } catch (e) {
            console.error("Failed to load or play warp asset file:", e);
        }
    };

    // --- ANIMATION: LINE-BY-LINE TYPEWRITER ---
    const startTypingSequence = async () => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioCtxRef.current = new AudioContext();
            if (audioCtxRef.current.state === 'suspended') {
                await audioCtxRef.current.resume();
            }
        } catch (e) {}

        setGridStatus('TYPING');
        setTerminalHistory([]);

        let currentHistory = [];

        for (let i = 0; i < INITIAL_LINES.length; i++) {
            const line = INITIAL_LINES[i];
            currentHistory.push({ text: '', color: line.color });
            setTerminalHistory([...currentHistory]);

            for (let j = 0; j < line.text.length; j++) {
                currentHistory[currentHistory.length - 1].text += line.text[j];
                setTerminalHistory([...currentHistory]);
                
                playKeystroke();
                await new Promise(r => setTimeout(r, 5 + Math.random() * 15)); 
            }
            await new Promise(r => setTimeout(r, 150)); 
        }

        setGridStatus('IDLE');
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        const cmd = inputValue.trim().toLowerCase();
        
        const newHistory = [...terminalHistory, { text: `flynn@mcp:~$ ${inputValue}`, color: "#f0fafa" }];

        if (cmd === 'yes' || cmd === 'y') {
            newHistory.push({ text: "ACCESS GRANTED. INITIATING LASER SEQUENCE...", color: "#00bafa" });
            setTerminalHistory(newHistory);
            setInputValue('');
            
            playWarpSound();
            
            // Delays visual swap to align nicely right when the asset audio hits its peak impact state
            setTimeout(() => {
                setGridStatus('BOOTING');
                setTimeout(() => {
                    setGridStatus('ONLINE');
                }, 1500);
            }, 1800); 
            
        } else if (cmd === 'no' || cmd === 'n') {
            newHistory.push({ text: "CONNECTION REJECTED. TERMINAL IDLE.", color: "#fe006f" });
            newHistory.push({ text: "PROCEED AND INTERCONNECT WITH THE GRID? (TYPE 'YES' OR 'NO')", color: "#c0f3ff" });
            setTerminalHistory(newHistory);
            setInputValue('');
        } else {
            newHistory.push({ text: `ERROR: UNRECOGNIZED COMMAND '${cmd}'`, color: "#fe006f" });
            newHistory.push({ text: "PROCEED AND INTERCONNECT WITH THE GRID? (TYPE 'YES' OR 'NO')", color: "#c0f3ff" });
            setTerminalHistory(newHistory);
            setInputValue('');
        }
    };

    // 1. STANDBY GATEWAY
    if (gridStatus === 'STANDBY') {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#0a0c0D', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
                <div 
                    onClick={startTypingSequence}
                    style={{ background: '#020204', border: '2px solid #004d66', padding: '30px', width: '100%', maxWidth: '800px', minHeight: '400px', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '1rem', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,186,250,0.1)', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                    <div style={{ color: '#537a85', animation: 'blink 1.2s step-end infinite' }}>
                        &gt; SYSTEM STANDBY. CLICK TERMINAL TO WAKE...
                    </div>
                </div>
                <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
            </div>
        );
    }

    // 2. TYPING / IDLE INTERACTIVE TERMINAL
    if (gridStatus === 'TYPING' || gridStatus === 'IDLE') {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#0a0c0D', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, padding: '20px', boxSizing: 'border-box' }}>
                <div 
                    onClick={() => { if (gridStatus === 'IDLE' && inputRef.current) inputRef.current.focus(); }}
                    style={{ background: '#020204', border: '2px solid #004d66', padding: '30px', width: '100%', maxWidth: '800px', minHeight: '400px', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '1rem', borderRadius: '4px', boxShadow: '0 0 20px rgba(0,186,250,0.1)', cursor: gridStatus === 'IDLE' ? 'text' : 'default', display: 'flex', flexDirection: 'column' }}
                >
                    {terminalHistory.map((line, idx) => (
                        <div key={idx} style={{ color: line.color, marginBottom: '8px', lineHeight: '1.4' }}>
                            {line.text}
                        </div>
                    ))}

                    {gridStatus === 'IDLE' && (
                        <form onSubmit={handleCommandSubmit} style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ color: '#febe0b', marginRight: '10px' }}>flynn@mcp:~$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                autoComplete="off"
                                spellCheck="false"
                                style={{ background: 'transparent', border: 'none', color: '#00bafa', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '1rem', outline: 'none', flex: 1, caretColor: '#00bafa' }}
                            />
                        </form>
                    )}
                </div>
            </div>
        );
    }

    // 3. GLITCHED TRANSITION MATRIX
    if (gridStatus === 'BOOTING') {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: '#020204', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 9999, fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                <h2 style={{ color: '#00bafa', margin: '0 0 20px 0', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.5rem', textAlign: 'center' }}>
                    &gt; INITIALIZING DIGITAL MOLECULAR DISASSEMBLY...
                </h2>
                <p style={{ color: '#febe0b', textAlign: 'center' }}>Loading Grid Matrix Vector Arrays...</p>
            </div>
        );
    }

    // 4. THE MAIN EXHIBIT CONTENT FLOW
    return (
        <div style={{ fontFamily: '"JetBrains Mono", "Courier New", monospace', marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '1000px', margin: '0 auto', padding: '0 20px', boxSizing: 'border-box' }}>
            
            <div style={{ width: '100%', borderBottom: '1px dashed #004d66', paddingBottom: '20px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.2rem' }}>flynn@mcp:~$</span>
                    <h1 style={{ color: '#00bafa', margin: 0, fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        ./execute_fde_core.sh
                    </h1>
                </div>
                <p style={{ color: '#c0f3ff', margin: '15px 0 0 0', lineHeight: '1.6' }}>
                    &gt; Welcome to the Grid mainframe. Before exploring the complex hardware routing registers inside processing systems, let's observe how strong your baseline architecture intuition is.
                </p>
            </div>

            <InstinctGame triggerTrackDirectly={true} />

            <hr style={{ border: 'none', height: '1px', background: 'repeating-linear-gradient(90deg, #004d66, #004d66 4px, transparent 4px, transparent 8px)', margin: '50px 0', width: '100%' }} />

            {/* TASK 1: THE CTF THEORY ROOM */}
            <div style={{ width: '100%', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <span style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.1rem' }}>flynn@mcp:~/phase_1$</span>
                    <h2 style={{ color: '#00bafa', margin: 0, fontSize: '1.2rem' }}>./read_briefing.sh</h2>
                </div>
                <p style={{ color: '#c0f3ff', margin: 0, lineHeight: '1.6', marginBottom: '20px' }}>
                    &gt; Hardware logic requires precision. Review the architecture briefing below and submit the correct system flags to proceed.
                </p>
                <FdeTheoryRoom />
            </div>

            <hr style={{ border: 'none', height: '1px', background: 'repeating-linear-gradient(90deg, #004d66, #004d66 4px, transparent 4px, transparent 8px)', margin: '50px 0', width: '100%' }} />

            {/* PHASE 0: INTERACTIVE HARWARE ROUTING */}
            <div style={{ width: '100%', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <span style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.1rem' }}>flynn@mcp:~/phase_0$</span>
                    <h2 style={{ color: '#00bafa', margin: 0, fontSize: '1.2rem' }}>cat intuition_check.log</h2>
                </div>
                <p style={{ color: '#c0f3ff', margin: 0, lineHeight: '1.6', marginBottom: '20px' }}>
                    &gt; Now that you've aligned the real-world operational cycles, analyze how custom logic gates process these streams. Select the stages below to track trace currents through the hardware buses.
                </p>
                <FdeDiagram />
            </div>

            <hr style={{ border: 'none', height: '1px', background: 'repeating-linear-gradient(90deg, #004d66, #004d66 4px, transparent 4px, transparent 8px)', margin: '50px 0', width: '100%' }} />

            {/* PHASE 2: CULMINATING SYSTEM CONFIGURATION */}
            <div style={{ width: '100%', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
                    <span style={{ color: '#febe0b', fontWeight: 'bold', fontSize: '1.1rem' }}>flynn@mcp:~/phase_2$</span>
                    <h2 style={{ color: '#00bafa', margin: 0, fontSize: '1.2rem' }}>sudo ./culminating_challenge.exe</h2>
                </div>
                <p style={{ color: '#c0f3ff', margin: 0, lineHeight: '1.6' }}>
                    &gt; [AUTH REQUIRED] You have mapped out execution streams and clocked the register ticks. Now, demonstrate full system control by routing machine code blocks manually.
                </p>
            </div>
            
            <CulminatingActivity />
        </div>
    );
}