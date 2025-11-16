const express = require("express");
const cors = require("cors");
require("./db");
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🚀 SANUX Exchange Backend Running Successfully!");
});

app.listen(4000, () => console.log("Server started on port 4000"));
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);
