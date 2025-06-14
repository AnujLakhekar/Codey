import express from "express"
import connect from "./database/connect.js"
import {config} from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"
// import routes 

// cloud 

import cloudinary from 'cloudinary';
const { v2: cloudinaryV2 } = cloudinary;


import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import blogRoute from "./routes/blog.route.js"
import genratorRoute from "./routes/genrator.route.js"

// configuration
config()

const app = express();
const PORT = 4000;


// apo uses
app.use(cors({
  origin: ["https://codey-delta.vercel.app", "http://localhost:5173"],
  credentials: true,
}))

cloudinary.config({
  cloud_name: "dy3skg2zb",
  api_key: "398963283713765",
  api_secret: "ZXstN452aRuP3X3MMm2DJjyl8QI"
});

app.use(cookieParser())
app.use(express.json({limit: '10mb'}));

// app routes 

app.use("/api/auth/", authRoutes)
app.use("/api/user/", userRoutes)
app.use("/api/blog/", blogRoute)
app.use("/api/gemini/", genratorRoute)

app.get("/api/ping", (req, res) => {
  res.status(200).json({
    message: "pong",
  })
})

// connecting database and starting the server

app.listen(PORT,  (e) => {
   connect(process.env.MONGODB_URL)
  console.log("Server started on ", PORT)
})
