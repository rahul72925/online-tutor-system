import express from "express";
import { authorize, authorizedToTutor } from "../../middlewares/index.js";
import { createClassroom } from "./controllers.js";

const router = express.Router();

router.post("/create", authorize, authorizedToTutor, createClassroom);

export default router;
