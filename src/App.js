import { useState } from "react";
import "./App.css";
import { DndContext } from "@dnd-kit/core";
import Droppable from "./Droppable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import CardColumn from "./components/CardColumn";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [cards, setCards] = useState([
    [6],
    [2, 7, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    [9, 8, 7, 6],
    [9, 8, 7],
    [9, 8],
    [10, 2],
  ]);
  const [completed, setCompleted] = useState(0);

  const duplicateCards = () => {
    return cards.map((col) => [...col]);
  };

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
    console.log(index);
    if (index !== -1) {
      setCompleted(completed + 1);
      return cardCol.slice(0, index);
    }
    return cardCol;
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

      if (receivingCard - 1 === addCard) {
        const newCards = duplicateCards();

        // Add new cards to receiving column
        newCards[receivingCol] = [
          ...newCards[receivingCol],
          ...newCards[prevCol].slice(prevRow),
        ];

        // Remove added card from previous column
        newCards[prevCol] = newCards[prevCol].slice(0, prevRow);

        // Check for completed sets and remove any found
        newCards[receivingCol] = checkForSets(newCards[receivingCol]);

        setCards(newCards);
      }
    } else {
      console.log("OUTSIDE");
    }
  };

  return (
    <div className="App">
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <div id="columns">
          {cards.map((column, index) => {
            return (
              <Droppable
                key={"column" + index}
                id={uuidv4()}
                data={{ receivingCol: index }}
              >
                <CardColumn column={column} colNum={index} />
              </Droppable>
            );
          })}
        </div>
      </DndContext>
      <h1>{completed}</h1>
    </div>
  );
}

export default App;
