
import { GoogleGenAI, Type } from "@google/genai";

export const analyzeSpringData = async (description: string, imageBase64?: string) => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';
  
  const prompt = `
    Analyze the following information about a water spring in Bojonegoro, Indonesia.
    Based on the text and (if provided) the image, provide a structured evaluation.
    
    Description: ${description}
    
    Please return a JSON response with:
    1. A refined, professional description.
    2. An estimated health status (Excellent, Good, Fair, Poor, Threatened).
    3. Three key conservation recommendations.
  `;

  const contents: any = { parts: [{ text: prompt }] };
  
  if (imageBase64) {
    contents.parts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageBase64.split(',')[1] || imageBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedDescription: { type: Type.STRING },
            suggestedStatus: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["refinedDescription", "suggestedStatus", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
