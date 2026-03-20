const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/users", async (req, res) => {
  try {
    const response = await axios.get("http://api:8000/users");
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur API" });
  }
});

app.listen(8000, "0.0.0.0", () => {
  console.log("Server running on port 8000");
});