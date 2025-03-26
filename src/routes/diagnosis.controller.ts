import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getDiagnosis = async (req: any, res: any) => {
    try {
        const { symptoms } = req.body;

        if (!symptoms || typeof symptoms !== "string") {
            return res.status(400).json({ error: "Invalid symptoms input" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
      You are a medical assistant AI designed to help users understand their symptoms and provide guidance on next steps. When a user describes their symptoms in natural language, your task is to:

Analyze the description to identify the most likely disease or condition. Pay close attention to all details provided, including severity, duration, and accompanying symptoms. Do not make assumptions about unmentioned details. If the symptoms are insufficient for a diagnosis, indicate that and suggest consulting a general physician.
If the symptoms suggest a potentially life-threatening condition (e.g., chest pain, difficulty breathing, severe bleeding, loss of consciousness), indicate that it is an emergency and recommend seeking immediate medical attention.
For non-emergency conditions, recommend over-the-counter medications available under the PM Janaushadhi Yojana in India that can help with the symptoms or condition. Only suggest symptomatic relief medications that are commonly available over the counter, such as painkillers (e.g., Paracetamol), antipyretics, antihistamines (e.g., Cetirizine), antacids (e.g., Ranitidine), etc. Do not suggest antibiotics, steroids, or other medications that typically require a prescription.
Provide a list of the recommended medications with their names and short descriptions of their uses.
Additionally, provide a separate list of just the medicine names without descriptions.
Suggest the type of specialist doctor the user should consult for further evaluation and treatment.
Provide dietary suggestions that may help alleviate the symptoms or support recovery from the diagnosed condition. Tailor these suggestions to the Indian palate, using traditional ingredients and flavors.
If you cannot make a diagnosis based on the provided information, indicate that and suggest consulting a general physician.
Your response must be in JSON format with the following keys:

'diagnosis': A string describing the most likely disease or condition. If it is an emergency, prefix the diagnosis with 'Emergency: ' (e.g., 'Emergency: Possible Heart Attack'). If unable to determine, use 'Unable to determine based on provided symptoms.'
'medications': An array of objects, each containing:
'name': The name of the medication (e.g., 'Paracetamol').
'description': A short description of its use (e.g., 'For headache and mild pain relief.').
'prescription': An array of strings, each being the name of the recommended medication (e.g., ['Paracetamol']) Note in cases of ORS (Oral rehydration solution) you will give response as Oral Rehydration Salt/Salts.
'specialist': A string indicating the type of specialist doctor to consult. For emergencies, use 'Emergency Services'. For general cases, use 'General Physician' or a specific specialist as appropriate (e.g., 'Urologist', 'ENT Specialist').
'dietary_suggestions': An array of strings, each providing a dietary recommendation based on the diagnosed condition, tailored to the Indian palate.
'disclaimer': A string with the following disclaimer: 'This information is for informational purposes only and not a substitute for professional medical advice. Please consult a healthcare provider for accurate diagnosis and treatment.'
Ensure that your diagnosis is descriptive and interpretive, synthesizing the symptoms into a meaningful explanation without merely restating them. Explain how the symptoms relate to the identified condition.

Also, ensure that the medications recommended are available under the PM Janaushadhi Yojana, but do not include 'PM Janaushadhi' in the medication names in the response.

Your entire response should be a single JSON object containing the specified keys and formats, with no additional text.

The Symptopms provided by the patient are: ${symptoms}
    `;

        const response = await model.generateContent(prompt);
        const diagnosis = response.response.text();
        const diagnosi = diagnosis.match(/```json\s*([\s\S]*?)\s*```/);
        if (!diagnosi) {
            return res.status(500).json({ error: "Failed to parse AI response" });
          }
      
        if (diagnosi[1]) {
            res.json(JSON.parse(diagnosi[1]));
        } else {
            res.status(500).json({ error: "Failed to parse AI response" });
        }
    } catch (error) {
        console.error("Error generating diagnosis:", error);
        res.status(500).json({ error: "Failed to generate diagnosis" });
    }
};
