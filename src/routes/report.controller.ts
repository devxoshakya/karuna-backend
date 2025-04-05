import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Processes the uploaded PDF report and analyzes it using Gemini AI.
 */
export const processReport = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const pdfBuffer = req.file.buffer;
    const extractedText = await extractTextFromPDF(pdfBuffer);

    if (!extractedText) {
      return res.status(500).json({ error: "Failed to extract text from PDF" });
    }

    // 🧹 **Clean the extracted text using regex**
    const cleanedText = extractedText
      .replace(/\n\s*\n/g, "\n") // Remove multiple new lines
      .replace(/\s{2,}/g, " ") // Remove extra spaces
      .replace(/[^\x20-\x7E]/g, ""); // Remove non-printable characters

    // 🔥 **Merge with system prompt**
    const systemPrompt = `
      You are an AI medical assistant analyzing a patient's report. Dont mention age of the patient just thier age.
      Extract symptoms, suggest a diagnosis, recommend medications, and necessary lifestyle changes.
      Ensure the response is a **valid JSON** with:
      - "diagnosis": Brief diagnosis.
      - "medications": List of medications with descriptions.
      - "prescription": List of prescribed medicines.
      - "specialist": Suggested specialist.
      - "dietary_suggestions": List of diet recommendations.
      - "disclaimer": Medical disclaimer.
      
      Here is the extracted report:\n\n${cleanedText}
    `;

    // 🚀 **Send to Gemini AI**
    const aiResponse = await getGeminiAnalysis(systemPrompt);

    // 🛠 **Clean and parse JSON response**
    const parsedData = cleanAndParseJSON(aiResponse);

    res.json(parsedData);
  } catch (error) {
    console.error("Error processing report:", error);
    res.status(500).json({ error: "Failed to process PDF report" });
  }
};

/**
 * Extracts text from a PDF file using pdfjs-dist.
 */
const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    // ✅ Convert Buffer to Uint8Array
    const uint8Array = new Uint8Array(pdfBuffer);

    // ✅ Properly load the PDF
    const pdfDoc = await getDocument({ data: uint8Array }).promise;
    let extractedText = "";

    for (let i = 1; i <= pdfDoc.numPages; i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(" ");
      extractedText += pageText + "\n";
    }

    return extractedText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
};

/**
 * Calls Gemini AI to analyze the report.
 */
const getGeminiAnalysis = async (prompt: string): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return "{}"; // Return empty JSON in case of an error
  }
};

/**
 * Cleans and parses JSON from Gemini AI response using regex.
 */
const cleanAndParseJSON = (text: string) => {
  try {
    // Extract JSON using regex
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : text;
    if (!jsonString) {
      return { error: "Failed to parse AI response" };
    }
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return { error: "Failed to parse AI response" };
  }
};
