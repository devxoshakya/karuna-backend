import { Router } from "express";
import { getDiagnosis } from "./diagnosis.controller";

const router = Router();

router.post("/", getDiagnosis);

export default router;
