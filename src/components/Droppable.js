import { useDroppable } from "@dnd-kit/core";
import React from "react";

const Droppable = (props) => {
  const { setNodeRef } = useDroppable({
    id: props.id,
    data: props.data,
  });

  return (
    <div ref={setNodeRef} className="droppable-column">
      {props.children}
    </div>
  );
};

export default Droppable;
