import React, { useRef, useCallback } from "react";
import "./BottomBar.css";
import { motion } from "framer-motion";
import getSuite from "../functions/getSuite";
import { ReactComponent as RestartIcon } from "../images/restart.svg";

const BottomBar = ({
  completed,
  showEnd,
  showFireworks,
  score,
  startNewGame,
  moves,
  addSpares,
  spareCards,
  kingAnimation,
  setSparePosition,
}) => {
  const ref = useRef();

  // Get position of spare card to animate dealing from it
  const spareRef = useCallback(
    (node) => {
      if (node !== null) {
        setSparePosition({ left: node.offsetLeft, top: node.offsetTop });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setSparePosition, spareCards]
  );

  return (
    <footer>
      <div className="completed-container" ref={ref}>
        {completed.map((card, i) => {
          let xAnimate = 0;
          let yAnimate = 0;
          if (i === completed.length - 1 && ref.current) {
            xAnimate =
              -ref.current.offsetLeft -
              ref.current.offsetWidth +
              -i * 0.2 * kingAnimation.cardWidth +
              kingAnimation.x;
            yAnimate =
              -ref.current.offsetTop -
              ref.current.offsetHeight +
              kingAnimation.y;
          }
          return (
            <motion.div
              key={"completed" + i}
              className={`completed-card ${getSuite(card)}${
                ((card - 1) % 13) + 1
              }`}
              style={{ zIndex: `${i}` }}
              initial={{ x: 0, y: 0 }}
              animate={{
                x: [xAnimate, 0],
                y: [yAnimate, 0],
              }}
              transition={{ duration: 0.5 }}
            ></motion.div>
          );
        })}
      </div>
      <div className={`info-container ${(showEnd || showFireworks) && "hide"}`}>
        <div>
          <p>Score: {score}</p>
          <button title="New Game" onClick={() => startNewGame()}>
            <RestartIcon />
          </button>
          <p>Moves: {moves}</p>
        </div>
      </div>
      <div className="spares-container">
        {spareCards.map((spare, i) => (
          <div
            key={"spare" + i}
            ref={i === 0 ? spareRef : null}
            onClick={() => addSpares()}
            className="spare-card"
            style={{ zIndex: `${10 - i}` }}
          ></div>
        ))}
      </div>
    </footer>
  );
};

export default BottomBar;
