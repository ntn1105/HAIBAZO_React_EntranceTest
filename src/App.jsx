import { useState, useEffect } from "react";
import Controls from "./components/Control";
import Circle from "./components/Circle";
import "./styles/App.scss";

const App = () => {
  const [generatedPoints, setGeneratedPoints] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [status, setStatus] = useState("LET'S PLAY");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  useEffect(() => {
    let autoPlayTimer;

    if (isAutoPlay && isPlaying) {
      if (currentTarget <= generatedPoints) {
        autoPlayTimer = setTimeout(() => {
          document.getElementById(`circle-${currentTarget}`)?.click();
        }, 1000);
      }
    }

    return () => clearTimeout(autoPlayTimer);
  }, [isAutoPlay, isPlaying, currentTarget, generatedPoints]);

  const handleRestart = (points) => {
    setGeneratedPoints(points);
    setResetTrigger((prev) => prev + 1);
    setCurrentTarget(1);
    setStatus("LET'S PLAY");
    setIsPlaying(true);
    setIsAutoPlay(false);
  };

  const handleCircleClick = (id) => {
    if (!isPlaying) return;

    if (id === currentTarget) {
      if (currentTarget === generatedPoints) {
        setStatus("ALL CLEARED");
        setIsPlaying(false);
        setIsAutoPlay(false);
      } else {
        setCurrentTarget(currentTarget + 1);
      }
    } else {
      setStatus("GAME OVER");
      setIsPlaying(false);
      setIsAutoPlay(false);
    }
  };

  return (
    <div className="app">
      <Controls
        setGeneratedPoints={handleRestart}
        status={status}
        isPlaying={isPlaying}
        isAutoPlay={isAutoPlay}
        setIsAutoPlay={setIsAutoPlay}
      />
      <Circle
        key={resetTrigger}
        points={generatedPoints}
        onCircleClick={handleCircleClick}
        status={status}
      />
    </div>
  );
};

export default App;
