import { useDroppable } from "@dnd-kit/core";
import React from "react";

const Droppable = (props) => {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
    data: props.data,
  });

  const style = {
    backgroundColor: isOver ? "green" : "transparent",
  };
  return (
    <div ref={setNodeRef} style={style} className="droppable-column">
      {props.children}
    </div>
  );
};

export default Droppable;
