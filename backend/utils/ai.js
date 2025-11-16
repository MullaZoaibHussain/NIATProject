const Groq = require("groq-sdk");

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeTicket(text) {
  if (!process.env.GROQ_API_KEY) {
    console.log("⚠️ No GROQ API Key found. Using fallback.");
    return fallback();
  }

  try {
    const prompt = `
      You are an AI that classifies campus IT/Admin issues.

      Analyze this issue: "${text}"

      Return ONLY a JSON object in this format:
      {
        "category": "",
        "priority": "",
        "department": "",
        "summary": ""
      }

      Categories: Network Issue, IT Issue, Classroom Issue, Hostel Issue, Transport Issue, Admin Issue, Academic Issue  
      Priority: low, medium, high  
      Departments: IT, Admin, Hostel, Transport, Academics  
    `;

    const response = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",   // ✅ NEW UPDATED MODEL
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const raw = response.choices[0].message.content.trim();

    console.log("AI RAW RESPONSE →", raw);

    // Remove code block formatting if present
    const jsonString = raw.replace(/```json|```/g, "").trim();

    return JSON.parse(jsonString);

  } catch (err) {
    console.log("❌ GROQ AI ERROR → ", err.message);
    return fallback();
  }
}

function fallback() {
  return {
    category: "General",
    priority: "medium",
    department: "Admin",
    summary: "AI disabled - fallback mode."
  };
}

module.exports = { analyzeTicket };
