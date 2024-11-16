import { useState, useEffect } from "react";
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

  useEffect(() => {
    let autoPlayTimer;
  
    if (isAutoPlay && isPlaying) {
      // Kiểm tra nếu còn vòng tròn cần click
      if (currentTarget <= generatedPoints) {
        autoPlayTimer = setTimeout(() => {
          document.getElementById(`circle-${currentTarget}`)?.click(); // Tự động click vòng tròn
        }, 1000); // Khoảng thời gian giữa các lần click
      }
    }
  
    return () => clearTimeout(autoPlayTimer); // Xóa timer khi trạng thái thay đổi
  }, [isAutoPlay, isPlaying, currentTarget, generatedPoints]);
  

  const handleRestart = (points) => {
    setGeneratedPoints(points);
    setResetTrigger((prev) => prev + 1); // Reset lại Circle
    setCurrentTarget(1); // Reset thứ tự cần nhấn
    setStatus("LET'S PLAY"); // Reset trạng thái trò chơi
    setIsPlaying(true); // Bắt đầu chơi
    setIsAutoPlay(false); // Tắt AutoPlay khi restart
  };

  const handleCircleClick = (id) => {
    if (!isPlaying) return;

    if (id === currentTarget) {
      // Người chơi nhấn đúng
      if (currentTarget === generatedPoints) {
        setStatus("ALL CLEARED"); // Người chơi thắng
        setIsPlaying(false); // Dừng chơi
        setIsAutoPlay(false); // Tắt AutoPlay khi kết thúc
      } else {
        setCurrentTarget(currentTarget + 1); // Tăng thứ tự cần nhấn
      }
    } else {
      // Người chơi nhấn sai
      setStatus("GAME OVER"); // Hiển thị "Game Over"
      setIsPlaying(false); // Dừng chơi
      setIsAutoPlay(false); // Tắt AutoPlay khi thua
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
