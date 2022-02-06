import React from "react";
import "./SuitesSelector.css";
import spades from "../images/spades.svg";
import hearts from "../images/hearts.svg";
import clubs from "../images/clubs.svg";
import diamonds from "../images/diamonds.svg";

const SuitesSelector = ({ setSuites }) => {
  return (
    <div className="suites-container">
      <div>
        {/* <h1>Select Suites</h1> */}
        <div className="suites-buttons">
          <button onClick={() => setSuites(1)}>
            <img src={spades} alt="spades" />
          </button>
          <button onClick={() => setSuites(2)}>
            <img src={spades} alt="spades" /> <img src={hearts} alt="hearts" />
          </button>
          <button onClick={() => setSuites(4)}>
            <img src={spades} alt="spades" /> <img src={hearts} alt="hearts" />
            <img src={clubs} alt="clubs" />
            <img src={diamonds} alt="diamonds" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuitesSelector;
