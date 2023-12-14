import express from "express";
import { authorize, authorizedToTutor } from "../../middlewares/authorize.js";
import { deleteFiles, getFile, getFiles, uploadFile } from "./controllers.js";
import multer from "multer";
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "classroom-files");
  },
  filename: function (req, file, cb) {
    let ext = "";
    if (file.originalname.split(".").length > 1) {
      ext = file.originalname.substring(file.originalname.lastIndexOf("."));
    }
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/upload",
  authorize,
  authorizedToTutor,
  upload.array("files", 5),
  uploadFile
);
router.post("/delete", authorize, authorizedToTutor, deleteFiles);
router.get("/get", authorize, getFiles);
router.get("/get/:fileId", authorize, getFile);
export default router;
