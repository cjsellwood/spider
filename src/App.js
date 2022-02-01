import React, { useEffect, useState } from "react";
import "./App.css";
import { DndContext } from "@dnd-kit/core";
import { v4 as uuidv4 } from "uuid";
import Droppable from "./Droppable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import CardColumn from "./components/CardColumn";
import HiddenColumn from "./components/HiddenColumn";
import useCardGenerator from "./hooks/useCardGenerator";

function App() {
  const [hiddenCards, setHiddenCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [spareCards, setSpareCards] = useState([]);
  const [completed, setCompleted] = useState(0);

  const [generateCards] = useCardGenerator();
  useEffect(() => {
    const { hiddenCards, topCards, spareCards } = generateCards();
    setHiddenCards(hiddenCards);
    setCards(topCards);
    setSpareCards(spareCards);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

    if (index !== -1) {
      setCompleted(completed + 1);
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
      }
    } else {
      console.log("OUTSIDE");
    }
  };

  // Add a card to each column from spares deck
  const addSpares = () => {
    const newCards = duplicateNested(cards);
    const newSpares = duplicateNested(spareCards);
    for (let i = 0; i < newCards.length; i++) {
      newCards[i].push(newSpares[0][i]);
    }
    setSpareCards(newSpares.slice(1));
    setCards(newCards);
  };

  return (
    <div className="App">
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
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
        <h1 className="sets">{completed}/8</h1>
        <div onClick={() => addSpares()} className="spares-container">
          {spareCards.map((spare, i) => (
            <div key={"spare" + i} className="spare-card"></div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
