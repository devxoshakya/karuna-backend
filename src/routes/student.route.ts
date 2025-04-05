import { Router } from "express";
import { getAllStudents } from "./student.controller.js";

const router = Router();

router.get("/", getAllStudents);

export default router;
