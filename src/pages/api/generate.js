import axios from 'axios';

const CLAUDE_API_KEY = '';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-opus-20240229",
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.95,
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        },
      }
    );

    if (response.data && response.data.content && response.data.content.length > 0) {
      res.status(200).json({ result: response.data.content[0].text });
    } else {
      throw new Error('Unexpected response structure from Claude API');
    }
  } catch (error) {
    console.error('Error calling Claude API:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Error generating content', error: error.message });
  }
}