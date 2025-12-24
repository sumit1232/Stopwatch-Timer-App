import { useState, useEffect, useRef } from "react";

function App() {
  const [time, setTime] = useState(0); // Time in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [countdown, setCountdown] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const intervalRef = useRef(null);

  // Stopwatch timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };
  const handleLap = () => setLaps([time, ...laps]);

  // Countdown timer
  const handleCountdownStart = () => {
    const seconds = parseInt(countdown);
    if (!isNaN(seconds) && seconds > 0) {
      setTime(seconds);
      setIsRunning(true);
      setAlertMessage("");
    }
  };

  useEffect(() => {
    if (time === 0 && isRunning && countdown) {
      setIsRunning(false);
      setAlertMessage("⏰ Countdown Finished!");
    }
  }, [time, isRunning, countdown]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-indigo-700 mb-6 text-center">
        Stopwatch / Timer App
      </h1>

      {/* Stopwatch Display */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 w-80 text-center">
        <p className="text-5xl font-mono mb-4">{formatTime(time)}</p>

        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={handleStartPause}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
          >
            Reset
          </button>
          <button
            onClick={handleLap}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Lap
          </button>
        </div>

        {laps.length > 0 && (
          <div className="text-left max-h-40 overflow-y-auto">
            <h2 className="font-semibold mb-2">Laps:</h2>
            <ul className="list-decimal list-inside">
              {laps.map((lapTime, index) => (
                <li key={index}>{formatTime(lapTime)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Countdown Timer */}
      <div className="bg-white p-6 rounded-lg shadow w-80 text-center">
        <h2 className="text-2xl font-semibold mb-2">Countdown Timer</h2>
        <input
          type="number"
          placeholder="Enter seconds"
          value={countdown}
          onChange={(e) => setCountdown(e.target.value)}
          className="border px-3 py-2 rounded w-40 mb-4"
        />
        <div>
          <button
            onClick={handleCountdownStart}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
          >
            Start Countdown
          </button>
        </div>
        {alertMessage && <p className="text-red-600 mt-4">{alertMessage}</p>}
      </div>
    </div>
  );
}

export default App;
