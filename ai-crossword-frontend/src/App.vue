<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-2xl font-bold mb-4 text-center">
      🧩 AI Crossword Puzzle Maker
    </h1>
    <WordInput @generated="handleResult" />
    <div class="flex justify-center mt-6">
      <CrosswordGrid v-if="grid" :grid="grid" :clues="clues" :highlightedClueKey="highlightedClueKey" :revealedClues="revealedClues" />
    </div>
    <div class="flex justify-center mt-6">
      <ClueGrid v-if="clues" :clues="clues" @hoverClue="highlightedClueKey = $event"
                                                @leaveClue="highlightedClueKey = null" @revealClue="revealClue"  />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useWebLLM } from "./composables/useWebLLM";

import CrosswordGrid from "./components/CrosswordGrid.vue";
import ClueGrid from "./components/Clues.vue";
import WordInput from "./components/WordInput.vue";

const grid = ref(null);
const clues = ref(null);
const highlightedClueKey = ref(null);
const revealedClues = ref(new Set());

function revealClue(key) {
  console.log("Toggling reveal for clue key:", key);
  if(!revealedClues.value.has(key)){
    revealedClues.value.add(key);
  } else {
    revealedClues.value.delete(key);
  }
  console.log("Revealed clues set:", revealedClues.value);
}

function gridState(item, index) {
  console.log(item + "," + index)
  const elem = { value: item, discovered: false }
}

function handleResult(result) {

  const original = result.grid.map(row =>
                                row.map(str => ({
                                  value: str,
                                  status: str === "" ? "empty" : "hidden"
                                })))

  grid.value = original;
  
  let clueDict = {};
  for (const clue of result.clues) {
    clueDict[clue.word] = clue;
  }
  clues.value = clueDict;
  console.log("Clues set in App.vue:", clues.value);
  revealedClues.value = new Set();
}

</script>


