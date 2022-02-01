import CardContainer from "./CardContainer";

const CardColumn = ({ column, colNum, hiddenColumn }) => {
  return (
    <div>

      <CardContainer cardColumn={column} cardRow={0} colNum={colNum} />
    </div>
  );
};

export default CardColumn;
