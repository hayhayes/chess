import Board from "@/components/Board";
import { UndoButton, ResetButton } from "@/components/GameControls";
import TurnTracker from "@/components/Turn";

export default function Home() {
  return (
    <div className="main">
      
      <div className="game-content">
        <Board />
        <div className="controls">
          <UndoButton/> <ResetButton/>
        </div>
      </div>
      <TurnTracker />
    </div>
  );
}
