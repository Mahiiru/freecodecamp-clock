import './App.css';
import React, { useEffect, useState } from "react";

function App() {
  
  const [breakInterval, setBreakInterval] = useState(5);
  const [sessionInterval, setSessionInterval] = useState(25);
  const [currentTimer, setCurrentTimer] = useState("SESSION");
  const [timeLeft, setTimeLeft] = useState(1500);
  const [isClockRunning, setIsClockRunning] = useState(false);

  const MAX_INTERVAL = 60;
  const MIN_INTERVAL = 1;
  const audio = document.getElementById('beep');

  const handleBreakIntervals = (modifyInterval) => {
    if (breakInterval > MIN_INTERVAL && breakInterval < MAX_INTERVAL) {
      setBreakInterval(breakInterval + modifyInterval);
    }
  }

  const handleSessionIntervals = (modifyInterval, modifyTimeLeft) => {
    if (sessionInterval > MIN_INTERVAL && sessionInterval < MAX_INTERVAL) {
      setSessionInterval(sessionInterval + modifyInterval);
      setTimeLeft(timeLeft + modifyTimeLeft);
    }
  }

  const handleReset = () => {
    setIsClockRunning(false);
    setTimeLeft(1500)
    setBreakInterval(5)
    setSessionInterval(25);
    setCurrentTimer("SESSION");
    audio.pause();
    audio.currentTime = 0
  }

  const handlePlay = () => {
    setIsClockRunning(!isClockRunning);
  }

  useEffect(() => {
    if (isClockRunning) {
      const intervalId = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft === 0) {
            if (currentTimer === "SESSION") {
              setCurrentTimer("BREAK");
              audio.play();
              return breakInterval * 60;
            } else {
              setCurrentTimer("SESSION");
              audio.pause();
              audio.currentTime = 0;
              return sessionInterval * 60;
            }
          }
          return timeLeft - 1;
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [isClockRunning, currentTimer, sessionInterval, breakInterval, audio]);

  const timeFormatter = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    return `${formattedMinutes}:${formattedSeconds} `;
  }

  const title = currentTimer === "SESSION" ? "Session" : "Break";

  return (
    <div className="App">
      <div className="proyect-name">FreeCodeCamp 25 + 5 Clock</div>
      <div className="length-control">
        <div id="break-label">Break Length</div>
        <button id="break-decrement" onClick={() => handleBreakIntervals(-1)}>-</button>
        <div id="break-length">{breakInterval}</div>
        <button id="break-increment" onClick={() => handleBreakIntervals(1)}>+</button>
      </div>
      <div className="length-control">
        <div id="session-label">Session Length</div>
        <button id="session-decrement" onClick={() => handleSessionIntervals(-1, -60)}>-</button>
        <div id="session-length">{sessionInterval}</div>
        <button id="session-increment" onClick={() => handleSessionIntervals(1, 60)}>+</button>
      </div>
      <div className="timer">
        <div className="timer-wrapper">
          <div id="timer-label">{title}</div>
          <div id="time-left">{timeFormatter()}</div>
        </div>
      </div>
      <div className="timer-control">
        <button id="start_stop" onClick={handlePlay}>Start/Stop</button>
        <button id="reset" onClick={handleReset}>Reset</button>
      </div>
      <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
  );
}

export default App;
