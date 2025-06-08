import express from "express"
import {signup, signin, getMe, google, logout} from "../controllers/auth.js"
import protectRoute from "../middleware/protectRoute.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/google", google);
router.post("/", protectRoute, getMe);


export default router