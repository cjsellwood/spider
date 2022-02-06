import React, { useEffect, useState } from "react";
import "./App.css";
import { DndContext } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import Droppable from "./components/Droppable";
import CardColumn from "./components/CardColumn";
import HiddenColumn from "./components/HiddenColumn";
import FinishedGame from "./components/FinishedGame";
import EndScreen from "./components/EndScreen";
import BottomBar from "./components/BottomBar";
import SuitesSelector from "./components/SuitesSelector";
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
  const [completed, setCompleted] = useState([]);
  const [showFireworks, setShowFireworks] = useState(false);
  const [showEnd, setShowEnd] = useState(false);
  const [score, setScore] = useState(500);
  const [moves, setMoves] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [highScoreDate, setHighScoreDate] = useState("");
  const [animation, setAnimation] = useState({ x: 0, y: 0, id: "" });
  const [kingAnimation, setKingAnimation] = useState({
    x: 0,
    y: 0,
    cardWidth: 0,
  });

  const [sparePosition, setSparePosition] = useState({});
  const [suites, setSuites] = useState(0);

  const [generateCards] = useCardGenerator();
  useEffect(() => {
    if (!suites) {
      return;
    }
    const { hiddenCards, topCards, spareCards } = generateCards(suites);
    setHiddenCards(hiddenCards);
    topCards[5] = [12];
    topCards[6] = [13];
    setCards(topCards);
    setSpareCards(spareCards);

    setShowDeal(true);

    sounds.deal.play();

    setTimeout(() => {
      setShowDeal(false);
    }, 1300);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suites]);

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
    if (!suites) {
      return;
    }
    const storedPlayed = localStorage.getItem(`played${suites}`);
    if (storedPlayed) {
      setGamesPlayed(Number(storedPlayed));
    }
    const storedWon = localStorage.getItem(`won${suites}`);
    if (storedWon) {
      setGamesWon(Number(storedWon));
    }
    const storedHighScore = localStorage.getItem(`highScore${suites}`);
    if (storedHighScore) {
      setHighScore(Number(storedHighScore));
    }
    const storedHighScoreDate = localStorage.getItem(`highScoreDate1${suites}`);
    if (storedHighScoreDate) {
      setHighScoreDate(storedHighScoreDate);
    }
  }, [suites]);

  const gameWon = () => {
    setShowFireworks(true);

    // Set high score if greater than stored score
    if (score + 100 > highScore) {
      setHighScore(score + 100);
      localStorage.setItem(`highScore${suites}`, score + 100);
      localStorage.setItem(
        `highScoreDate${suites}`,
        new Date(Date.now()).toLocaleDateString()
      );
      setHighScoreDate(new Date(Date.now()).toLocaleDateString());
    }

    setGamesPlayed(gamesPlayed + 1);
    localStorage.setItem(`played${suites}`, gamesPlayed + 1);
    setGamesWon(gamesWon + 1);
    localStorage.setItem(`won${suites}`, gamesWon + 1);
  };

  // Duplicate nested arrays immutably
  const duplicateNested = (array) => {
    return array.map((col) => [...col]);
  };

  // Check if there are any sets complete and remove them
  const checkForSets = (cardCol, rect) => {
    console.log(cardCol);
    let index = -1;
    for (let i = 0; i < cardCol.length; i++) {
      // Find any kings
      for (let k = 1; k <= suites; k++) {
        if (cardCol[i] === 13 * k) {
          index = i;
          for (let j = 13 * k; j >= k * 13 - 12; j--) {
            // If not 13 consecutive numbers do not count set
            if (cardCol[i + 13 * k - j] !== j) {
              index = -1;
            }
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
      setCompleted([...completed, cardCol[index]]);

      setKingAnimation({
        x: rect.left + rect.width,
        y: rect.top + rect.width * 1.5,
        cardWidth: rect.width,
      });

      return cardCol.slice(0, index);
    }

    return cardCol;
  };

  const checkForEmpty = (cardsArray) => {
    const newCards = duplicateNested(cardsArray);
    const newHidden = duplicateNested(hiddenCards);
    for (let i = 0; i < newCards.length; i++) {
      // Check if column empty and there are still hidden cards
      if (!newCards[i].length && newHidden[i].length) {
        newCards[i].push(newHidden[i].at(-1));
        newHidden[i] = newHidden[i].slice(0, newHidden[i].length - 1);
      }
    }
    setHiddenCards(newHidden);
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
      if (
        ((receivingCard - 1) % 13) + 1 - 1 === ((addCard - 1) % 13) + 1 ||
        !receivingCard
      ) {
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
        newCards[receivingCol] = checkForSets(
          newCards[receivingCol],
          e.over.rect
        );

        // Check for empty column and flip hidden card
        const emptiedCards = checkForEmpty(newCards);

        setCards(emptiedCards);
        setAnimation({
          x: 0,
          y: 0,
          id: animation.id,
        });
      } else if (prevCol !== receivingCol) {
        // If dropping on an illegal position and not starting position
        sounds.illegal.play();
        setAnimation({
          x: e.delta.x,
          y: e.delta.y,
          id: e.active.id,
        });
      } else {
        // Plays on dropping on own position
        sounds.release.play();
        setAnimation({
          x: e.delta.x,
          y: e.delta.y,
          id: e.active.id,
        });
      }
    } else {
      sounds.release.play();
      setAnimation({
        x: e.delta.x,
        y: e.delta.y,
        id: e.active.id,
      });
    }
  };

  const [showDeal, setShowDeal] = useState(false);

  // Add a card to each column from spares deck
  const addSpares = () => {
    // If a column has no cards don't add spares
    for (let col of cards) {
      if (!col.length) {
        sounds.illegal.play();
        return;
      }
    }

    // If out of spares return
    if (!spareCards.length) {
      return;
    }

    // If still in previous animation return
    if (showDeal) {
      return;
    }

    setShowDeal(true);

    setTimeout(() => {
      setShowDeal(false);
    }, 1300);

    sounds.deal.play();

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
  };

  const startNewGame = () => {
    // If still in previous animation return
    if (showDeal) {
      return;
    }

    // Add to games played if game was not won
    if (!showEnd && moves > 10) {
      setGamesPlayed(gamesPlayed + 1);
      localStorage.setItem(`played${suites}`, gamesPlayed + 1);
    }

    const { hiddenCards, topCards, spareCards } = generateCards(suites);

    // Reset all state
    setShowEnd(false);
    setHiddenCards(hiddenCards);
    setCards(topCards);
    setSpareCards(spareCards);
    setCompleted([]);
    setScore(500);
    setMoves(0);
    setAnimation({ x: 0, y: 0, id: "" });
    setKingAnimation({
      x: 0,
      y: 0,
      cardWidth: 0,
    });
    setSparePosition({});
    setShowDeal(true);

    sounds.deal.play();

    setTimeout(() => {
      setShowDeal(false);
    }, 1300);
  };

  return (
    <div className="App">
      {!suites && <SuitesSelector setSuites={setSuites} />}
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
                  <CardColumn
                    column={column}
                    colNum={index}
                    animation={animation}
                    sparePosition={sparePosition}
                    showDeal={showDeal}
                  />
                </Droppable>
              </div>
            );
          })}
        </div>
      </DndContext>
      <BottomBar
        completed={completed}
        showEnd={showEnd}
        showFireworks={showFireworks}
        score={score}
        startNewGame={startNewGame}
        moves={moves}
        addSpares={addSpares}
        spareCards={spareCards}
        kingAnimation={kingAnimation}
        setSparePosition={setSparePosition}
        suites={suites}
      />

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
