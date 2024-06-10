import { Router } from "express";
import { getbtnnavInfo, updatebtnnavInfo } from "../controllers/btnnav.controller.js";

const router = Router();

router.get("/btnnav", getbtnnavInfo);


router.post("/btnnav", updatebtnnavInfo);


export default router;