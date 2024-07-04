import cors from "cors";
import "dotenv/config";
import express from "express";
import { connectDB } from "./config/db.js";
import cartRouter from "./routes/cartRoute.js";
import {
  default as abc,
  default as categoryRouter,
} from "./routes/categoryRoute.js";
import foodRouter from "./routes/foodRoute.js";
import orderRouter from "./routes/orderRoute.js";
import userRouter from "./routes/userRoute.js";

// app config
const app = express();
const port = process.env.PORT || 4000;

// middlewares
app.use(express.json());
app.use(cors());

// db connection
connectDB();
const BASE_URL = "/api";

// api endpoints
app.use(BASE_URL, userRouter);
app.use(BASE_URL, foodRouter);
app.use(BASE_URL, categoryRouter);
app.use(BASE_URL, express.static("uploads"));
app.use(BASE_URL, cartRouter);
app.use(BASE_URL, orderRouter);

app.get("/", (req, res) => {
  res.send("API Working");
});

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
