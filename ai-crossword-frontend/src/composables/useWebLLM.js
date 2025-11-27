export function useWebLLM() {
  let chat = null;

  async function initModel() {
    if (!chat) {
      chat = await window.webllm.CreateWebLLMChat({
        model: "Llama-3.2-1B-Instruct-q4f16_1"
      });
    }
  }

  async function generateWords(theme, numWords = 12) {
    await initModel();
    const prompt = `
Generate ${numWords} crossword-friendly words related to the theme "${theme}".
Return only the words, one per line.
`;
    const text = await chat.generate(prompt);
    return text
      .split("\n")
      .map(w => w.trim())
      .filter(w => w.length > 0);
  }

  return { generateWords };
}
