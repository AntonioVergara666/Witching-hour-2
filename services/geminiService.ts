
import { GoogleGenAI } from "@google/genai";
import { GenerationParams } from "../types";

  const apiKey = process.env.GEMINI_API_KEY; // ← CAMBIA ESTO

export const generateWitchImage = async (params: GenerationParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey }); // ← usa la variable ya cargada
  
  const detailedPrompt = `A high-quality, cinematic digital painting of a ${params.archetype}. ${params.prompt}. 
  Ethereal lighting, intricate details, mystical atmosphere, dark fantasy aesthetic, vibrant magical effects. 
  Professional artistic style, masterpiece, sharp focus.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: detailedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: params.aspectRatio,
        }
      }
    });

    const candidate = response.candidates?.[0];
    if (!candidate) throw new Error("The spirits failed to manifest a vision.");

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the conjuration.");
  } catch (error: any) {
    console.error("Conjuration Error:", error);
    throw error;
  }
};
