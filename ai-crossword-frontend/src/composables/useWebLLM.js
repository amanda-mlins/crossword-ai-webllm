export function useWebLLM() {
  let engine = null;

  // Initialize with a progress callback
  const initProgressCallback = (progress) => {
     console.log("Model loading progress:", progress);
  };

  async function initModel() {
      if (!window.webllm) {
        throw new Error(
          'WebLLM is not loaded. Make sure the WebLLM script is included in your HTML.'
        );
      }
      if (!engine) {
        engine = await window.webllm.CreateMLCEngine("Llama-3-8B-Instruct-q4f32_1-MLC-1k", { initProgressCallback });
      }
    }

  async function generateWords(theme, numWords = 12) {
    await initModel();
    const prompt = `
Generate ${numWords} crossword-friendly words related to the theme "${theme}", the words should be in Dutch, return only the words, one by line, no extra text or numbers.
`;
    const messages = [
      { role: "system", content: "You are a helpful assistant that generates crossword words for website, you act as an API that returns just the words, one by line" },
      { role: "user", content: prompt },
    ];

    const text = await engine.chat.completions.create({ messages });
    const reply = text.choices[0].message.content
    console.log(text.choices[0].message);
    console.log(text.usage);
    return reply
      .split("\n")
      .map(w => w.trim())
      .filter(w => w.length > 0);
  }

  return { generateWords };
}
