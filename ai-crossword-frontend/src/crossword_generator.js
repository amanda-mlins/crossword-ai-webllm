export function createCrossword(words, size = 15) {
  const grid = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => "")
  );

  const placed = [];

  function canPlace(word, x, y, horizontal) {
    for (let i = 0; i < word.length; i++) {
      const nx = horizontal ? x + i : x;
      const ny = horizontal ? y : y + i;
      if (nx >= size || ny >= size) return false;
      const cell = grid[ny][nx];
      if (cell && cell !== word[i]) return false;
    }
    return true;
  }

  function placeWord(word) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const horizontal = Math.random() > 0.5;
        if (canPlace(word, x, y, horizontal)) {
          for (let i = 0; i < word.length; i++) {
            const nx = horizontal ? x + i : x;
            const ny = horizontal ? y : y + i;
            grid[ny][nx] = word[i];
          }
          placed.push({ word, x, y, horizontal });
          return true;
        }
      }
    }
    return false;
  }

  words.forEach(placeWord);
  return { grid, placed };
}
