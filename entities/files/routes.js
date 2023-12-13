import express from "express";
import { authorize, authorizedToTutor } from "../../middlewares/authorize.js";
import { uploadFile } from "./controllers.js";
import multer from "multer";
const upload = multer({ dest: "classroom-files" });
// const upload = multer();

const router = express.Router();

router.post(
  "/upload",
  authorize,
  authorizedToTutor,
  upload.array("files", 5),
  uploadFile
);
export default router;
