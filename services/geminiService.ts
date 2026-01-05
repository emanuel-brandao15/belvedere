import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getMilkPrediction = async (params: {
  region: string;
  volume: number;
  season: string;
  feedPrice: number;
}) => {
  const ai = getAI();
  const model = 'gemini-3-pro-preview';
  
  const prompt = `Analise a situação de compra de leite para a região de ${params.region}. 
  Volume desejado: ${params.volume} litros. 
  Estação: ${params.season}. 
  Preço atual da ração: R$ ${params.feedPrice}/kg.
  
  Forneça uma análise estratégica de predição de preço, tendências de mercado, riscos logísticos e recomendações de negociação.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            predictedPrice: { type: Type.NUMBER, description: "Preço previsto por litro" },
            trend: { type: Type.STRING, description: "Tendência: up, down ou stable" },
            confidence: { type: Type.NUMBER, description: "Nível de confiança de 0 a 1" },
            analysis: { type: Type.STRING, description: "Texto explicativo da análise" },
            risks: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Lista de riscos identificados" 
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Lista de ações recomendadas"
            }
          },
          required: ["predictedPrice", "trend", "confidence", "analysis", "risks", "recommendations"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro na predição Gemini:", error);
    throw error;
  }
};

// FIX: Add the missing 'generateAgroImage' function to resolve the import error.
export const generateAgroImage = async (
  prompt: string,
  imageSize: '1K' | '2K' | '4K'
): Promise<string | null> => {
  const ai = getAI();
  const model = 'gemini-3-pro-image-preview';

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: '1:1',
          imageSize: imageSize,
        },
      },
    });

    // The response may contain multiple parts, iterate to find the image.
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null; // Return null if no image is found
  } catch (error) {
    console.error('Error generating image with Gemini:', error);
    throw error;
  }
};
