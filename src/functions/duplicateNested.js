// Duplicate nested arrays immutably
const duplicateNested = (array) => {
  return array.map((col) => [...col]);
};

export default duplicateNested;
