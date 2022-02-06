import React, { useRef, useCallback } from "react";
import "./BottomBar.css";
import { motion } from "framer-motion";
import getSuite from "../functions/getSuite";

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
  suites,
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
