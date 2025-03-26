import { Router } from "express";
import { startChat, sendMessage } from "./chat.controller.js";

const router = Router();

router.post("/start", startChat);
router.post("/send", sendMessage);

export default router;
