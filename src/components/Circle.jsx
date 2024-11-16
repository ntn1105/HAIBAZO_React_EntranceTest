import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import "../styles/Circle.scss";

const Circle = ({ points, onCircleClick, status }) => {
  const getRandomPosition = () => {
    const containerWidth = 800;
    const containerHeight = 600;
    const x = Math.random() * (containerWidth - 50);
    const y = Math.random() * (containerHeight - 50);
    return { x, y };
  };

  const [circlePoints, setCirclePoints] = useState([]);
  const [countdowns, setCountdowns] = useState({});
  const [hiddenCircleIds, setHiddenCircleIds] = useState([]);
  const [activeCircleIds, setActiveCircleIds] = useState([]);
  const [next, setNext] = useState(1); // Thêm state next để theo dõi giá trị số

  const statusRef = useRef(status); // Lưu trạng thái mới nhất
  const intervalIdsRef = useRef([]); // Quản lý tất cả intervalId

  useEffect(() => {
    setCirclePoints(
      Array.from({ length: points }, (_, index) => ({
        id: index + 1,
        position: getRandomPosition(),
      }))
    );
  }, [points]);

  useEffect(() => {
    statusRef.current = status; // Cập nhật trạng thái mới nhất vào ref
    if (status === "GAME OVER") {
      // Dừng tất cả các interval
      intervalIdsRef.current.forEach((id) => clearInterval(id));
      intervalIdsRef.current = []; // Reset danh sách intervalId
    }
  }, [status]);

  const handleCircleClick = (id) => {
    if (hiddenCircleIds.includes(id) || status === "GAME OVER") return;

    setActiveCircleIds((prev) => [...prev, id]);
    setCountdowns((prevCountdowns) => ({
      ...prevCountdowns,
      [id]: 3.0,
    }));

    let countdownTimer = 3.0;

    const timeoutId = setTimeout(() => {
      if (statusRef.current !== "GAME OVER") {
        setHiddenCircleIds((prevIds) => [...prevIds, id]);
      }
    }, 3000);

    const intervalId = setInterval(() => {
      if (statusRef.current === "GAME OVER") {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
        return;
      }

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

    // Lưu intervalId vào ref
    intervalIdsRef.current.push(intervalId);

    // Tăng giá trị "Next" mỗi lần click vào vòng tròn
    setNext((prevNext) => prevNext + 1);

    onCircleClick(id);
  };

  const circles = circlePoints.map((point) => (
    <div
      id={`circle-${point.id}`}
      className={`circle ${
        hiddenCircleIds.includes(point.id) ? "hidden" : ""
      } ${activeCircleIds.includes(point.id) ? "active" : ""}`}
      key={point.id}
      style={{
        left: `${point.position.x}px`,
        top: `${point.position.y}px`,
        background: activeCircleIds.includes(point.id)
          ? `rgba(255, 90, 0, ${countdowns[point.id] / 3})`
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

  return (
    <>
      <div className="circle-container">{circles}</div>
      {status !== "GAME OVER" && status !== "ALL CLEARED" && (
        <span className="next-number">Next {next}</span>
      )}
    </>
  );
};

export default Circle;

Circle.propTypes = {
  points: PropTypes.number.isRequired,
  onCircleClick: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};
