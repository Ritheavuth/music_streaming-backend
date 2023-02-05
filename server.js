require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connect = require("./config/db.config");
// routes
const userRoute = require("./src/routes/user");
const albumRoute = require("./src/routes/album");
const songRoute = require("./src/routes/song");
const artistRoute = require("./src/routes/artist");

const app = express();

connect();

app.use(cors({ origin: true }));
app.use(express.json())

app.get("/", (req, res) => {
  return res.json("Hello");
});

// User Authentication Routes
app.use("/api/user", userRoute);

// Album Routes
app.use("/api/album", albumRoute);

// Song Routes
app.use("/api/song", songRoute);

// Artist Routes
app.use("/api/artist", artistRoute);

app.listen(4000, () => console.log("Listening to port 4000..."));
