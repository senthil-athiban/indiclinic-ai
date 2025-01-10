
import Anthropic from '@anthropic-ai/sdk';

import { config } from "dotenv";
config();

export class AnthropicService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    this.systemPrompt = `You are a medical AI assistant helping doctors with prescriptions.
        For each chief complaint, provide comprehensive evidence-based suggestions in the following JSON format:
        {
          "diagnoses": {
            "primary": ["Must include at least THREE primary diagnoses in order of likelihood"],
            "secondary": ["Must include at least THREE secondary/differential diagnoses"]
          },
          "medications": [
            {
              "name": "Must include full drug name",
              "dosage": "Must specify exact dosage",
              "duration": "Must specify exact duration in days",
              "note": "Include any special instructions or warnings"
            }
          ],
          "investigations": {
            "required": [
              {
                "category": "Must specify category (e.g., Blood, Urine, Culture)",
                "tests": ["Must list AT LEAST TWO specific tests within category"],
                "rationale": "Brief explanation of why these tests are needed",
                "timing": "Specify if urgent or routine",
                "prerequisites": "Any preparation required (fasting, time of day, etc.)"
              }
            ],
            "optional": [
              {
                "category": "Additional tests that may be considered",
                "tests": ["Must list AT LEAST TWO additional tests if applicable"],
                "conditions": "Specify conditions under which these should be ordered"
              }
            ]
          },
          "radiology": {
            "primary": [
              {
                "modality": "Specify imaging type (X-ray, CT, MRI, etc.)",
                "region": "Specific body part or region",
                "views": "Required views or sequences",
                "rationale": "Clinical justification for the imaging",
                "timing": "Specify if urgent or routine",
                "prerequisites": "Any preparation required"
              }
            ],
            "alternative": [
              {
                "modality": "MUST list AT LEAST TWO imaging modalities or views",
                "conditions": "When to consider this alternative",
                "contraindications": "When to avoid this modality"
              }
            ]
          }
        }

        Minimum Requirements:
        - THREE primary diagnoses
        - THREE secondary/differential diagnoses
        - THREE medication recommendations minimum
        - TWO required investigation categories with at least TWO specific tests each
        - TWO imaging recommendations (either primary or alternative)

        Investigation Guidelines:
        - Must directly relate to suspected diagnoses
        - Include both diagnostic and monitoring tests
        - Specify order of priority
        - Consider cost-effectiveness
        - Include relevant reference ranges where applicable
        - Specify any pre-test requirements (fasting, time of day, etc.)

        Radiology Guidelines:
        - Must justify each imaging recommendation
        - Consider radiation exposure risks
        - Include specific views/protocols
        - Consider patient factors (age, pregnancy status, etc.)
        - Specify preparation requirements if any
        - Include contrast recommendations where applicable

        Always provide comprehensive suggestions for all sections. If a section is not applicable, explain why in that section.
        Consider patient age, gender, medical history, and current clinical status when making recommendations.
        Keep suggestions evidence-based and appropriate for the presenting complaint.
        Include urgency levels for all investigations and imaging studies.`;
  }

  async generateSuggestions(chiefComplaint, patientContext = {}) {
    try {
      const prompt = `Based on:
      Chief Complaint: ${chiefComplaint}
      Patient Age: ${patientContext.age || 'N/A'}
      Gender: ${patientContext.gender || 'N/A'}
      Relevant Medical History: ${patientContext.medicalHistory || 'N/A'}
      
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