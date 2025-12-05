<template>
  <div class="p-4 bg-white rounded-xl shadow-md mb-4">
    <h2 class="text-lg font-semibold mb-2">Create a Crossword in Dutch</h2>
    <div class="mb-2">
      <label class="block text-sm font-medium">Give me a theme</label>
      <input
        v-model="theme"
        placeholder="e.g., Summer, vacations, Christmas"
        class="w-full border p-2 rounded"
      />
    </div>
    <button
      @click="generate"
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      :disabled="modelLoading || loading"
    >
      {{ modelLoading || loading ? "Loading..." : "Generate Crossword" }}
    </button>
    <p id="loading_msg"></p>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { createCrossword } from "./crossword_solver.js";
import { useWebLLM } from "../composables/useWebLLM.js";

const theme = ref("");
const loading = ref(false);
const initProgressCallback = (report) => {
    const loadingMsg = document.getElementById("loading_msg");
    loadingMsg.textContent = report.progress * 100 + "% model loading... (First load may take a while, after refresh it's usually much faster)";
    if (report.progress && report.progress == 1) {
      loadingMsg.textContent = "Model loaded successfully.";
      modelLoading.value = false;
    }
};

const crosswordCallback = (report) => {
    const loadingMsg = document.getElementById("loading_msg");
    loadingMsg.textContent = report.text;
};
const modelLoading = ref(true);
const { generateWords, initModel } = useWebLLM(initProgressCallback);
const emit = defineEmits(["generated"]);
initModel();



async function generate() {
  if (!theme.value) return alert("Please enter a theme");
  loading.value = true;
  let resultArray;
  let result;
  try {
    crosswordCallback({ text: "Generating words and clues..." });
    resultArray = await generateWords(theme.value);
    const words = resultArray.map(obj => obj.word);
    const clues = {};
    resultArray.forEach(obj => {
      clues[obj.word] = obj.clue;
    });
    console.log("Generated words:", words);
    console.log("Generated clues:", clues);
    crosswordCallback({ text: "Creating crossword layout..." });
    result = createCrossword(words, 15);
    const cluePositions = [];
    result.positions.forEach(position => {
      const word = position[0];
      const clue = clues[word] ? clues[word] : "No clue available";
      const start = position[1];
      const end = position[2];
      const direction = position[3];
      cluePositions.push( {
        "word" : word,
        "clue": clue,
        "start": start,
        "end": end,
        "position": direction
      });
    });
    result.clues = cluePositions;
    console.log("Crossword result:", result);
    crosswordCallback({ text: "" });
    emit("generated", result);
  } catch (err) {
    console.error(err);
    alert("Failed to generate crossword");
  } finally {
    loading.value = false;
  }
}
</script>
