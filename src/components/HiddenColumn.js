import React from "react";

const HiddenColumn = ({ hiddenCards, index }) => {
  return (
    <React.Fragment>
      {hiddenCards[index].map((card, i) => (
        <div key={"hidden" + index + i} className="hidden-card"></div>
      ))}
    </React.Fragment>
  );
};

export default HiddenColumn;
