
import { GoogleGenAI } from "@google/genai";

// Use a factory function to ensure a fresh client with the latest environment variable key if needed.
const getAI = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Fixed to use history parameter and pass it to ai.chats.create for a continuous chat experience.
export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', text: string }[]) => {
  const ai = getAI();
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    // Map the simple history format to the required role/parts structure.
    history: history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    })),
    config: {
      systemInstruction: 'You are an expert Cricket Coach at Rajendra Cricket Academy (RCA). You provide technical advice on batting, bowling, and fielding, motivational quotes, and academy-related info. Keep responses professional, authoritative yet encouraging, reflecting the elite standards of RCA.',
    }
  });

  const response = await chat.sendMessage({ message });
  // Always access the generated text through the .text property.
  return response.text;
};

// Generate content with multimodal input (video bytes + text instructions).
export const analyzeCricketVideo = async (videoBase64: string, mimeType: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: videoBase64,
            mimeType: mimeType,
          },
        },
        {
          text: `Analyze this cricket video for a student at Rajendra Cricket Academy. Identify the action (batting, bowling, fielding). 
          Provide technical feedback on: 
          1. Stance/Run-up 
          2. Contact Point/Release 
          3. Follow-through. 
          Suggest one specific drill to improve. 
          Format the response with clear headings and maintain the professional RCA tone.`,
        },
      ],
    },
  });

  return response.text;
};

// Analysis of performance history using high-reasoning Gemini 3 Pro model.
export const analyzePerformanceHistory = async (studentName: string, category: string, historyData: string) => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze the following performance data for ${studentName}, a ${category} at Rajendra Cricket Academy. 
    Data: ${historyData}
    
    Tasks:
    1. Identify the main technical strength.
    2. Identify one critical area for improvement.
    3. Predict the player's potential trajectory for the next 3 months.
    4. Provide a "Coach's Verdict" (Short summary).
    
    Use a professional, high-performance coaching tone.`,
  });
  return response.text;
};
