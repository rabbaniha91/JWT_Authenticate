const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const connectToDB = require("./config/dbconfig");
const corsOption = require("./config/corsOption");
const credentilas = require("./middlewares/credentials");
const userRouter = require("./routes/userRoutes");
const adminRouter = require("./routes/adminRoutes");
const refreshRouter = require("./routes/refreshTokenRoute")

const app = express();
app.use(credentilas);
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());
app.use("/refresh", refreshRouter)
app.use("/user", userRouter);
app.use("/admin", adminRouter);

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

app.use((err, req, res) => {
  res.status(500).send(err.message);
});

const port = process.env.PORT || 4000;

connectToDB();

mongoose.connection.once("open", () => {
  console.log("Connect to dataBase...");
  app.listen(port, () => {
    console.log("Server run on port", port);
  });
});
