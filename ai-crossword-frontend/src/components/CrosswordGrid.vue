<template>
  <div v-if="grid && grid.length" class="inline-block border border-gray-400">
    <table class="border-collapse">
      <thead>
      <tr>
        <th class="w-8 h-8"></th>
        <th
          v-for="(_, c) in grid[0]"
          :key="'col-' + c"
          class="w-8 h-8 text-center border border-gray-400 bg-gray-100 font-mono"
        >
          {{ c + 1 }}
        </th>
      </tr>
      </thead>
      <tbody>
       <tr v-for="(row, r) in grid" :key="r">
          <!-- Row number -->
          <th
            class="w-8 h-8 text-center border border-gray-400 bg-gray-100 font-mono"
          >
            {{ r + 1 }}
          </th>

          <!-- Actual crossword cells -->

          <td 
            v-for="(cell, c) in row"
            :key="c"
            class="w-8 h-8 text-center border border-gray-400 font-mono"
            :class="[
                          cell.value ? 'bg-yellow-50' : 'bg-gray-200',
                          isHighlighted(r, c) || isHovered(r,c) ? 'outline outline-2 outline-blue-500' : ''
                        ]"
          @mouseenter="$emit('hoverWord', { row: r, column: c} )" @mouseleave="$emit('leaveWord')" >
            {{ showLetter(r, c) }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <p v-else class="text-gray-500">No crossword generated yet.</p>
</template>

<script setup>
const props = defineProps({
  grid: Array,
  highlightedClueKey: String,
  revealedClues: Object, // a Set of revealed clue keys
  clues: Object,
  highlightedCluesWord : Array
});

function isHovered(r,c) {
  if(!props.highlightedCluesWord) return false;
  for(const word of props.highlightedCluesWord){
    const clue = props.clues[word];
    if(clue.position === "H"){
      const row = clue.start;
      const startCol = clue.end;
      const endCol = clue.end + clue.word.length - 1;
      if(r === row && c >= startCol && c <= endCol){
        return true;
      }
    } else {
      const col = clue.end;
      const startRow = clue.start;
      const endRow = clue.start + clue.word.length - 1;
      if(c === col && r >= startRow && r <= endRow){
        return true;
      }
    }
  }
  return false;
}

// Function to check whether a cell should be highlighted
function isHighlighted(r, c) {
  if (!props.highlightedClueKey) return false;

  const clue = props.clues[props.highlightedClueKey];
  if (!clue) return false;

  if (clue.position === "H") {
    const row = clue.start; // row index
    const startCol = clue.end; // starting column
    const endCol = clue.end + clue.word.length - 1; // last column

    return r === row && c >= startCol && c <= endCol;
  }

    if (clue.position === "V") {
      const startRow = clue.start; // row index
      const endRow = clue.start + clue.word.length - 1;; // row index
      const col = clue.end; // starting column

      return c === col && r >= startRow && r <= endRow;
    }


  return false;
}

function showLetter(r, c) {
  for (const [key, clue] of Object.entries(props.clues)) {
    if (!props.revealedClues.has(key)) continue;
    if (clue.position === "H") {
      const row = clue.start;
      const startCol = clue.end;
      const endCol = clue.end + clue.word.length - 1;

      if (r === row && c >= startCol && c <= endCol) {
        // Calculate the letter index in the word
        const index = c - startCol;
        return clue.word[index];
      }
    } else {
      const col = clue.end;
      const startRow = clue.start;
      const endRow = clue.start + clue.word.length - 1;
      if (c === col && r >= startRow && r <= endRow) {
        // Calculate the letter index in the word
        const index = r - startRow;
        return clue.word[index];
      }
    }
  }

  // Otherwise, show ? if cell has a value, else empty
  let val = props.grid[r][c].value;
  return val ? val == ' ' ? "" : "?" : "X";
}
</script>

