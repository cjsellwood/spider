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
  ]);

  const handleDragEnd = (e) => {
    console.log(e);
    const { over } = e;
    if (over) {
    } else {
    }
  };

  return (
    <div className="App">
      <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToWindowEdges]}>
        <div id="columns">
          {cards.map((column, index) => {
            return (
              <Droppable key={"column" + index} id={"column" + index}>
                <CardColumn column={column} />
              </Droppable>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}

export default App;
