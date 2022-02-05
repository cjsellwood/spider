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
  sparePosition,
  spares,
  showDeal,
  columnRef,
}) => {
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState(uuidv4());

  if (!cardColumn[0]) {
    return null;
  }

  let animateX = 0;
  let animateY = 0;
  let duration = 0;
  let delay = 0;
  // Animation for releasing card
  if (id === animation.id) {
    animateX = animation.x;
    animateY = animation.y;
    duration = 0.25;
    delay = 0;
  }

  // Animation for dealing cards
  if (!cardColumn[1] && columnRef.current && showDeal) {
    animateX = sparePosition.left - columnRef.current.offsetParent.offsetLeft;
    animateY =
      sparePosition.top -
      columnRef.current.offsetParent.offsetTop -
      columnRef.current.offsetTop -
      columnRef.current.offsetHeight +
      columnRef.current.offsetWidth * 1.5 * 0.81;

    duration = 0.5;
    delay = (10 - colNum) * 0.08;
  }

  return (
    <Draggable
      id={id}
      data={{
        prevCol: colNum,
        prevRow: cardRow,
      }}
      disabled={!shouldItDrag(cardColumn) || showDeal}
    >
      <motion.div
        className="card-container"
        animate={{ x: [animateX, 0], y: [animateY, 0] }}
        transition={{
          duration: duration,
          delay: delay,
        }}
        style={
          id === animation.id || showDeal
            ? { zIndex: "50", position: "relative" }
            : {}
        }
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
          sparePosition={sparePosition}
          spares={spares}
          showDeal={showDeal}
          columnRef={columnRef}
        ></CardContainer>
      </motion.div>
    </Draggable>
  );
};

export default CardContainer;
