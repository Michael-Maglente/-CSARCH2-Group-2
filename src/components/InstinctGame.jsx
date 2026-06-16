import React, { useState } from 'react';

// 1. Database of scenarios grouped by difficulty tier
const ROUNDS_DATA = {
    easy: {
        title: "🟢 Round 1: Clear Analogies (Easy)",
        description: "Straightforward human actions. Get your bearings!",
        scenarios: [
            { id: "e1", situation: "A delivery driver picks up a specific sealed package from a designated warehouse storage bin.", correctAnswer: "FETCH" },
            { id: "e2", situation: "A spy uses a cipher sheet to translate a secret Morse code message into plain text instructions.", correctAnswer: "DECODE" },
            { id: "e3", situation: "A lumberjack swings an axe to physically chop down a marked tree trunk.", correctAnswer: "EXECUTE" }
        ]
    },
    medium: {
        title: "🟡 Round 2: Automated Systems (Medium)",
        description: "Slightly more abstract. Think about mechanical logic gates.",
        scenarios: [
            { id: "m1", situation: "A vending machine internal mechanism rolls a specific soda can out from the deep storage rack.", correctAnswer: "FETCH" },
            { id: "m2", situation: "A barcode scanner reads the black lines on a snack wrapper to figure out its item name and price.", correctAnswer: "DECODE" },
            { id: "m3", situation: "A cash register drawer pops open and the machine prints out a physical paper receipt.", correctAnswer: "EXECUTE" }
        ]
    },
    hard: {
        title: "🔴 Round 3: High-Level Logistical Logic (Hard)",
        description: "Complex coordination. Which step represents retrieval vs. interpretation?",
        scenarios: [
            { id: "h1", situation: "A robotic warehouse crane retrieves a heavy pallet based entirely on raw grid coordinate data.", correctAnswer: "FETCH" },
            { id: "h2", situation: "An air traffic controller reads a complex radar flight matrix to deduce if a plane is cleared to land.", correctAnswer: "DECODE" },
            { id: "h3", situation: "A heavy hydraulic factory press slams down, stamping a flat sheet of metal into a finished car door.", correctAnswer: "EXECUTE" }
        ]
    }
};

const STAGES = ['FETCH', 'DECODE', 'EXECUTE'];
const ROUND_ORDER = ['easy', 'medium', 'hard'];

