import CardContainer from "./CardContainer";

const CardColumn = ({ column, colNum, animation }) => {
  return (
    <CardContainer
      cardColumn={column}
      cardRow={0}
      colNum={colNum}
      colLength={column.length}
      animation={animation}
    />
  );
};

export default CardColumn;
