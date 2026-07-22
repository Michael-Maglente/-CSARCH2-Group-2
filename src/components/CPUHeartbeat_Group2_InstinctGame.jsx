import React, { useState, useRef, useEffect } from 'react';
import tronTrackUrl from '../assets/The Son of Flynn.mp3';

const ROUNDS_DATA = {
    easy: {
        title: "> ACCESS_LOG: ROUND 1 (CLEAR ANALOGIES)",
        description: "Vector routing for human-scale logical blocks.",
        scenarios: [
            { id: "e1", situation: "A delivery driver picks up a specific sealed package from a designated warehouse storage bin.", correctAnswer: "FETCH" },
            { id: "e2", situation: "A spy uses a cipher sheet to translate a secret Morse code message into plain text instructions.", correctAnswer: "DECODE" },
            { id: "e3", situation: "A lumberjack swings an axe to physically chop down a marked tree trunk.", correctAnswer: "EXECUTE" }
        ]
    },
    medium: {
        title: "> ACCESS_LOG: ROUND 2 (AUTOMATED GATES)",
        description: "Abstract trace evaluation inside automated machinery arrays.",
        scenarios: [
            { id: "m1", situation: "A vending machine internal mechanism rolls a specific soda can out from the deep storage rack.", correctAnswer: "FETCH" },
            { id: "m2", situation: "A barcode scanner reads the black lines on a snack wrapper to figure out its item name and price.", correctAnswer: "DECODE" },
            { id: "m3", situation: "A cash register drawer pops open and the machine prints out a physical paper receipt.", correctAnswer: "EXECUTE" }
        ]
    },
    hard: {
        title: "> ACCESS_LOG: ROUND 3 (SYSTEM ARCHITECTURE)",
        description: "Deep mainframe logistics coordination matrix.",
        scenarios: [
            { id: "h1", situation: "A robotic warehouse crane retrieves a heavy pallet based entirely on raw grid coordinate data.", correctAnswer: "FETCH" },
            { id: "h2", situation: "An air traffic controller reads a complex radar flight matrix to deduce if a plane is cleared to land.", correctAnswer: "DECODE" },
            { id: "h3", situation: "A heavy hydraulic factory press slams down, stamping a flat sheet of metal into a finished car door.", correctAnswer: "EXECUTE" }
        ]
    }
};

const STAGES = ['FETCH', 'DECODE', 'EXECUTE'];
const ROUND_ORDER = ['easy', 'medium', 'hard'];

