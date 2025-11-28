import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useWebLLM } from './useWebLLM';

describe('useWebLLM', () => {
  let mockChat;
  let mockWebLLM;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the WebLLM chat instance
    mockChat = {
      generate: vi.fn()
    };

    // Mock window.webllm
    mockWebLLM = {
      CreateWebLLMChat: vi.fn().mockResolvedValue(mockChat)
    };

    // Ensure window object exists and attach mock
    if (typeof window === 'undefined') {
      global.window = {};
    }
    window.webllm = mockWebLLM;
  });

  afterEach(() => {
    // Clean up window.webllm after each test
    if (window.webllm) {
      delete window.webllm;
    }
  });

  describe('initModel', () => {
    it('should initialize the chat model on first call', async () => {
      const { generateWords } = useWebLLM();
      
      // Trigger initialization through generateWords
      mockChat.generate.mockResolvedValueOnce('word1\nword2\nword3');
      await generateWords('test');

      expect(mockWebLLM.CreateWebLLMChat).toHaveBeenCalledWith({
        model: 'Llama-3.2-1B-Instruct-q4f16_1'
      });
    });

    it('should not reinitialize chat if already initialized', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('word1\nword2');
      await generateWords('theme1');

      mockChat.generate.mockResolvedValueOnce('word3\nword4');
      await generateWords('theme2');

      // Should only be called once
      expect(mockWebLLM.CreateWebLLMChat).toHaveBeenCalledTimes(1);
    });
  });

  describe('generateWords', () => {
    it('should generate words with default count', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('apple\nbanana\ncherry');
      const words = await generateWords('fruit');

      expect(words).toEqual(['apple', 'banana', 'cherry']);
      expect(mockChat.generate).toHaveBeenCalledWith(
        expect.stringContaining('12 crossword-friendly words')
      );
    });

    it('should generate words with custom count', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('cat\ndog');
      const words = await generateWords('animals', 2);

      expect(words).toEqual(['cat', 'dog']);
      expect(mockChat.generate).toHaveBeenCalledWith(
        expect.stringContaining('2 crossword-friendly words')
      );
    });

    it('should handle words with extra whitespace', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('  word1  \n\n  word2  \nword3');
      const words = await generateWords('test');

      expect(words).toEqual(['word1', 'word2', 'word3']);
    });

    it('should filter out empty lines', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('word1\n\n\nword2\n');
      const words = await generateWords('test');

      expect(words).toEqual(['word1', 'word2']);
    });

    it('should pass the theme to the prompt', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('word');
      await generateWords('space');

      expect(mockChat.generate).toHaveBeenCalledWith(
        expect.stringContaining('space')
      );
    });

    it('should handle empty response', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('');
      const words = await generateWords('test');

      expect(words).toEqual([]);
    });

    it('should handle response with only whitespace', async () => {
      const { generateWords } = useWebLLM();
      
      mockChat.generate.mockResolvedValueOnce('   \n\n  \n  ');
      const words = await generateWords('test');

      expect(words).toEqual([]);
    });
  });

  describe('error handling', () => {
    it('should throw error if chat initialization fails', async () => {
      mockWebLLM.CreateWebLLMChat.mockRejectedValueOnce(
        new Error('Model initialization failed')
      );

      const { generateWords } = useWebLLM();
      
      await expect(generateWords('test')).rejects.toThrow(
        'Model initialization failed'
      );
    });

    it('should throw error if generation fails', async () => {
      mockChat.generate.mockRejectedValueOnce(
        new Error('Generation failed')
      );

      const { generateWords } = useWebLLM();
      
      await expect(generateWords('test')).rejects.toThrow(
        'Generation failed'
      );
    });
  });
});
