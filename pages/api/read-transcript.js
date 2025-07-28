// File: pages/api/read-transcript.js

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  const { path: transcriptPath } = req.body;

  if (!transcriptPath) {
    return res.status(400).json({ message: 'Transcript path missing' });
  }

  try {
    const content = fs.readFileSync(transcriptPath, 'utf-8');
    return res.status(200).json({ content });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to read transcript file', error: err.message });
  }
}