export default function InstinctGame({ onGridActive, triggerTrackDirectly }) {
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); 
    const [isRoundSubmitted, setIsRoundSubmitted] = useState(false);
    const [cumulativeScore, setCumulativeScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const [isAmbientPlaying, setIsAmbientPlaying] = useState(false);
    const audioRef = useRef(null);

    // Auto-engage Daft Punk tracking if parent commands entry handshake
    useEffect(() => {
        if (triggerTrackDirectly) {
            engageAudioStream();
        }
    }, [triggerTrackDirectly]);

    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    const engageAudioStream = () => {
        try {
            if (!audioRef.current) {
                const audio = new Audio(tronTrackUrl);
                audio.loop = true;
                audio.volume = 0.25;
                audioRef.current = audio;
            }
            audioRef.current.play().then(() => setIsAmbientPlaying(true)).catch(() => {});
        } catch(e){}
    };

    const toggleAmbientMusic = () => {
        if (!audioRef.current) engageAudioStream();
        const track = audioRef.current;
        if (!track) return;

        if (isAmbientPlaying) {
            track.pause();
            setIsAmbientPlaying(false);
        } else {
            track.play().then(() => setIsAmbientPlaying(true)).catch(() => {});
        }
    };

    const currentRoundKey = ROUND_ORDER[currentRoundIndex];
    const currentRound = ROUNDS_DATA[currentRoundKey];

    const handleDragStart = (e, stageText) => {
        e.dataTransfer.setData("draggedStage", stageText);
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleDrop = (e, scenarioId) => {
        e.preventDefault();
        const droppedStage = e.dataTransfer.getData("draggedStage");
        setUserAnswers({ ...userAnswers, [scenarioId]: droppedStage });
    };

    const handleSubmitRound = () => {
        let roundPoints = 0;
        currentRound.scenarios.forEach(s => {
            if (userAnswers[s.id] === s.correctAnswer) roundPoints += 1;
        });
        setCumulativeScore(cumulativeScore + roundPoints);
        setIsRoundSubmitted(true);
    };

    const handleNextRound = () => {
        if (currentRoundIndex < ROUND_ORDER.length - 1) {
            setCurrentRoundIndex(currentRoundIndex + 1);
            setUserAnswers({});
            setIsRoundSubmitted(false);
        } else {
            setGameCompleted(true);
        }
    };

    const handleResetGame = () => {
        setCurrentRoundIndex(0);
        setUserAnswers({});
        setIsRoundSubmitted(false);
        setCumulativeScore(0);
        setGameCompleted(false);
    };

    const allFilled = currentRound.scenarios.every(s => userAnswers[s.id]);

    return (
        <div style={{
            border: '1px solid #004d66', 
            padding: '25px', 
            borderRadius: '4px', 
            backgroundColor: '#05080c',
            color: '#c0f3ff',
            maxWidth: '750px',
            margin: '20px auto',
            fontFamily: '"JetBrains Mono", "Courier New", monospace', // Explicit global override
            boxShadow: '0 0 20px rgba(0, 186, 250, 0.05)'
        }}>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '15px' }}>
                <button 
                    onClick={toggleAmbientMusic}
                    style={{
                        background: isAmbientPlaying ? 'rgba(0, 186, 250, 0.1)' : 'transparent',
                        border: `1px solid ${isAmbientPlaying ? '#00bafa' : '#004d66'}`,
                        borderRadius: '2px',
                        color: isAmbientPlaying ? '#00bafa' : '#537a85',
                        padding: '5px 12px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontFamily: '"JetBrains Mono", "Courier New", monospace' // Explicit override
                    }}
                >
                    {isAmbientPlaying ? "[🎛️ CORES LINKED: SON OF FLYNN]" : "[🔇 STREAM IDLE]"}
                </button>
            </div>

            {!gameCompleted ? (
                <div>
                    {/* HARD-FORCED FONTS ON THE HEADER SECTION */}
                    <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                        <h3 style={{ 
                            color: '#00bafa', 
                            margin: '0 0 4px 0', 
                            fontSize: '1.4rem',
                            fontFamily: '"JetBrains Mono", "Courier New", monospace', /* FORCE OVERRIDE */
                            textTransform: 'uppercase'
                        }}>
                            {currentRound.title}
                        </h3>
                        <p style={{ 
                            color: '#537a85', 
                            fontSize: '0.85rem', 
                            margin: 0,
                            fontFamily: '"JetBrains Mono", "Courier New", monospace' /* FORCE OVERRIDE */
                        }}>
                            {currentRound.description}
                        </p>
                    </div>

                    {/* DRAG TARGET OPTIONS */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '30px' }}>
                        {STAGES.map((stage) => (
                            <div 
                                key={stage}
                                draggable={!isRoundSubmitted} 
                                onDragStart={(e) => handleDragStart(e, stage)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: isRoundSubmitted ? '#020204' : '#004d66',
                                    color: isRoundSubmitted ? '#537a85' : '#c0f3ff',
                                    border: `1px solid ${isRoundSubmitted ? '#112233' : '#00bafa'}`,
                                    borderRadius: '2px',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    cursor: isRoundSubmitted ? 'default' : 'grab',
                                    userSelect: 'none',
                                    fontFamily: '"JetBrains Mono", "Courier New", monospace' // Explicit override
                                }}
                            >
                                [{stage}]
                            </div>
                        ))}
                    </div>

                    {/* SLOTS AREA */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {currentRound.scenarios.map((scenario) => {
                            const answer = userAnswers[scenario.id];
                            const isCorrect = answer === scenario.correctAnswer;

                            return (
                                <div key={scenario.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#020204', padding: '15px', border: '1px solid #004d66', borderRadius: '2px' }}>
                                    <div style={{ flex: 1, color: '#c0f3ff', fontSize: '0.85rem', lineHeight: '1.5', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                                        {`> "${scenario.situation}"`}
                                    </div>

                                    <div 
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => !isRoundSubmitted && handleDrop(e, scenario.id)}
                                        style={{
                                            width: '130px',
                                            height: '40px',
                                            border: answer ? '1px solid #00bafa' : '1px dashed #537a85',
                                            backgroundColor: answer ? 'rgba(0, 186, 250, 0.05)' : 'transparent',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'bold',
                                            color: answer ? '#00bafa' : '#537a85',
                                            fontSize: '0.8rem',
                                            fontFamily: '"JetBrains Mono", "Courier New", monospace' // Explicit override
                                        }}
                                    >
                                        {answer ? answer : "READY FOR DROP"}
                                    </div>

                                    {isRoundSubmitted && (
                                        <div style={{ width: '30px', textAlign: 'center', color: isCorrect ? '#00bafa' : '#fe006f', fontWeight: 'bold', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                                            {isCorrect ? '✔' : '✘'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div style={{ textAlign: 'center', marginTop: '35px' }}>
                        {!isRoundSubmitted ? (
                            <button 
                                onClick={handleSubmitRound}
                                disabled={!allFilled}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: allFilled ? 'transparent' : '#020204',
                                    color: allFilled ? '#fe006f' : '#537a85',
                                    border: `1px solid ${allFilled ? '#fe006f' : '#112233'}`,
                                    cursor: allFilled ? 'pointer' : 'not-allowed',
                                    fontFamily: '"JetBrains Mono", "Courier New", monospace', // Explicit override
                                    fontSize: '0.9rem'
                                }}
                            >
                                COMMIT_ANSWERS_TO_BUS
                            </button>
                        ) : (
                            <button 
                                onClick={handleNextRound}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: 'transparent',
                                    color: '#00bafa',
                                    border: '1px solid #00bafa',
                                    cursor: 'pointer',
                                    fontFamily: '"JetBrains Mono", "Courier New", monospace', // Explicit override
                                    fontSize: '0.9rem'
                                }}
                            >
                                {currentRoundIndex === ROUND_ORDER.length - 1 ? "LOAD FINAL SUMMARY" : "ADVANCE CYCLE SYSTEM →"}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h3 style={{ color: '#febe0b', fontSize: '1.8rem', margin: '0 0 10px 0', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                        ⚡ GRID COMPILATION SUCCESSFUL
                    </h3>
                    <p style={{ color: '#537a85', marginBottom: '35px', fontSize: '0.85rem', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                        All instructional streams evaluated through the mainframe pipeline.
                    </p>
                    
                    <div style={{ background: '#020204', display: 'inline-block', padding: '20px 40px', border: '1px solid #004d66', marginBottom: '35px' }}>
                        <p style={{ margin: '0 0 5px 0', textTransform: 'uppercase', color: '#00bafa', fontSize: '0.75rem', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                            INTEGRITY SCORE VERDICT
                        </p>
                        <h2 style={{ fontSize: '3rem', margin: 0, color: cumulativeScore >= 7 ? '#00bafa' : '#fe006f', fontFamily: '"JetBrains Mono", "Courier New", monospace' }}>
                            {cumulativeScore} / 9
                        </h2>
                    </div>

                    <div>
                        <button 
                            onClick={handleResetGame}
                            style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#c0f3ff', border: '1px solid #004d66', cursor: 'pointer', fontFamily: '"JetBrains Mono", "Courier New", monospace', fontSize: '0.85rem' }}
                        >
                            [RESET SYSTEM REGISTERS]
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}