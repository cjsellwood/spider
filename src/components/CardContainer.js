import { useState } from "react";
import Draggable from "./Draggable";
import { v4 as uuidv4 } from "uuid";
import "./CardContainer.css";
import { motion } from "framer-motion";

const shouldItDrag = (cardColumn) => {
  let isCorrectOrder = true;
  const correctOrder = [];
  for (let i = Math.max(...cardColumn); i >= Math.min(...cardColumn); i--) {
    correctOrder.push(i);
  }
  for (let i = 0; i < cardColumn.length; i++) {
    if (correctOrder[i] !== cardColumn[i]) {
      isCorrectOrder = false;
    }
  }
  return isCorrectOrder;
};

const CardContainer = ({
  cardColumn,
  cardRow,
  colNum,
  colLength,
  animation,
}) => {
  const [id, setId] = useState(uuidv4());

  if (!cardColumn[0]) {
    return null;
  }

  let animateX = 0;
  let animateY = 0;
  if (id === animation.id) {
    console.log(animation, id);
    console.log();
    animateX = -animation.x;
    animateY = -animation.y;
  }

  return (
    <Draggable
      id={id}
      data={{
        prevCol: colNum,
        prevRow: cardRow,
      }}
      disabled={!shouldItDrag(cardColumn)}
    >
      <motion.div
        className="card-container"
        initial={{ x: 0, y: 0 }}
        animate={{ x: [-animateX, 0], y: [-animateY, 0] }}
        transition={{ duration: 0.25 }}
        style={id === animation.id ? { zIndex: "50", position: "relative"} : {}}
      >
        <div
          className={`card card${cardColumn[0]} ${
            colLength <= 10
              ? ""
              : colLength <= 15
              ? "squeezed"
              : colLength <= 20
              ? "extra-squeezed"
              : "ultra-squeezed"
          }`}
        ></div>
        <CardContainer
          cardColumn={cardColumn.slice(1)}
          cardRow={cardRow + 1}
          colNum={colNum}
          colLength={colLength}
          animation={animation}
        ></CardContainer>
      </motion.div>
    </Draggable>
  );
};

export default CardContainer;
