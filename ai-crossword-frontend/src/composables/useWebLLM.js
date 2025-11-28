export function useWebLLM(initProgressCallback) {
  let engine = null;

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

  async function generateWords(theme, numWords = 8) {
    await initModel();
    const prompt = `
Generate ${numWords} crossword-friendly words related to the theme "${theme}", the words should be in Dutch. Return only a plain json array (no line breaks, nothing besides the values asked) with words and a short clue (in Dutch) for them, the keys used in each object should be 'word' and 'clue'. 
Do not output anything else besides the json array. 
Each object in the array should look like this: {"word": "example", "clue": "this is an example clue"}
Example output: [
{"word": "SNEEUW", "clue": "Winterse neerslag"},
{"word": "KROON", "clue": "Winterse taktoppervorm"},
{"word": "SCHIET", "clue": "Koud en vochtig winterweer"},
{"word": "KOMFORT", "clue": "Warmte en veiligheid tijdens de winter"},
{"word": "SKIEN", "clue": "Populaire wintersport"},
{"word": "VRIJ", "clue": "Winterse dag zonder sneeuw"},
{"word": "KONDENS", "clue": "Winterse lucht die condensatie veroorzaakt"},
{"word": "JACQUEZ", "clue": "Wintersportuitrusting voor ijskunst"}
]
`;
    const messages = [
      { role: "system", content: "You are a helpful assistant that generates crossword words for website, you act as an API that returns a json array as specified by the user" },
      { role: "user", content: prompt },
    ];

    const text = await engine.chat.completions.create({ messages });
    const reply = text.choices[0].message.content;
    console.log(reply);
    console.log(JSON.parse(reply));
    return JSON.parse(reply);
  }

  return { generateWords };
}
