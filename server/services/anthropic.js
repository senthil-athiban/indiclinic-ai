
import Anthropic from '@anthropic-ai/sdk';

import { config } from "dotenv";
config();

export class AnthropicService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    
    // Use system prompt to define the expected response format
    this.systemPrompt = `You are a medical AI assistant helping doctors with prescriptions.
For each chief complaint, provide comprehensive evidence-based suggestions in the following JSON format:
{
  "diagnoses": {
    "primary": ["Must include at least one primary diagnosis"],
    "secondary": ["Must include at least one secondary/differential diagnosis"]
  },
  "medications": [
    {
      "name": "Must include full drug name",
      "dosage": "Must specify exact dosage",
      "duration": "Must specify exact duration",
      "note": "Include any special instructions or warnings"
    }
  ],
  "investigations": [
    "Must list all relevant laboratory tests",
    "Must include at least basic investigative tests",
    "Include specific test recommendations"
  ],
  "radiology": [
    "Must list all relevant imaging studies",
    "Include specific views if applicable",
    "Include 'None required' if no imaging needed"
  ]
}

Always provide comprehensive suggestions for all sections. If a section is not applicable, explain why in that section.
Consider patient age, gender, and medical history when making recommendations.
Keep suggestions evidence-based and appropriate for the presenting complaint.`;
  }

  async generateSuggestions(chiefComplaint, patientContext = {}) {
    try {
      const prompt = `Based on:
      Chief Complaint: ${chiefComplaint}
      Patient Age: ${patientContext.age || 'N/A'}
      Gender: ${patientContext.gender || 'N/A'}
      Relevant History: ${patientContext.medicalHistory || 'N/A'}
      
      Provide appropriate medical suggestions following the specified JSON format.`;


      console.log("prompt: ", prompt);
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
      console.log("response : ", response);
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

      console.log("suggestions: ", suggestions);
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

  
  // async getCachedSuggestions(key) {
  //   // Implementation with Redis or similar caching solution
  // }
}