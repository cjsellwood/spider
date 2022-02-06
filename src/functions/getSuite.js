const getSuite = (n) => {
  if (n <= 13) {
    return "spades";
  } else if (n <= 26) {
    return "hearts";
  } else if (n <= 39) {
    return "clubs";
  } else {
    return "diamonds";
  }
};

export default getSuite;
