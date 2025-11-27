import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/crossword-ai-webllm/", // your repo name
  plugins: [vue()],
});
