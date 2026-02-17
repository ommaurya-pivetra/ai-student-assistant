const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    const apiKey = process.env.AI_API_KEY;

    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('AI_API_KEY environment variable is missing or empty. Please set AI_API_KEY to a valid Google Generative AI API key.');
    }

    this.client = new GoogleGenerativeAI(apiKey);
    this.model = this.client.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  buildPrompt(userInput, mode) {
    const prompts = {
      explain: {
        role: 'You are an experienced university instructor with a talent for breaking down complex topics.',
        context: 'You are helping a student who is encountering this concept for the first time.',
        rules: [
          'Use simple, clear language appropriate for beginners',
          'Break down the concept into digestible parts',
          'Use analogies or real-world examples where helpful',
          'Keep your explanation under 200 words',
          'If the concept is unclear or you are uncertain, acknowledge this rather than guessing'
        ],
        format: 'Provide a clear, structured explanation in paragraph form.',
        userContent: `Concept to explain: ${userInput}`
      },
      
      mcq: {
        role: 'You are an expert educator who creates fair, educational multiple-choice questions.',
        context: 'You are creating assessment questions to test understanding of a given topic.',
        rules: [
          'Generate exactly 3 multiple-choice questions',
          'Each question must have 4 options (A, B, C, D)',
          'Only one option should be correct',
          'Make distractors (wrong answers) plausible but clearly incorrect',
          'Vary the difficulty level across questions',
          'If the topic is too vague or you cannot create reliable questions, state this clearly'
        ],
        format: `You must respond ONLY with valid JSON in this exact structure:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": {
        "A": "First option",
        "B": "Second option",
        "C": "Third option",
        "D": "Fourth option"
      },
      "correct": "A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`,
        userContent: `Topic: ${userInput}`
      },
      
      summarize: {
        role: 'You are a professional editor skilled at distilling complex information into clear summaries.',
        context: 'You are helping a busy professional quickly understand the key points of a text.',
        rules: [
          'Identify and extract only the most important information',
          'Maintain the original meaning and tone',
          'Use objective language without adding opinions',
          'Keep the summary to approximately 30% of the original length',
          'If the text is too short to summarize meaningfully, state this',
          'If key information is ambiguous, note this uncertainty'
        ],
        format: 'Provide a concise summary in paragraph form, followed by 3-5 bullet points of key takeaways.',
        userContent: `Text to summarize:\n\n${userInput}`
      },
      
      improve: {
        role: 'You are a professional writing coach and editor.',
        context: 'You are helping someone improve the clarity, grammar, and style of their writing.',
        rules: [
          'Correct grammar, spelling, and punctuation errors',
          'Improve sentence structure and flow',
          'Enhance clarity and conciseness',
          'Maintain the original meaning and voice',
          'Use professional but approachable language',
          'If the writing is already excellent, say so and suggest only minor refinements'
        ],
        format: 'First, provide the improved version. Then, in a separate section labeled "Changes Made:", briefly explain 2-3 major improvements.',
        userContent: `Text to improve:\n\n${userInput}`
      }
    };

    const promptConfig = prompts[mode];
    
    if (!promptConfig) {
      throw new Error(`Invalid mode: ${mode}`);
    }

    // Construct the structured prompt
    const systemPrompt = `${promptConfig.role}

${promptConfig.context}

RULES:
${promptConfig.rules.map((rule, i) => `${i + 1}. ${rule}`).join('\n')}

OUTPUT FORMAT:
${promptConfig.format}`;

    return {
      system: systemPrompt,
      userMessage: promptConfig.userContent
    };
  }

  validateInput(prompt, mode) {
    const errors = [];

    if (!prompt || typeof prompt !== 'string') {
      errors.push('Prompt is required and must be a string');
    } else if (prompt.trim().length === 0) {
      errors.push('Prompt cannot be empty');
    } else if (prompt.length > 5000) {
      errors.push('Prompt is too long (maximum 5000 characters)');
    }

    const validModes = ['explain', 'mcq', 'summarize', 'improve'];
    if (!mode || !validModes.includes(mode)) {
      errors.push(`Mode must be one of: ${validModes.join(', ')}`);
    }

    return errors;
  }

  async generate(userInput, mode) {
    try {
      const validationErrors = this.validateInput(userInput, mode);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join('; '));
      }

      const { system, userMessage } = this.buildPrompt(userInput, mode);

      const result = await this.model.generateContent({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${system}\n\n${userMessage}`
              }
            ]
          }
        ]
      });

      const response = result.response;
            throw new Error('Failed to parse MCQ response: no valid JSON structure found.');

      if (mode === 'mcq') {
        try {
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (!jsonMatch) {
            throw new Error('No JSON found');
          }
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            mode,
            response: parsed,
            raw: responseText
          };
        } catch (parseError) {
          return {
            mode,
            response: null,
            error: 'Failed to generate properly formatted questions. Please try again.',
            raw: responseText
          };
        }
      }

      return {
        mode,
        response: responseText,
        raw: responseText
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      
      const errorMsg = error.message ? error.message.toLowerCase() : '';
      
      if (error.status === 401 || error.code === 'UNAUTHENTICATED' || errorMsg.includes('api key') || errorMsg.includes('authentication')) {
        const keyError = new Error('Gemini API key is invalid or missing. Please check your configuration.');
        keyError.status = 401;
        throw keyError;
      } 
      else if (error.status === 429 || error.code === 'RESOURCE_EXHAUSTED' || errorMsg.includes('quota') || errorMsg.includes('rate_limit')) {
        const quotaError = new Error('API rate limit exceeded. Please try again later.');
        quotaError.status = 429;
        throw quotaError;
      }
      else if (error.status === 400 || error.code === 'INVALID_ARGUMENT' || errorMsg.includes('invalid')) {
        const invalidError = new Error('Invalid request. Please check your input.');
        invalidError.status = 400;
        throw invalidError;
      }
      else if (error.status) {
        throw error;
      } 
      else {
        const genericError = new Error('Failed to generate AI response. Please try again.');
        genericError.status = 500;
        throw genericError;
      }
    }
  }
}

module.exports = new AIService();

