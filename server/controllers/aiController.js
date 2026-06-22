const { GoogleGenAI, Type, Schema } = require('@google/genai');

const ai = process.env.GOOGLE_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY })
  : null;

// Helper: generate mock AI response when no API key is provided
function getMockAIResponse(subject, content, sender) {
  const subjectLower = subject.toLowerCase();
  const contentLower = content.toLowerCase();

  let category = 'General';
  let isPriority = false;
  let spamScore = 5;
  let sentiment = 'Neutral';

  if (subjectLower.includes('urgent') || subjectLower.includes('important') || subjectLower.includes('asap')) {
    category = 'Important'; isPriority = true;
  } else if (subjectLower.includes('meeting') || subjectLower.includes('project') || subjectLower.includes('deadline') || subjectLower.includes('report')) {
    category = 'Work';
  } else if (subjectLower.includes('invoice') || subjectLower.includes('receipt') || subjectLower.includes('order') || subjectLower.includes('sale') || subjectLower.includes('discount')) {
    category = 'Promotions';
  } else if (subjectLower.includes('win') || subjectLower.includes('prize') || subjectLower.includes('click here') || subjectLower.includes('free money')) {
    category = 'Spam'; spamScore = 95;
  } else if (subjectLower.includes('hi') || subjectLower.includes('hello') || subjectLower.includes('dinner') || subjectLower.includes('weekend')) {
    category = 'Personal';
  } else if (subjectLower.includes('update') || subjectLower.includes('notification') || subjectLower.includes('newsletter')) {
    category = 'Updates';
  } else if (subjectLower.includes('follow') || subjectLower.includes('friend') || subjectLower.includes('liked') || subjectLower.includes('comment')) {
    category = 'Social';
  }

  if (contentLower.includes('happy') || contentLower.includes('great') || contentLower.includes('thank')) sentiment = 'Positive';
  else if (contentLower.includes('problem') || contentLower.includes('issue') || contentLower.includes('concern') || contentLower.includes('urgent')) sentiment = 'Negative';

  return {
    category,
    confidenceScore: 0.88,
    isPriority,
    spamScore,
    summary: `This email from ${sender} is about "${subject}". It appears to be a ${category.toLowerCase()} email.`,
    aiExplanation: `The email was classified as ${category} based on keywords in the subject and content. Confidence is high based on pattern matching.`,
    sentiment,
    autoReplySuggestion: category === 'Work'
      ? "Thank you for the email. I'll review the details and get back to you shortly."
      : category === 'Important'
        ? "I've received your urgent message and will address it right away."
        : "Thank you for reaching out. I'll get back to you soon."
  };
}

// POST /api/ai/classify
const classifyEmail = async (req, res) => {
  try {
    const { subject, content, sender } = req.body;

    if (!subject || !content || !sender) {
      return res.status(400).json({ message: 'Subject, content, and sender are required' });
    }

    if (!ai) {
      const mockResult = getMockAIResponse(subject, content, sender);
      return res.json(mockResult);
    }

    const prompt = `Analyze this email and classify it.
Sender: ${sender}
Subject: ${subject}
Content: ${content.substring(0, 1000)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING, enum: ["Important", "Work", "Personal", "Promotions", "Social", "Updates", "Spam", "General"] },
            confidenceScore: { type: Type.NUMBER, description: "Score between 0.0 and 1.0" },
            isPriority: { type: Type.BOOLEAN },
            spamScore: { type: Type.NUMBER, description: "Score between 0 and 100" },
            summary: { type: Type.STRING, description: "1-2 sentence summary" },
            aiExplanation: { type: Type.STRING, description: "Why this category was chosen" },
            sentiment: { type: Type.STRING, enum: ["Positive", "Neutral", "Negative"] },
            autoReplySuggestion: { type: Type.STRING, description: "A suggested short reply" }
          },
          required: ["category", "confidenceScore", "isPriority", "spamScore", "summary", "aiExplanation", "sentiment", "autoReplySuggestion"]
        },
        temperature: 0.3
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);
  } catch (error) {
    console.error('AI classify error:', error);
    // Fallback to mock
    const mockResult = getMockAIResponse(req.body.subject || '', req.body.content || '', req.body.sender || '');
    res.json(mockResult);
  }
};

// POST /api/ai/summarize
const summarizeEmail = async (req, res) => {
  try {
    const { subject, content } = req.body;

    if (!ai) {
      return res.json({
        summary: `Quick summary: The email titled "${subject}" covers the key points of the message. Action may be required based on the content.`
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Summarize this email in 1-2 concise sentences:\n\nSubject: ${subject}\nContent: ${content.substring(0, 2000)}`,
      config: {
        temperature: 0.5
      }
    });

    res.json({ summary: response.text });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/ai/spam-detect
const detectSpam = async (req, res) => {
  try {
    const { subject, content, sender } = req.body;

    if (!ai) {
      const subjectLower = (subject || '').toLowerCase();
      const isSpam = subjectLower.includes('win') || subjectLower.includes('prize') || subjectLower.includes('click here') || subjectLower.includes('free money');
      return res.json({
        spamScore: isSpam ? 92 : 8,
        isSpam,
        reasons: isSpam ? ['Suspicious subject line', 'Common spam phrases detected'] : ['No spam indicators found']
      });
    }

    const prompt = `Analyze this email for spam.
Sender: ${sender}
Subject: ${subject}
Content: ${content.substring(0, 500)}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            spamScore: { type: Type.NUMBER, description: "Score between 0 and 100" },
            isSpam: { type: Type.BOOLEAN },
            reasons: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["spamScore", "isSpam", "reasons"]
        },
        temperature: 0.2
      }
    });

    res.json(JSON.parse(response.text));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { classifyEmail, summarizeEmail, detectSpam };
