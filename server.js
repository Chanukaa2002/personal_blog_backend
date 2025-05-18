import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import AuthRoute from "./routes/Auth.route.js";
import PostRoute from "./routes/Post.route.js";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
dotenv.config();

const server = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  "https://blog.chanukadilshan.live",
  "http://localhost:5173"
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Required for cookies/sessions
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200
};
server.use(cors(corsOptions));
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use("/api/v1/auth/", AuthRoute);
server.use("/api/v1/post/", PostRoute);
server.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(500).json({ error: "Internal Server Error" });
});
server.get("/", (req, res) => {
  res.send("Hello world");
});
server.listen(PORT, () => {
  console.log(`Server running in => ${PORT}`);
  connectDB();
});

export default server;
