
import Groq from "groq-sdk";
import { config } from "dotenv";
config();

export class GroqService {
  constructor() {
    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
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
      console.log("prompt: ", prompt);
      const response = await this.client.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: this.systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: "mixtral-8x7b-32768",
        temperature: 0.3,
        max_tokens: 1024
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
      const content = response.choices[0].message.content;
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