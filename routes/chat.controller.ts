import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const chatHistory: Record<string, { role: string; content: string }[]> = {};
const activeSessions: Record<string, NodeJS.Timer> = {};
const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes

function resetSessionTimeout(userId: string) {
    if (activeSessions[userId]) clearTimeout(activeSessions[userId]);
    activeSessions[userId] = setTimeout(() => delete chatHistory[userId], SESSION_TIMEOUT);
}

export const startChat = (req: any, res: any) => {
    const sessionId = uuidv4();
    chatHistory[sessionId] = [];
    resetSessionTimeout(sessionId);
    res.json({ sessionId });
}

export const sendMessage =  async (req:any, res:any) => {
    const { sessionId, message } = req.body;
    if (!sessionId || !message) return res.status(400).json({ error: "Missing fields" });
    if (!chatHistory[sessionId]) return res.status(404).json({ error: "Session not found" });
  
    chatHistory[sessionId].push({ role: "user", content: message });
    resetSessionTimeout(sessionId);
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const contents = chatHistory[sessionId].map(item => ({
        role: item.role,
        parts: [{ text: item.content }]
      }));
      const result = await model.generateContent({ contents });
      const botReply = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "I'm not sure.";
  
      chatHistory[sessionId].push({ role: "model", content: botReply });
      res.json({ reply: botReply });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error processing request" });
    }
  }