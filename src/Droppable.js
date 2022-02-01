import { useDroppable } from "@dnd-kit/core";
import React from "react";

const Droppable = (props) => {
  const { isOver, setNodeRef } = useDroppable({ id: props.id });

  const style = {
    backgroundColor: isOver ? "green" : "gray",
  };
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
};

export default Droppable;
