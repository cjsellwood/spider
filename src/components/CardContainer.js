import Draggable from "../Draggable";

const shouldItDrag = (cardColumn) => {
  let isCorrectOrder = true;
  const correctOrder = [];
  for (let i = Math.max(...cardColumn); i >= Math.min(...cardColumn); i--) {
    correctOrder.push(i);
  }
  for (let i = 0; i < correctOrder.length; i++) {
    if (correctOrder[i] !== cardColumn[i]) {
      isCorrectOrder = false;
    }
  }
  return isCorrectOrder;
};

const CardContainer = ({ cardColumn, cardRow, colNum }) => {
  if (!cardColumn[0]) {
    return null;
  }
  return (
    <Draggable
      id={`${colNum} ${cardRow}`}
      disabled={!shouldItDrag(cardColumn)}
    >
      <div className="card-container">
        <div className="card">{cardColumn[0]}</div>
        <CardContainer
          cardColumn={cardColumn.slice(1)}
          cardRow={cardRow + 1}
          colNum={colNum}
        ></CardContainer>
      </div>
    </Draggable>
  );
};

export default CardContainer;
