import React from "react";
import "./EndScreen.css"

const EndScreen = ({
  score,
  moves,
  startNewGame,
  gamesPlayed,
  gamesWon,
  highScore,
  highScoreDate,
}) => {
  return (
    <div className="end-screen">
      <div>
        <h1>Winner</h1>
        <div className="game-results" style={{ margin: "0 auto" }}>
          <p>Score: {score}</p>
          <p>Moves: {moves}</p>
        </div>
        <div className="game-results">
          <p>High score: {highScore}</p>
          <p>Date: {highScoreDate}</p>
        </div>
        <div className="game-results">
          <p>Games played: {gamesPlayed}</p>
        </div>
        <div className="game-results">
          <p>Games won: {gamesWon}</p>
          <p>
            Win percent: {Math.floor((gamesWon / gamesPlayed) * 100) + "%"}
          </p>
        </div>
        <button onClick={() => startNewGame()}>Play again</button>
      </div>
    </div>
  );
};

export default EndScreen;
