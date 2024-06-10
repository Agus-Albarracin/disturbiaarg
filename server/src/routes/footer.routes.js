import { Router } from "express";
import { getFooterInfo, updateFooterInfo } from "../controllers/footer.controller.js";

const router = Router();

router.get("/footer", getFooterInfo);


router.post("/footer", updateFooterInfo);


export default router;
