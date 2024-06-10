import { Router } from "express";
import { getTickets, getTicketsSummary, getTicketById, putTicketById } from "../controllers/tickets.controller.js";

const router = Router();

router.get("/tickets", getTickets);
router.get('/tickets/summary', getTicketsSummary);
router.get('/tickets/:id', getTicketById);
router.put('/ticketstatus/:id', putTicketById)


export default router;