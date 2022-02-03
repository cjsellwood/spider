import CardContainer from "./CardContainer";

const CardColumn = ({ column, colNum }) => {
  return <CardContainer cardColumn={column} cardRow={0} colNum={colNum} colLength={column.length} />;
};

export default CardColumn;