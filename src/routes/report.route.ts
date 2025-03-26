import { Router } from "express";
import multer from "multer";
import { processReport } from "./report.controller.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory

router.post("/", upload.single("file"), processReport);

export default router;
