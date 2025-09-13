const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Zenith Backend API running!");
});

// Add more API routes here as needed

app.get("/api/data", (req, res) => {
  res.json({ message: "This is your data!", data: [1, 2, 3, 4] });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
