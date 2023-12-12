import express from "express";
import { authorize, authorizedToTutor } from "../../middlewares/index.js";
import {
  createClassroom,
  deleteClassroom,
  updateClassroom,
  getAllClassrooms,
  getClassroom,
} from "./controllers.js";

const router = express.Router();

router.post("/create", authorize, authorizedToTutor, createClassroom);
router.post("/update", authorize, authorizedToTutor, updateClassroom);
router.post(
  "/delete/:classroomId",
  authorize,
  authorizedToTutor,
  deleteClassroom
);
router.get("/get", authorize, getAllClassrooms);
router.get("/get/:classroomId", authorize, getClassroom);

export default router;
