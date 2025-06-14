import {GenrateDiscription} from "../controllers/genrator.js"
import express from "express"
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.post("/genText", protectRoute , GenrateDiscription);


export default router