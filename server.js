const express = require('express');
const { Server } = require('socket.io');
const http = require('http');
const cors = require('cors');
const { spawn } = require('child_process');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,apiKey: process.env.OPENAI_API_KEY || '', 
});

app.post('/voice-command', async (req, res) => {
  const { command } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: command }],
    });
    const response = completion.choices[0].message.content;
    res.json({ message: response });
  } catch (error) {
    console.error('ChatGPT Error:', error.message);
    res.status(500).json({ message: 'Error processing command for AI car infotainment' });
  }
});

const pythonProcess = spawn('python', ['gesture_server.py']);
let buffer = '';

pythonProcess.stdout.on('data', (data) => {
  buffer += data.toString();
  const lines = buffer.split('\n');
  buffer = lines.pop();

  lines.forEach(line => {
    if (line.trim() === '') return;
    try {
      const gestureData = JSON.parse(line);
      io.emit('gesture_update', gestureData); 
    } catch (err) {
      console.error('Error parsing Python output:', err.message, 'Raw data:', line);
    }
  });
});

pythonProcess.stderr.on('data', (data) => {
  console.error('Python Error:', data.toString());
});

pythonProcess.on('close', (code) => {
  console.log(`Python process exited with code ${code}`);
});

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

