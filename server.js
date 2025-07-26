server.js
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('✅ Socket connected:', socket.id);

  socket.on('joinMatch', (matchId) => {
    socket.join(matchId);
    console.log(`✅ Joined room ${matchId}`);
  });

  socket.on('sendMessage', (msg) => {
    io.to(msg.matchId).emit('newMessage', msg);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected:', socket.id);
  });
});

app.get('/', (req, res) => res.send('✅ VeilMatch Backend Running'));
app.get('/health', (req, res) => res.send('OK'));

// Signup with password
app.post('/users/signup-auth', async (req, res) => {
  const { email, username, personalityTags, password } = req.body;
  const { data, error } = await supabase.from('users').insert([
    {
      email,
      username,
      password,
      personality_tags: personalityTags,
      avatar_url: `https://i.pravatar.cc/150?u=${username}`,
      real_photo_url: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 50)}.jpg`,
      trust_score: 0,
      reveal_stage: 0,
      is_online: false,
      last_seen: new Date()
    }
  ]);
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ message: 'User created', user: data });
});

// Login with password
app.post('/users/login
