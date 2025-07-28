// File path: minute-meet-web/pages/api/upload.js

import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log("Received request:", req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const form = formidable();

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Form parse error:', err);
      return res.status(500).json({ message: 'File parsing error' });
    }

    const uploadedFile = files.file;
    if (!uploadedFile) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = uploadedFile[0].filepath;

    // ✅ Always rename to transcript.txt
    const destPath = path.join('C:/Users/PIYA/Desktop/minute.meet', 'transcript.txt');

    fs.copyFile(filePath, destPath, (copyErr) => {
      if (copyErr) {
        console.error('Copy error:', copyErr);
        return res.status(500).json({ message: 'Failed to save file' });
      }

      console.log('File saved to:', destPath);
      res.status(200).json({ message: 'File uploaded and saved as transcript.txt' });
    });
  });
}
