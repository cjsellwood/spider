import { useState } from "react";
import "./App.css";
import { DndContext } from "@dnd-kit/core";
import Droppable from "./Droppable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import CardColumn from "./components/CardColumn";

function App() {
  const [cards, setCards] = useState([
    [9, 8, 7, 6, 5],
    [9, 8, 7, 6],
    [9, 8, 7],
    [9, 8],
    [9]
  ]);

  const duplicateCards = () => {
    return cards.map((col) => [...col]);
  };

  const handleDragEnd = (e) => {
    const { over } = e;
    if (over) {
      const droppedCol = e.over.id;
      const receivingCard = cards[droppedCol].at(-1);
      console.log("dropped", e.over.id, receivingCard);
      const [addCol, addRow] = e.active.id.split(" ");
      const addCard = cards[addCol][addRow];
      console.log("dragged", addCol, addRow);
      if (receivingCard - 1 === addCard) {
        const newCards = duplicateCards();
        // Add new cards to receiving column
        newCards[droppedCol] = [
          ...newCards[droppedCol],
          ...newCards[addCol].slice(addRow),
        ];

        // Remove added card from previous column
        newCards[addCol] = [...newCards[addCol].slice(0, addRow)];
        setCards(newCards);
      }
    } else {
    }
  };

  return (
    <div className="App">
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <div id="columns">
          {cards.map((column, index) => {
            return (
              <Droppable key={"column" + index} id={index}>
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
