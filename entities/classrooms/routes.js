import express from "express";
import { authorize, authorizedToTutor } from "../../middlewares/index.js";
import {
  createClassroom,
  deleteClassroom,
  updateClassroom,
  getAllClassrooms,
  getClassroom,
  addStudentsToClassroom,
  removeStudentsClassroom,
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
router.post(
  "/add-students",
  authorize,
  authorizedToTutor,
  addStudentsToClassroom
);
router.post(
  "/remove-students",
  authorize,
  authorizedToTutor,
  removeStudentsClassroom
);
router.get("/get", authorize, getAllClassrooms);
router.get("/get/:classroomId", authorize, getClassroom);

export default router;
