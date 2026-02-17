const aiService = require('../services/ai.service');

class AIController {
  async generate(req, res, next) {
    try {
      const { prompt, mode } = req.body;

      console.log(`AI Request - Mode: ${mode}, Prompt length: ${prompt?.length || 0}`);

      const result = await aiService.generate(prompt, mode);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Controller Error:', error.message);
      
      const statusCode = error.status || 500;
      const errorMessage = error.message || 'Failed to generate AI response. Please try again.';

      const errorObj = new Error(errorMessage);
      errorObj.status = statusCode;
      
      next(errorObj);
    }
  }

  async getModes(req, res) {
    res.status(200).json({
      success: true,
      modes: [
        {
          value: 'explain',
          label: 'Explain a Concept',
          description: 'Get a clear, beginner-friendly explanation of any concept'
        },
        {
          value: 'mcq',
          label: 'Generate Multiple-Choice Questions',
          description: 'Create practice questions to test understanding'
        },
        {
          value: 'summarize',
          label: 'Summarize Text',
          description: 'Get a concise summary with key takeaways'
        },
        {
          value: 'improve',
          label: 'Improve Writing Quality',
          description: 'Enhance grammar, clarity, and style'
        }
      ]
    });
  }
}

module.exports = new AIController();
