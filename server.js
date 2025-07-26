// server.js - Clean Fixed Version

import express from "express";
import cors from "cors";

// ✅ Load env variables with safe defaults
const PORT = process.env.PORT || 5000;
const SUPABASE_URL = process.env.SUPABASE_URL || "https://dummy-url.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "dummy-service-role-key";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretvalue123";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Basic health check route
app.get("/", (req, res) => {
  res.json({
    status: "✅ VeilMatch Backend Running",
    supabaseURL: SUPABASE_URL ? "Loaded" : "Missing",
    supabaseKey: SUPABASE_KEY ? "Loaded" : "Missing",
    jwtSecret: JWT_SECRET ? "Loaded" : "Missing",
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`✅ Backend is live on port ${PORT}`);
});
