import { Router } from "express";
import { logIn, logOut} from "../controllers/usuario.controller.js";

const router = Router();

router.post("/usuario", logIn);
router.post("/usuario", logOut);



export default router;