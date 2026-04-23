const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// POST /api/gemini/chat - Send a message to Gemini and get a reply
router.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
    }

    // Initialize Gemini client with API key from env
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use the Gemini model (usually 'gemini-pro' or 'gemini-1.5-pro')
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Send the message to Gemini and get response
    const result = await model.generateContent(message);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to get Gemini response' });
  }
});

module.exports = router;
