import React, { useState, useEffect } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Speech = () => {
    // Text-to-Speech States
    const [text, setText] = useState("");
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const { speak } = useSpeechSynthesis();

    // Fetch available voices
    useEffect(() => {
        const updateVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0) {
                setSelectedVoice(availableVoices[0].name);
            }
        };

        updateVoices();
        window.speechSynthesis.onvoiceschanged = updateVoices;
    }, []);

    // Speech-to-Text Hook
    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } =
        useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        return <p>Your browser does not support speech recognition.</p>;
    }

    return (
        <div className="speech">
            <h2>Speech Converter (TTS & STT)</h2>

            {/* Text-to-Speech Section */}
            <h3>Text-to-Speech</h3>
            <textarea 
                rows="4" 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Type text to convert to speech..."
            />

            {/* Voice Selection */}
            <label>Select Voice:</label>
            <select value={selectedVoice} onChange={(e) => setSelectedVoice(e.target.value)}>
                {voices.map((voice, index) => (
                    <option key={index} value={voice.name}>{voice.name} ({voice.lang})</option>
                ))}
            </select>

            {/* Speak Button */}
            <button 
                onClick={() => {
                    const selected = voices.find(v => v.name === selectedVoice);
                    speak({ text, rate, pitch, voice: selected });
                }}
            >
                Speak
            </button>

            {/* Speech Rate & Pitch Controls */}
            <div>
                <label>Rate: {rate.toFixed(1)}</label>
                <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} />

                <label>Pitch: {pitch.toFixed(1)}</label>
                <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} />
            </div>

            {/* Speech-to-Text Section */}
            <h3>Speech-to-Text</h3>
            <p>{listening ? "🎤 Listening..." : "Click the button to start speaking"}</p>
            <button onClick={SpeechRecognition.startListening}>Start Listening</button>
            <button onClick={SpeechRecognition.stopListening}>Stop</button>
            <button onClick={resetTranscript}>Reset</button>

            <p><strong>Converted Text:</strong> {transcript}</p>
        </div>
    );
};

export default Speech;
