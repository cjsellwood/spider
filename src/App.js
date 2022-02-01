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
    [13, 12, 11, 10, 9, 8, 7, 6, 5],
    [9, 8, 7, 6],
    [9, 8, 7],
    [9, 8],
    [10],
  ]);

  const duplicateCards = () => {
    return cards.map((col) => [...col]);
  };

  const handleDragEnd = (e) => {
    const { over } = e;
    if (over) {
      const receivingCol = e.over.data.current.receivingCol;
      const receivingCard = cards[receivingCol].at(-1);

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
    </div>
  );
}

export default App;
