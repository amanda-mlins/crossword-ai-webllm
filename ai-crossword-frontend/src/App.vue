<template>
  <div class="p-6 bg-gray-50 min-h-screen text-gray-800">
    <h1 class="text-2xl font-bold mb-4 text-center">
      🧩 AI Crossword WebLLM
    </h1>

    <div class="p-4 bg-white rounded-xl shadow-md mb-4">
      <input v-model="theme" placeholder="Enter theme" class="w-full border p-2 rounded mb-2" />
      <button @click="generatePuzzle" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" :disabled="loading">
        {{ loading ? "Generating..." : "Generate Crossword" }}
      </button>
    </div>

    <div class="flex justify-center mt-6" v-if="grid">
      <table class="border-collapse border border-gray-400">
        <tbody>
          <tr v-for="(row,r) in grid" :key="r">
            <td v-for="(cell,c) in row" :key="c" class="w-8 h-8 text-center border border-gray-400 font-mono" :class="cell ? 'bg-yellow-50' : 'bg-gray-200'">
              {{ cell || "" }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useWebLLM } from "./composables/useWebLLM";
import { createCrossword } from "./crossword_generator.js";

const theme = ref("");
const grid = ref(null);
const placedWords = ref([]);
const loading = ref(false);

const { generateWords } = useWebLLM();

async function generatePuzzle() {
  if (!theme.value) return alert("Please enter a theme");
  loading.value = true;
  try {
    const words = await generateWords(theme.value);
    const { grid: g, placed } = createCrossword(words, 15);
    grid.value = g;
    placedWords.value = placed;
  } catch (err) {
    console.error(err);
    alert("Failed to generate crossword");
  } finally {
    loading.value = false;
  }
}
</script>
