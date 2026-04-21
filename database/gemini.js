const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateSchedule(userInput) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
You are a smart time management assistant.

Create a daily schedule based on:
${userInput}

Make it realistic, balanced, and efficient.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text();
}

module.exports = { generateSchedule };

