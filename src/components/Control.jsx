import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "../styles/Control.scss";

const Controls = ({ setGeneratedPoints, status, isPlaying, isAutoPlay, setIsAutoPlay }) => {
  const [points, setPoints] = useState(5);
  const [time, setTime] = useState(0.0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (isPlaying) {
      const id = setInterval(() => {
        setTime((prevTime) => parseFloat((prevTime + 0.1).toFixed(1)));
      }, 100);
      setIntervalId(id);
    } else {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying]);

  const handlePlayClick = () => {
    setTime(0.0);
    setGeneratedPoints(parseInt(points, 10) || 0);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  const getStatusColor = (status) => {
    if (status === "GAME OVER") {
      return "rgba(255, 90, 0,1)"; 
    }
    if (status === "ALL CLEARED") {
      return "green"; 
    }
    return "initial"; 
  };

  return (
    <div className="controls">
      <span className="status" style={{ color: getStatusColor(status) }}>
        {status}
      </span>
      <div className="Point">
        <label>Points:</label>
        <input
          type="text"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      </div>
      <div className="Time">
        <label>Time:</label>
        <span>{time.toFixed(1)}s</span>
      </div>
      <div className="action_btn">
        <button onClick={handlePlayClick}>
          {isPlaying || status === "ALL CLEARED" || status === "GAME OVER" ? "Restart" : "Play"}
        </button>
        {isPlaying && (
          <button onClick={toggleAutoPlay}>
            {isAutoPlay ? "Auto Play OFF" : "Auto Play ON"}
          </button>
        )}
      </div>
    </div>
  );
};

Controls.propTypes = {
  setGeneratedPoints: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  isAutoPlay: PropTypes.bool.isRequired,
  setIsAutoPlay: PropTypes.func.isRequired,
};

export default Controls;
