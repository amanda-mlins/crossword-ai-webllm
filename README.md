# Crossword-AI-WebLLM 🧩

Generate themed crossword puzzles entirely in your browser, using a small local LLM — no backend, no API keys, and free to deploy on GitHub Pages.

## 🔎 What is this

Crossword-AI-WebLLM is a fully client-side crossword puzzle generator.  
- The app uses a small open-source LLM running in the browser via WebLLM to **generate a list of words based on a user-provided theme**.  
- Then — using a built-in JS crossword algorithm — it builds a puzzle grid from those words.  
- Everything runs in the browser: **no server, no external API calls, no cost**.  
- The project is ideal for hosting on static-site platforms such as GitHub Pages.

Try it live: [https://amanda-mlins.github.io/crossword-ai-webllm/](https://amanda-mlins.github.io/crossword-ai-webllm/)

## ✅ Features

- 🧠 Theme-based word generation using a small, in-browser LLM  
- ⚙️ Crossword grid generation purely in JavaScript  
- 📦 No backend — fully static client-side app  
- 🌍 Easily deployable on GitHub Pages or any static host  
- 🔄 Fast generation: from theme to puzzle in seconds  

## 🚀 Getting Started (Local Development)

```bash
git clone https://github.com/amanda-mlins/crossword-ai-webllm.git
cd crossword-ai-webllm/ai-crossword-frontend
npm install
npm run dev
Then open http://localhost:5173 in your browser.
```

You can also build for production:

```bash
npm run build
```
📦 Deployment (GitHub Pages)
The project is configured to work with GitHub Pages.

Make sure your vite.config.js uses the correct base path, e.g.:

```js
base: "/crossword-ai-webllm/"
```
To deploy, run:

```bash
Copy code
npm run build
npm run deploy
```
This will publish the contents of ai-crossword-frontend/dist/ to the gh-pages branch.

🧠 How It Works (Under the Hood)
On first load, the browser fetches and initializes a small LLM (currently Llama-3.2-1B-Instruct, quantized for WebGPU) using WebLLM.

When you enter a theme and click “Generate”, the app sends a prompt to the local LLM.

The LLM returns a list of words — e.g. for “summer”: beach, sun, vacation, sand, surf, ...

These words are passed to a JavaScript crossword generator (crossword_generator.js) which builds a grid.

The resulting grid is displayed to the user directly in the browser.

This means all generation happens locally, without contacting any server.

📁 Project Structure
```pgsql
Copy code
crossword-ai-webllm/
├── ai-crossword-frontend/         # Vue + Vite frontend
│   ├── index.html                # Entry HTML (includes WebLLM)
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.js
│   │   ├── App.vue               # Main UI and logic
│   │   ├── composables/
│   │   │   └── useWebLLM.js       # Wrapper for in-browser LLM
│   │   └── crossword_generator.js # JS crossword generator
└── .github/workflows/deploy.yml   # GitHub Actions for auto-deploy
```
📄 License
This project is MIT-licensed. Feel free to use, modify, and redistribute under the terms of the MIT License.

🤝 Contributing
Pull requests, bug reports, or suggestions are very welcome!
Here’s how you can help:

Fork the repository.

Create a feature branch: git checkout -b my-feature.

Make your changes.

Create a pull request describing your changes.

Please make sure your changes do not break existing functionality (especially crossword generation and LLM prompt logic).

# AI Crossword WebLLM

Generate themed crossword puzzles entirely in the browser using a small WebLLM model.

## Run locally

```bash
cd ai-crossword-frontend
npm install
npm run dev
```
Open http://localhost:5173 in your browser.

### Build and deploy
```bash
npm run build
npm run deploy
```

Deployed to GitHub Pages: https://yourusername.github.io/crossword-ai-webllm/

Check the example on my page: https://amanda-mlins.github.io/crossword-ai-webllm/ 
