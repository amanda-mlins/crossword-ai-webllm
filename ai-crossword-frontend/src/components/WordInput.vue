<template>
  <div class="p-4 bg-white rounded-xl shadow-md mb-4">
    <h2 class="text-lg font-semibold mb-2">Create a Crossword in Dutch</h2>
    <div class="mb-2">
      <label class="block text-sm font-medium">Give me a theme</label>
      <input
        v-model="theme"
        :class="['w-full border p-2 rounded', validationErrors.length ? 'border-red-500' : '']"
        placeholder="e.g., Summer, vacations, Christmas"
        :aria-invalid="validationErrors.length > 0"
        aria-describedby="theme-errors"
      />
      <div id="theme-errors" class="mt-2 text-sm text-red-600" aria-live="polite">
        <ul v-if="validationErrors.length">
          <li v-for="(err, idx) in validationErrors" :key="idx">{{ err }}</li>
        </ul>
      </div>
    </div>
    <button
      @click="generate"
      :class="[
        'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700',
        (modelLoading || loading || !isValid ) ? 'opacity-50 cursor-not-allowed' : ''
      ]"
      :disabled="modelLoading || loading || !isValid"
    >
      {{ modelLoading || loading ? "Loading..." : "Generate Crossword" }}
    </button>
    <p id="loading_msg"></p>
  </div>
</template>

<script setup>
import { ref, defineEmits, computed, watch } from "vue";
import { createCrossword } from "./crossword_solver.js";
import { useWebLLM } from "../composables/useWebLLM.js";

const theme = ref("");
const loading = ref(false);
const validationErrors = ref([]);

const isValid = computed(() => validationErrors.value.length === 0 && theme.value.trim().length > 0);

function validateTheme() {
  const val = theme.value ? theme.value.trim() : "";
  const errors = [];
  if (!val) {
    errors.push("Theme is required.");
  }
  if (val && val.length < 3) {
    errors.push("Theme must be at least 3 characters.");
  }
  if (val && val.length > 100) {
    errors.push("Theme must be 100 characters or fewer.");
  }
  // Disallow weird control characters
  if (val && /[\x00-\x1F]/.test(val)) {
    errors.push("Theme contains invalid characters.");
  }
  validationErrors.value = errors;
}

watch(theme, () => {
  validateTheme();
});
const initProgressCallback = (report) => {
    const loadingMsg = document.getElementById("loading_msg");
    const progress = (report.progress || 0) * 100;
    loadingMsg.textContent = progress.toFixed() + "% model loading... (First load may take a while, after refresh it's usually much faster)";
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
  validateTheme();
  if (!isValid.value) return;
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
    result.theme = theme.value;
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
