// services/claudeService.js
import Anthropic from '@anthropic-ai/sdk';

class ClaudeService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Use system prompt to define the expected response format
    this.systemPrompt = `You are a medical AI assistant helping doctors with prescriptions.
    For each chief complaint, provide evidence-based suggestions in the following JSON format:
    {
      "diagnoses": {
        "primary": ["diagnosis1", "diagnosis2"],
        "secondary": ["diagnosis1", "diagnosis2"]
      },
      "medications": [
        {
          "name": "drug name",
          "dosage": "recommended dosage",
          "duration": "recommended duration"
        }
      ],
      "investigations": ["test1", "test2"],
      "radiology": ["imaging1", "imaging2"]
    }
    Keep suggestions concise and evidence-based.`;
  }

  async generateSuggestions(chiefComplaint, patientContext = {}) {
    try {
      // Create a medically-focused prompt
      const prompt = `Based on:
      Chief Complaint: ${chiefComplaint}
      Patient Age: ${patientContext.age || 'N/A'}
      Gender: ${patientContext.gender || 'N/A'}
      Relevant History: ${patientContext.medicalHistory || 'N/A'}
      
      Provide appropriate medical suggestions following the specified JSON format.`;

      const response = await this.client.messages.create({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        temperature: 0.3,
        system: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      return this.parseAndValidateResponse(response);
    } catch (error) {
      console.error('Claude API Error:', error);
      throw new Error('Failed to generate medical suggestions');
    }
  }

  parseAndValidateResponse(response) {
    try {
      const content = response.content[0].text;
      const suggestions = JSON.parse(content);
      
      // Validate required fields
      if (!suggestions.diagnoses || !suggestions.medications) {
        throw new Error('Invalid response format');
      }

      return {
        diagnoses: suggestions.diagnoses,
        medications: suggestions.medications,
        investigations: suggestions.investigations || [],
        radiology: suggestions.radiology || []
      };
    } catch (error) {
      throw new Error('Failed to parse Claude response');
    }
  }

  // Optional: Add response caching
  async getCachedSuggestions(key) {
    // Implementation with Redis or similar caching solution
  }
}

// routes/suggestionRoutes.js
import express from 'express';
import { ClaudeService } from '../services/claudeService.js';
import { rateLimit } from 'express-rate-limit';

const router = express.Router();
const claudeService = new ClaudeService();

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
  limiter,
  validateSuggestionRequest,
  async (req, res) => {
    try {
      const { chiefComplaint, patientContext } = req.body;
      const suggestions = await claudeService.generateSuggestions(
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

export default router;