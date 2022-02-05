import CardContainer from "./CardContainer";
import { useRef } from "react";

const CardColumn = ({
  column,
  colNum,
  animation,
  sparePosition,
  spares,
  showDeal,
}) => {
  const ref = useRef();
  return (
    <div ref={ref}>
      <CardContainer
        cardColumn={column}
        cardRow={0}
        colNum={colNum}
        colLength={column.length}
        animation={animation}
        sparePosition={sparePosition}
        spares={spares}
        showDeal={showDeal}
        columnRef={ref}
      />
    </div>
  );
};

export default CardColumn;
