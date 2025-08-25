const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Comenzile pentru senzor
let commands = {
  interval: 300, // default 5 minute
  sleep: false
};

// Datele primite de la senzor
let sensorData = [];

// ==========================
// ENDPOINTS pentru SENZOR
// ==========================

// Senzorul ia comenzi
app.get("/api/v1/devices/:id/commands", (req, res) => {
  res.json(commands);
});

// Senzorul trimite date (POST)
app.post("/api/v1/devices/:id/sensors/data", (req, res) => {
  const data = req.body;
  data.timestamp = new Date().toISOString();
  sensorData.push(data);

  // păstrăm doar ultimele 20 citiri
  if (sensorData.length > 20) sensorData.shift();

  console.log("📥 Received data:", data);
  res.json({ message: "Data received", data });
});

// Site-ul ia datele senzorului
app.get("/api/v1/devices/:id/sensors/data", (req, res) => {
  res.json(sensorData);
});

// ==========================
// ENDPOINTS pentru SITE
// ==========================

// Setează interval
app.post("/api/v1/devices/:id/set-interval/:seconds", (req, res) => {
  commands.interval = parseInt(req.params.seconds);
  res.json({ message: "Interval updated", commands });
});

// Oprește/Pornește senzorul
app.post("/api/v1/devices/:id/sleep/:status", (req, res) => {
  commands.sleep = req.params.status === "true";
  res.json({ message: "Sleep mode updated", commands });
});

// ==========================
// Start server
// ==========================
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
