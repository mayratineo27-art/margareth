import { GoogleGenAI, Modality, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface EmotionalState {
  emotion: string;
  note?: string;
  timestamp: number;
}

export const getDailyAdvice = async (history: EmotionalState[]) => {
  const recentHistory = history.slice(-5).map(h => `${h.emotion} (${new Date(h.timestamp).toLocaleDateString()})`).join(", ");
  
  const prompt = `Eres Margareth, una mascota guía emocional para niños de 3 a 6 años. 
  El historial reciente del niño es: ${recentHistory || "Primer día"}.
  Genera un consejo corto, tierno y positivo para hoy (máximo 12 palabras). 
  Usa un lenguaje muy sencillo. Responde solo con el consejo.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "¡Hoy es un gran día para brillar!";
  } catch (error) {
    return "¡Hoy es un gran día para ser feliz!";
  }
};

export const speakMessage = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Dilo con voz muy tierna y alegre: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Kore is soft and friendly
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return `data:audio/mp3;base64,${base64Audio}`;
    }
  } catch (error) {
    console.error("Error generating speech:", error);
  }
  return null;
};

export const analyzeEmotion = async (emotion: string, drawingData?: string) => {
  const prompt = drawingData 
    ? [
        { text: `El niño se siente ${emotion} y ha hecho este dibujo. Como Margareth, dale un mensaje de apoyo tierno y corto (máximo 15 palabras).` },
        { inlineData: { mimeType: "image/png", data: drawingData.split(",")[1] } }
      ]
    : `El niño se siente ${emotion}. Como Margareth, dale un mensaje de apoyo tierno y corto (máximo 15 palabras).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: typeof prompt === 'string' ? prompt : { parts: prompt },
    });
    return response.text || "¡Te quiero mucho!";
  } catch (error) {
    return "¡Qué bueno que compartas cómo te sientes!";
  }
};

export const generateConflictScenario = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una situación de conflicto común en un jardín infantil (niños de 4-6 años).
      Retorna un JSON con:
      - situation: La descripción de la situación (ej: "Un niño te quitó tu juguete favorito").
      - options: Un array de 3 objetos { id, text, type } donde type es "positive", "negative" o "neutral".
      - question: Una pregunta simple (ej: "¿Qué harías tú?").`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            situation: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING },
                  type: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error generating conflict:", error);
    return {
      situation: "Un niño te quitó tu juguete favorito.",
      question: "¿Qué harías tú?",
      options: [
        { id: "1", text: "Pedirle que me lo devuelva por favor", type: "positive" },
        { id: "2", text: "Empujarlo para recuperarlo", type: "negative" },
        { id: "3", text: "Ir a buscar a la maestra", type: "positive" }
      ]
    };
  }
};

export const evaluateConflictChoice = async (situation: string, choice: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Un niño de 5 años estaba en esta situación: "${situation}". 
      Eligió hacer esto: "${choice}".
      Dale un feedback muy corto (máximo 20 palabras), positivo y educativo. 
      Dile por qué fue una buena idea o cómo podría hacerlo mejor la próxima vez.`,
    });
    return response.text || "¡Gracias por compartir cómo te sientes!";
  } catch (error) {
    return "¡Gracias por compartir cómo te sientes!";
  }
};
