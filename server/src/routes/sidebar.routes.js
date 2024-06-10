import { Router } from "express";
import { getShippingPrices, updateShippingPrice } from "../controllers/sidebar.controller.js";

const router = Router();

router.get("/shipping", getShippingPrices);


router.post("/shipping", updateShippingPrice);


export default router;