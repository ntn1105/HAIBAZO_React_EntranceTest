import { useState } from "react";
import Controls from "./components/Control";
import Circle from "./components/Circle";
import "./styles/App.scss";

const App = () => {
  const [generatedPoints, setGeneratedPoints] = useState(0);
  const [resetTrigger, setResetTrigger] = useState(0); // Để reset Circle
  const [currentTarget, setCurrentTarget] = useState(1); // Số thứ tự cần nhấn
  const [status, setStatus] = useState("LET'S PLAY"); // Trạng thái trò chơi
  const [isPlaying, setIsPlaying] = useState(false); // Trạng thái chơi
  const [isAutoPlay, setIsAutoPlay] = useState(false); // Trạng thái AutoPlay

  const handleRestart = (points) => {
    setGeneratedPoints(points);
    setResetTrigger((prev) => prev + 1); // Reset lại Circle
    setCurrentTarget(1); // Reset thứ tự cần nhấn
    setStatus("LET'S PLAY"); // Reset trạng thái trò chơi
    setIsPlaying(true); // Bắt đầu chơi
  };

  const handleCircleClick = (id) => {
    if (!isPlaying) return;

    if (id === currentTarget) {
      // Người chơi nhấn đúng
      if (currentTarget === generatedPoints) {
        setStatus("ALL CLEARED"); // Người chơi thắng
        setIsPlaying(false); // Dừng chơi
      } else {
        setCurrentTarget(currentTarget + 1); // Tăng thứ tự cần nhấn
      }
    } else {
      // Người chơi nhấn sai
      setStatus("GAME OVER"); // Hiển thị "Game Over"
      setIsPlaying(false); // Dừng chơi
    }
  };

  return (
    <div className="app">
      <Controls
        setGeneratedPoints={handleRestart}
        status={status} // Truyền trạng thái xuống Controls
        isPlaying={isPlaying} // Truyền trạng thái chơi xuống Controls
        isAutoPlay={isAutoPlay} // Truyền trạng thái AutoPlay xuống Controls
        setIsAutoPlay={setIsAutoPlay} // Hàm thay đổi trạng thái AutoPlay
      />
      <Circle
        key={resetTrigger}
        points={generatedPoints}
        onCircleClick={handleCircleClick} // Xử lý nhấn Circle
      />
    </div>
  );
};

export default App;
