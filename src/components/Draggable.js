import { useDraggable } from "@dnd-kit/core";
import React from "react";


const Draggable = (props) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: props.id,
    disabled: props.disabled,
    data: props.data,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100,
        position: "absolute",
        touchAction: "none",
        width: "100%",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      className="draggable"
      style={style}
      {...listeners}
      {...attributes}
    >
      {props.children}
    </div>
  );
};

export default Draggable;
