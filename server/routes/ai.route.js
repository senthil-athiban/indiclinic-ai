
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import { GroqService } from '../services/groq.js';
import { AnthropicService } from '../services/anthropic.js';

const router = express.Router();
const groqService = new GroqService();
const anthropicService = new AnthropicService();

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later'
});

// Validation middleware
const validateSuggestionRequest = (req, res, next) => {
  const { chiefComplaint } = req.body;
  if (!chiefComplaint?.trim()) {
    return res.status(400).json({ error: 'Chief complaint is required' });
  }
  next();
};

router.post('/suggestions', 
  async (req, res) => {
    try {
      const { chiefComplaint, patientContext } = req.body;
      const suggestions = await anthropicService.generateSuggestions(
        chiefComplaint,
        patientContext
      );
      res.json(suggestions);
    } catch (error) {
      console.error('Suggestion Error:', error);
      res.status(500).json({ 
        error: 'Failed to generate suggestions',
        details: error.message 
      });
    }
  }
);

export const aiRouter = router;