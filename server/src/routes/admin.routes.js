import { Router } from "express";
import { authMiddleware } from "../helper/authMiddle.js";

const router = Router();

router.get('/admin', authMiddleware, (req, res) => {
    res.status(200).json({ message: 'Welcome to admin area' });
});
  
  
export default router;