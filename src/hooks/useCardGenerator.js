const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    const currentCard = array[i];
    const cardToSwap = array[swapIndex];
    array[i] = cardToSwap;
    array[swapIndex] = currentCard;
  }
};

const useCardGenerator = () => {
  const cards = [];
  for (let i = 0; i < 8; i++) {
    for (let j = 1; j <= 13; j++) {
      cards.push(j);
    }
  }

  const generateCards = () => {
    shuffleArray(cards);

    // Set 40 hidden cards
    const hiddenCards = [];
    for (let i = 0; i < 10; i++) {
      const inner = [];
      for (let j = 0; j < 4; j++) {
        inner.push(cards.shift());
      }
      hiddenCards.push(inner);
    }

    // Set top cards
    const topCards = [];
    for (let i = 0; i < 10; i++) {
      topCards.push([cards.shift()]);
    }

    // Set spare cards
    const spareCards = [];
    for (let i = 0; i < 5; i++) {
      const inner = [];
      for (let j = 0; j < 10; j++) {
        inner.push(cards.shift());
      }
      spareCards.push(inner);
    }

    return {
      hiddenCards,
      topCards,
      spareCards,
      cards,
    };
  };

  return [generateCards];
};

export default useCardGenerator;