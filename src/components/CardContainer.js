import Draggable from "../Draggable";
import { v4 as uuidv4 } from "uuid";

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

const CardContainer = ({ cardColumn, cardRow, colNum, colLength }) => {
  if (!cardColumn[0]) {
    return null;
  }

  return (
    <Draggable
      id={uuidv4()}
      data={{
        prevCol: colNum,
        prevRow: cardRow,
      }}
      // id={`${colNum} ${cardRow}`}
      disabled={!shouldItDrag(cardColumn)}
    >
      <div className="card-container">
        <div
          className={`card card${cardColumn[0]} ${
            colLength > 10 ? "squeezed" : ""
          }`}
        >
          {cardColumn[0]}
        </div>
        <CardContainer
          cardColumn={cardColumn.slice(1)}
          cardRow={cardRow + 1}
          colNum={colNum}
          colLength={colLength}
        ></CardContainer>
      </div>
    </Draggable>
  );
};

export default CardContainer;