export default function InstinctGame() {
    // 2. Progressive game states
    const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // Stores answers for the active round
    const [isRoundSubmitted, setIsRoundSubmitted] = useState(false);
    const [cumulativeScore, setCumulativeScore] = useState(0);
    const [gameCompleted, setGameCompleted] = useState(false);

    const currentRoundKey = ROUND_ORDER[currentRoundIndex];
    const currentRound = ROUNDS_DATA[currentRoundKey];

    // --- DRAG AND DROP LOGIC ---
    const handleDragStart = (e, stageText) => {
        e.dataTransfer.setData("draggedStage", stageText);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, scenarioId) => {
        e.preventDefault();
        const droppedStage = e.dataTransfer.getData("draggedStage");
        setUserAnswers({
            ...userAnswers,
            [scenarioId]: droppedStage
        });
    };

    // --- GAME CONTROL LOGIC ---
    const handleSubmitRound = () => {
        let roundPoints = 0;
        currentRound.scenarios.forEach(scenario => {
            if (userAnswers[scenario.id] === scenario.correctAnswer) {
                roundPoints += 1;
            }
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

    // Check if all 3 boxes in the current round are filled
    const allFilled = currentRound.scenarios.every(s => userAnswers[s.id]);

    return (
        <div style={{
            border: '2px solid #BC52EE', 
            padding: '25px', 
            borderRadius: '12px', 
            backgroundColor: '#1b1f24',
            color: '#fff',
            maxWidth: '700px',
            margin: '20px auto',
            fontFamily: 'sans-serif',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
        }}>
            {!gameCompleted ? (
                <div>
                    {/* ROUND HEADER */}
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h3 style={{ color: '#BC52EE', margin: '0 0 5px 0', fontSize: '1.4rem' }}>{currentRound.title}</h3>
                        <p style={{ color: '#aaa', fontSize: '0.9rem', margin: 0 }}>{currentRound.description}</p>
                    </div>

                    {/* DRAGGABLE OPTIONS BAR */}
                    <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginBottom: '25px' }}>
                        {STAGES.map((stage) => (
                            <div 
                                key={stage}
                                draggable={!isRoundSubmitted} 
                                onDragStart={(e) => handleDragStart(e, stage)}
                                style={{
                                    padding: '10px 24px',
                                    backgroundColor: isRoundSubmitted ? '#444' : '#6DA55F',
                                    color: 'white',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: isRoundSubmitted ? 'default' : 'grab',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                                    userSelect: 'none'
                                }}
                            >
                                {stage}
                            </div>
                        ))}
                    </div>

                    {/* CURRENT ROUND SCENARIOS */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {currentRound.scenarios.map((scenario) => {
                            const answer = userAnswers[scenario.id];
                            const isCorrect = answer === scenario.correctAnswer;

                            return (
                                <div key={scenario.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#24292e', padding: '18px', borderRadius: '8px', border: '1px solid #2f363d' }}>
                                    <div style={{ flex: 1, fontStyle: 'italic', lineHeight: '1.4', color: '#e1e4e8' }}>
                                        "{scenario.situation}"
                                    </div>

                                    {/* Drop Zone Box */}
                                    <div 
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => !isRoundSubmitted && handleDrop(e, scenario.id)}
                                        style={{
                                            width: '130px',
                                            height: '42px',
                                            border: answer ? '2px solid #6DA55F' : '2px dashed #586069',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: answer ? '#223e22' : 'transparent',
                                            fontWeight: 'bold',
                                            color: answer ? '#81ea81' : '#888',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        {answer ? answer : "Drop Here"}
                                    </div>

                                    {/* Feedback Icons */}
                                    {isRoundSubmitted && (
                                        <div style={{ width: '30px', textAlign: 'center', fontSize: '1.4rem' }}>
                                            {isCorrect ? '✅' : '❌'}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* NAVIGATION ACTIONS */}
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        {!isRoundSubmitted ? (
                            <button 
                                onClick={handleSubmitRound}
                                disabled={!allFilled}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: allFilled ? '#BC52EE' : '#343a42',
                                    color: allFilled ? 'white' : '#6a737d',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: allFilled ? 'pointer' : 'not-allowed',
                                    fontSize: '1rem'
                                }}
                            >
                                Submit Round Answers
                            </button>
                        ) : (
                            <button 
                                onClick={handleNextRound}
                                style={{
                                    padding: '12px 28px',
                                    backgroundColor: '#6DA55F',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    fontSize: '1rem'
                                }}
                            >
                                {currentRoundIndex === ROUND_ORDER.length - 1 ? "See Final Results 🎉" : "Proceed to Next Round →"}
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                /* GAME OVER SCORE SCREEN */
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <h3 style={{ color: '#BC52EE', fontSize: '1.8rem', margin: '0 0 10px 0' }}>🎉 Architecture Instincts Evaluated!</h3>
                    <p style={{ color: '#ccc', marginBottom: '30px' }}>You have processed all logistical cycles across all difficulty sectors.</p>
                    
                    <div style={{ background: '#24292e', display: 'inline-block', padding: '20px 40px', borderRadius: '12px', border: '1px solid #2f363d', marginBottom: '30px' }}>
                        <p style={{ margin: '0 0 5px 0', textTransform: 'uppercase', color: '#888', letterSpacing: '1px', fontSize: '0.85rem' }}>Total Combined Score</p>
                        <h2 style={{ fontSize: '3rem', margin: 0, color: cumulativeScore >= 7 ? '#6DA55F' : '#BC52EE' }}>{cumulativeScore} / 9</h2>
                    </div>

                    <div>
                        <p style={{ fontStyle: 'italic', color: '#aaa', maxWidth: '500px', margin: '0 auto 25px auto', fontSize: '0.95rem' }}>
                            {cumulativeScore === 9 ? "Flawless performance! Your natural system logic processes tasks at microcode speeds." : "Great effort! Now that your intuition is primed, let's explore how hardware wires actually enforce these actions."}
                        </p>
                        <button 
                            onClick={handleResetGame}
                            style={{ padding: '10px 20px', backgroundColor: 'transparent', color: '#aaa', border: '1px solid #444', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Reset Activity Tiers
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}