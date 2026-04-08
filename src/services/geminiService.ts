import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export interface Song {
  title: string;
  artist: string;
  reason: string;
  mood: string;
}

export async function getKPopRecommendations(emotions: string[]): Promise<Song[]> {
  const prompt = `Based on these emotions: ${emotions.join(", ")}, recommend 5-7 K-Pop songs that perfectly match this mood. 
  For each song, provide the title, artist, a brief reason why it fits, and a general mood category.
  Make sure the recommendations are diverse (different eras, groups, soloists).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              artist: { type: Type.STRING },
              reason: { type: Type.STRING },
              mood: { type: Type.STRING },
            },
            required: ["title", "artist", "reason", "mood"],
          },
        },
      },
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Error fetching K-Pop recommendations:", error);
    return [];
  }
}
