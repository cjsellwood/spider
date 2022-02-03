import React from "react";
import { Fireworks } from "fireworks-js/dist/react";
import firework1MP3 from "../sounds/firework1.mp3";
import firework2MP3 from "../sounds/firework2.mp3";
import firework3MP3 from "../sounds/firework3.mp3";

const FinishedGame = ({ setShowFireworks, setShowEnd }) => {
  const options = {
    hue: {
      min: 0,
      max: 345,
    },
    delay: {
      min: 20,
      max: 20,
    },
    rocketsPoint: 50,
    speed: 10,
    acceleration: 1.02,
    friction: 0.97,
    gravity: 1,
    particles: 150,
    trace: 8,
    explosion: 8,
    autoresize: true,
    brightness: {
      min: 50,
      max: 80,
      decay: {
        min: 0.01,
        max: 0.01,
      },
    },
    sound: {
      enabled: true,
      files: [firework1MP3, firework2MP3, firework3MP3],
      volume: {
        min: 90,
        max: 100,
      },
    },
  };

  const style = {
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    position: "fixed",
    background: "transparent",
    zIndex: 20,
  };
  return (
    <div
      onClick={() => {
        setShowFireworks(false);
        setShowEnd(true);
      }}
    >
      <Fireworks options={options} style={style} />
    </div>
  );
};

export default FinishedGame;
