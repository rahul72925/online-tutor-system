import express from "express";
import { authorize, authorizedToTutor } from "../../middlewares/index.js";
import { createClassroom, updateClassroom } from "./controllers.js";

const router = express.Router();

router.post("/create", authorize, authorizedToTutor, createClassroom);
router.post("/update", authorize, authorizedToTutor, updateClassroom);

export default router;
