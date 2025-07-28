// File: pages/index.js

import { useState } from 'react';

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setStatus('Uploading file...');
    setSummary('');

    try {
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        throw new Error(uploadData.message || 'Upload failed.');
      }

      setStatus('Upload successful. Reading transcript...');

      // ✅ Fetch the transcript file content from local system
      const transcriptPath = 'C:/Users/PIYA/Desktop/minute.meet/transcript.txt';

      const transcriptRes = await fetch(`/api/read-transcript`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: transcriptPath }),
      });

      const transcriptData = await transcriptRes.json();
      if (!transcriptRes.ok) throw new Error(transcriptData.message || 'Failed to read transcript.');

      setStatus('Transcript read. Summarizing...');

      // ✅ Call summarization API
      const summarizeRes = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptData.content }),
      });

      const summarizeData = await summarizeRes.json();
      if (!summarizeRes.ok) throw new Error(summarizeData.message || 'Summarization failed.');

      setStatus('Summary generated!');
      setSummary(summarizeData.summary);
    } catch (err) {
      setStatus(`Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Upload Meeting Transcript</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ marginLeft: '1rem' }}>
          Upload & Summarize
        </button>
      </form>

      <p><strong>Status:</strong> {status}</p>

      {summary && (
        <div style={{ marginTop: '2rem', background: '#f4f4f4', padding: '1rem' }}>
          <h2>Summary:</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{summary}</pre>
        </div>
      )}
    </div>
  );
}
