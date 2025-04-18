import express from "express";
import dotenv from "dotenv";
import { router } from "./controllers/addUser.js";
const app = express();
dotenv.config();

const port = process.env.PORT || 4000;

// MIDDLEWARE
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello ji");
});

app.use('/user', router);

// START SERVER
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
