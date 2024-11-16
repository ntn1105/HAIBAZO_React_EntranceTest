import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import "../styles/Circle.scss";

const Circle = ({ points, onCircleClick }) => {
  const getRandomPosition = () => {
    const containerWidth = 800;
    const containerHeight = 600;
    const x = Math.random() * (containerWidth - 50);
    const y = Math.random() * (containerHeight - 50);
    return { x, y };
  };

  const [circlePoints, setCirclePoints] = useState([]); // Points for circles
  const [countdowns, setCountdowns] = useState({}); // Countdown for each circle
  const [hiddenCircleIds, setHiddenCircleIds] = useState([]); // Hidden circles
  const [activeCircleIds, setActiveCircleIds] = useState([]); // Active circles

  useEffect(() => {
    setCirclePoints(
      Array.from({ length: points }, (_, index) => ({
        id: index + 1,
        position: getRandomPosition(),
      }))
    );
  }, [points]);

  const handleCircleClick = (id) => {
    if (hiddenCircleIds.includes(id)) return;

    setActiveCircleIds((prev) => [...prev, id]);
    setCountdowns((prevCountdowns) => ({
      ...prevCountdowns,
      [id]: 3.0,
    }));

    let countdownTimer = 3.0;

    const timeoutId = setTimeout(() => {
      setHiddenCircleIds((prevIds) => [...prevIds, id]);
    }, 3000);

    const intervalId = setInterval(() => {
      countdownTimer -= 0.1;
      if (countdownTimer <= 0) {
        clearInterval(intervalId);
      } else {
        setCountdowns((prevCountdowns) => ({
          ...prevCountdowns,
          [id]: parseFloat(countdownTimer.toFixed(1)),
        }));
      }
    }, 100);

    onCircleClick(id);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  };

  const circles = circlePoints.map((point) => (
    <div
      id={`circle-${point.id}`} // Thêm ID để hỗ trợ Auto Play
      className={`circle ${
        hiddenCircleIds.includes(point.id) ? "hidden" : ""
      } ${activeCircleIds.includes(point.id) ? "active" : ""}`}
      key={point.id}
      style={{
        left: `${point.position.x}px`,
        top: `${point.position.y}px`,
        background: activeCircleIds.includes(point.id)
          ? `rgba(255, 165, 0, ${countdowns[point.id]})`
          : "initial",
      }}
      onClick={() => handleCircleClick(point.id)}
    >
      <span>{point.id}</span>
      {countdowns[point.id] !== undefined &&
        !hiddenCircleIds.includes(point.id) && (
          <div className="countdown-timer">{countdowns[point.id]}s</div>
        )}
    </div>
  ));

  return <div className="circle-container">{circles}</div>;
};

Circle.propTypes = {
  points: PropTypes.number.isRequired,
  onCircleClick: PropTypes.func.isRequired,
};

export default Circle;
