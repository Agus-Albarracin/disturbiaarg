import { Router } from "express";
import { createOrder, receiveWebhook } from "../controllers/paymethod.controller.js";

const router = Router();

router.post("/createOrder", createOrder);
router.get("/success", (req, res) => res.send("success"));
router.get("/failure", (req, res) => res.send("failure"));
router.get("/pending", (req, res) => res.send("pending"));

router.post("/webhook", receiveWebhook);

export default router;