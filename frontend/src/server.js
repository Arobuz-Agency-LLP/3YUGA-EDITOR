import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 5000;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
