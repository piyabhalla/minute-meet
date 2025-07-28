// utils/summarize.js

export async function summarizeTranscript(transcript) {
  try {
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transcript }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to get summary');
    }

    return data.summary;
  } catch (error) {
    console.error('Summarize error:', error);
    return null;
  }
}
