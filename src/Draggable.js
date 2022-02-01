import { useDraggable } from "@dnd-kit/core";
import React from "react";

const Draggable = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    disabled: props.disabled,
    data: props.data
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </div>
  );
};

export default Draggable;
