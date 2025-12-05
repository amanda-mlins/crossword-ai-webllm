<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-2xl font-bold mb-4 text-center">
      🧩 AI Crossword Puzzle Maker
    </h1>
    <WordInput @generated="handleResult" :theme />
    <div class="flex justify-center w-full">
      <div class="flex justify-center w-1/2 flex-col items-center">
        <h1 v-if="grid" class="text-2xl font-bold mb-4 text-center"> Crossword Puzzle for theme: {{ theme }} </h1>
        <CrosswordGrid v-if="grid" :grid="grid" :clues="clues" :highlightedClueKey="highlightedClueKey"
          :highlightedCluesWord="highlightedCluesWord" :revealedClues="revealedClues"
          @hoverWord="highlightedPosition = $event" @leaveWord="highlightedPosition = {}" />
      </div>
      <div class="flex justify-center w-1/2 flex-col items-center">
        <h1 v-if="clues" class="text-2xl font-bold mb-4 text-center"> Clues </h1>
        <p v-if="clues" class="text-orange-500">Hover to see position, click to reveal word</p>
        <ClueGrid v-if="clues" :clues="clues" :highlightedPosition="highlightedPosition"
          :highlightedCluesWord="highlightedCluesWord" @hoverClue="highlightedClueKey = $event"
          @leaveClue="highlightedClueKey = null" @revealClue="revealClue" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import CrosswordGrid from "./components/CrosswordGrid.vue";
import ClueGrid from "./components/Clues.vue";
import WordInput from "./components/WordInput.vue";

const grid = ref(null);
const clues = ref(null);
const highlightedClueKey = ref(null);
const revealedClues = ref(new Set());
const highlightedPosition = ref(null);
const highlightedCluesWord = ref(null);
const theme = ref("");

function revealClue(key) {
  if (!revealedClues.value.has(key)) {
    revealedClues.value.add(key);
  } else {
    revealedClues.value.delete(key);
  }
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
  revealedClues.value = new Set();
  highlightedCluesWord.value = [];
  theme.value = result.theme;
}

</script>
