import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/db.js";
import AuthRoute from "./routes/Auth.route.js";
import PostRoute from "./routes/Post.route.js"
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
dotenv.config();

const server = express();
const PORT = process.env.PORT || 5000;

server.use(cors());
server.use(express.json());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cookieParser());
server.use("/api/v1/auth/", AuthRoute);
server.use("/api/v1/post/", PostRoute);
server.use("/",init)
server.listen(PORT, () => {
  console.log(`Server running in => ${PORT}`);
  connectDB();
});
