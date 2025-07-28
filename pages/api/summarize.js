// pages/api/summarize.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { transcript } = req.body;

  if (!transcript) {
    return res.status(400).json({ message: 'Transcript is required' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct',
        messages: [
          { role: 'system', content: 'You are a helpful assistant that summarizes meetings and extracts key tasks.' },
          { role: 'user', content: `Summarize this meeting transcript:\n\n${transcript}` }
        ],
      }),
    });

    const result = await response.json();

    const summary = result.choices?.[0]?.message?.content || 'No summary generated.';

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('API summarize error:', error);
    return res.status(500).json({ message: 'Error summarizing transcript' });
  }
}
