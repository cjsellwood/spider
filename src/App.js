import React, { useEffect, useState } from "react";
import "./App.css";
import { DndContext } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Droppable from "./Droppable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import CardColumn from "./components/CardColumn";
import HiddenColumn from "./components/HiddenColumn";
import FinishedGame from "./components/FinishedGame";
import EndScreen from "./components/EndScreen";
import useCardGenerator from "./hooks/useCardGenerator";
import releaseMP3 from "./sounds/release.mp3";
import pickupMP3 from "./sounds/pickup.mp3";
import illegalMP3 from "./sounds/illegal.mp3";
import setCompleteMP3 from "./sounds/setComplete.mp3";
import dealMP3 from "./sounds/deal.mp3";

function App() {
  const [hiddenCards, setHiddenCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [spareCards, setSpareCards] = useState([]);
  const [completed, setCompleted] = useState([13, 13, 13, 13, 13, 13, 13]);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [score, setScore] = useState(500);
  const [moves, setMoves] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [highScoreDate, setHighScoreDate] = useState("");

  const [generateCards] = useCardGenerator();
  useEffect(() => {
    const { hiddenCards, topCards, spareCards } = generateCards();
    topCards[0] = [13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
    hiddenCards[0] = [];
    spareCards[0][0] = 1;
    setHiddenCards(hiddenCards);
    setCards(topCards);
    setSpareCards(spareCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sounds, setSounds] = useState({});

  // Load sounds
  useEffect(() => {
    setSounds({
      pickup: new Audio(pickupMP3),
      release: new Audio(releaseMP3),
      illegal: new Audio(illegalMP3),
      setComplete: new Audio(setCompleteMP3),
      deal: new Audio(dealMP3),
    });
  }, []);

  // Load any stored statistics
  useEffect(() => {
    const storedPlayed = localStorage.getItem("played");
    if (storedPlayed) {
      setGamesPlayed(Number(storedPlayed));
    }
    const storedWon = localStorage.getItem("won");
    if (storedWon) {
      setGamesWon(Number(storedWon));
    }
    const storedHighScore = localStorage.getItem("highScore");
    if (storedHighScore) {
      setHighScore(Number(storedHighScore));
    }
    const storedHighScoreDate = localStorage.getItem("highScoreDate");
    if (storedHighScoreDate) {
      setHighScoreDate(storedHighScoreDate);
    }
  }, []);

  const gameWon = () => {
    setShowFireworks(true);

    // Set high score if greater than stored score
    if (score + 100 > highScore) {
      setHighScore(score + 100);
      localStorage.setItem("highScore", score + 100);
      localStorage.setItem(
        "highScoreDate",
        new Date(Date.now()).toLocaleDateString()
      );
      setHighScoreDate(new Date(Date.now()).toLocaleDateString());
    }

    setGamesPlayed(gamesPlayed + 1);
    localStorage.setItem("played", gamesPlayed + 1);
    setGamesWon(gamesWon + 1);
    localStorage.setItem("won", gamesWon + 1);
  };

  // Duplicate nested arrays immutably
  const duplicateNested = (array) => {
    return array.map((col) => [...col]);
  };

  // Check if there are any sets complete and remove them
  const checkForSets = (cardCol) => {
    let index = -1;
    for (let i = 0; i < cardCol.length; i++) {
      if (cardCol[i] === 13) {
        index = i;
        for (let j = 13; j > 0; j--) {
          if (cardCol[i + 13 - j] !== j) {
            index = -1;
          }
        }
      }
    }

    // If a set complete remove it and check if game won
    if (index !== -1) {
      setScore(score + 100);
      sounds.setComplete.play();
      // Game won
      if (completed.length + 1 === 8) {
        gameWon();
      }
      setCompleted([...completed, 13]);
      return cardCol.slice(0, index);
    }
    return cardCol;
  };

  const checkForEmpty = (cardsArray) => {
    const newCards = duplicateNested(cardsArray);
    for (let i = 0; i < newCards.length; i++) {
      // Check if column empty and there are still hidden cards
      if (!newCards[i].length && hiddenCards[i].length) {
        newCards[i].push(hiddenCards[i].at(-1));
        const newHidden = duplicateNested(hiddenCards);
        newHidden[i] = newHidden[i].slice(0, newHidden[i].length - 1);
        setHiddenCards(newHidden);
      }
    }
    return newCards;
  };

  const handleDragStart = () => {
    sounds.pickup.play();
  };

  const handleDragEnd = (e) => {
    const { over } = e;
    if (over) {
      // Get data for the card receiving card and col
      const receivingCol = e.over.data.current.receivingCol;
      const receivingCard = cards[receivingCol].at(-1);

      // Get data for the card being dragged
      const { prevCol, prevRow } = e.active.data.current;
      const addCard = cards[prevCol][prevRow];

      // Only drop if receiving card is one higher or empty
      if (receivingCard - 1 === addCard || !receivingCard) {
        sounds.release.play();
        setScore(score - 1);
        setMoves(moves + 1);

        const newCards = duplicateNested(cards);

        // Add new cards to receiving column
        newCards[receivingCol] = [
          ...newCards[receivingCol],
          ...newCards[prevCol].slice(prevRow),
        ];

        // Remove added card from previous column
        newCards[prevCol] = newCards[prevCol].slice(0, prevRow);

        // Check for completed sets and remove any found
        newCards[receivingCol] = checkForSets(newCards[receivingCol]);

        // Check for empty column and flip hidden card
        const emptiedCards = checkForEmpty(newCards);

        setCards(emptiedCards);
      } else if (prevCol !== receivingCol) {
        // If dropping on an illegal position and not starting position
        sounds.illegal.play();
      } else {
        // Plays on dropping on own position
        sounds.release.play();
      }
    } else {
      sounds.release.play();
    }
  };

  // Add a card to each column from spares deck
  const addSpares = () => {
    // If a column has no cards don't add spares
    for (let col of cards) {
      if (!col.length) {
        sounds.illegal.play();
        return;
      }
    }

    sounds.deal.play();
    // console.log(sounds.deal.duration);

    // setTimeout(() => {
    const newCards = duplicateNested(cards);
    const newSpares = duplicateNested(spareCards);
    for (let i = 0; i < newCards.length; i++) {
      newCards[i].push(newSpares[0][i]);
    }

    // Check if any sets formed
    for (let i = 0; i < newCards.length; i++) {
      newCards[i] = checkForSets(newCards[i]);
    }

    setSpareCards(newSpares.slice(1));
    setCards(newCards);
    // }, 1150);
  };

  const startNewGame = () => {
    const { hiddenCards, topCards, spareCards } = generateCards();
    // Add to games played if game was not won
    if (!showEnd && moves > 10) {
      setGamesPlayed(gamesPlayed + 1);
      localStorage.setItem("played", gamesPlayed + 1);
    }
    setShowEnd(false);
    setHiddenCards(hiddenCards);
    setCards(topCards);
    setSpareCards(spareCards);
    setCompleted([]);
    setScore(500);
    setMoves(0);
  };

  return (
    <div className="App">
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        modifiers={[restrictToWindowEdges]}
      >
        <div id="columns-container">
          {cards.map((column, index) => {
            return (
              <div key={"column" + index}>
                <HiddenColumn hiddenCards={hiddenCards} index={index} />
                <Droppable id={uuidv4()} data={{ receivingCol: index }}>
                  <CardColumn column={column} colNum={index} />
                </Droppable>
              </div>
            );
          })}
        </div>
      </DndContext>
      <footer>
        <div className="completed-container">
          {completed.map((completed, i) => (
            <div
              key={"completed" + i}
              className="completed-card card13"
              style={{ zIndex: `${10 - i}` }}
            ></div>
          ))}
        </div>
        <div
          className={`info-container ${(showEnd || showFireworks) && "hide"}`}
        >
          <p>Score: {score}</p>
          <button title="New Game" onClick={() => startNewGame()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
              <path
                fillRule="evenodd"
                d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
              />
            </svg>
          </button>
          <p>Moves: {moves}</p>
        </div>
        <div onClick={() => addSpares()} className="spares-container">
          {spareCards.map((spare, i) => (
            <div
              key={"spare" + i}
              className="spare-card"
              style={{ zIndex: `${10 - i}` }}
            ></div>
          ))}
        </div>
      </footer>
      {showFireworks && (
        <FinishedGame
          setShowFireworks={setShowFireworks}
          setShowEnd={setShowEnd}
        />
      )}
      {showEnd && (
        <EndScreen
          score={score}
          moves={moves}
          startNewGame={startNewGame}
          gamesPlayed={gamesPlayed}
          gamesWon={gamesWon}
          highScore={highScore}
          highScoreDate={highScoreDate}
        />
      )}
    </div>
  );
}

export default App;
