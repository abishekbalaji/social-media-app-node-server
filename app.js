import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import postRoutes from "./routes/posts.js";

import { register } from "./controllers/auth.js";
import {createPost} from "./controllers/posts.js";

import { verifyToken } from "./middlewares/auth.js";

// Configurations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public", "assets")));

// File Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Routes with files
app.use("/auth/register", upload.single("image"), register);
app.use("/posts/create", verifyToken, upload.single("image"), createPost);

// Routes
app.use("/auth", authRoutes);

app.use("/users", userRoutes);

app.use("/posts", postRoutes);

// Setting up mongoose
const PORT = process.env.PORT || 6001;

const mongooseInit = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB...");
    app.listen(PORT);
    console.log(`Server running at port: ${PORT}...`);
  } catch (error) {
    console.log(error);
  }
};

mongooseInit();
