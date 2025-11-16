// Groq-based classification fallback - simple and robust
const Groq = require("groq-sdk");

let client = null;
if (process.env.GROQ_API_KEY) {
  client = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

async function analyzeTicket(text) {
  // fallback default
  const fallback = {
    category: "General",
    priority: "medium",
    department: "Admin",
    summary: text.slice(0, 200)
  };

  if (!client) return fallback;

  try {
    const prompt = `
Analyze this campus issue and return ONLY a JSON object.

Issue: "${text}"

Return:
{"category":"","priority":"","department":"","summary":""}

Categories: Network Issue, IT Issue, Classroom Issue, Hostel Issue, Transport Issue, Admin Issue, Academic Issue
Priority: low, medium, high
Departments: IT, Admin, Hostel, Transport, Academics
`;
    const response = await client.chat.completions.create({
      model: "grok-2024a", // use stable groq model (adjust if needed)
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const textResponse = response.choices?.[0]?.message?.content?.trim();
    if (!textResponse) return fallback;
    const parsed = JSON.parse(textResponse);
    return { ...fallback, ...parsed };
  } catch (err) {
    console.error("Groq AI error:", err?.message || err);
    return fallback;
  }
}

module.exports = { analyzeTicket };
