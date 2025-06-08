import express from "express"
import protectRoute from "../middleware/protectRoute.js"
import {FindUser, updateUser} from "../controllers/user.js"

const router = express.Router();

router.get("/:id", protectRoute , FindUser);

router.post("/update/:id", protectRoute , updateUser);


export default router