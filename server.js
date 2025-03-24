const express = require('express');
const gtts = require('node-gtts');
const path = require('path');
const fs = require('fs');
const app = express();
// Enable CORS (allows your frontend to talk to the backend)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
  
  // Handle preflight requests (browsers send these first)
  app.options('/api/tts', (req, res) => {
    res.sendStatus(200);
  });

app.use(express.json());
app.use(express.static('.'));

// Use /tmp directory which is writable in Vercel
const TEMP_DIR = '/tmp';

app.post('/api/tts', (req, res) => {
    const { text, lang = 'en' } = req.body;
    
    // Use /tmp directory which is writable in Vercel
    const tempFile = `/tmp/speech-${Date.now()}.mp3`;
    
    const tts = gtts(lang);
    
    tts.save(tempFile, text, () => {
        res.download(tempFile, 'speech.mp3', (err) => {
            // Delete the temp file when done
            fs.unlink(tempFile, () => {});
            if (err) console.error('Error sending file:', err);
        });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});