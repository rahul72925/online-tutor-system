import SQL from "../../sql.js";
import { getFileTypeFromMimeType } from "../../utils/index.js";
import fs from "fs";
const uploadFile = async (req, res) => {
  const files = req.files;
  try {
    const { classroomId, url, nameOnUrl = null } = req.body;

    if (!classroomId) throw new Error("CLASSROOM_ID_UNAVAILABLE");

    const { tutorId } = req;

    if (files.length === 0 && !url) {
      throw new Error("NO_FILES");
    }

    let filesToBeStore = [];
    // if files available, create new template array to match database columns
    if (files.length > 0) {
      filesToBeStore = files.map((eachFile) => ({
        tutor_id: tutorId,
        classroom_id: classroomId,
        file_name: eachFile.originalname,
        file_type: getFileTypeFromMimeType(eachFile.mimetype),
        file_path: eachFile.path,
      }));
    }

    if (url) {
      filesToBeStore.push({
        tutor_id: tutorId,
        classroom_id: classroomId,
        file_name: nameOnUrl,
        file_type: "URL",
        file_path: url,
      });
    }

    const insertedFiles =
      await SQL`INSERT INTO "onlineTutorSystem"."files" ${SQL(
        filesToBeStore,
        "tutor_id",
        "classroom_id",
        "file_name",
        "file_type",
        "file_path"
      )} returning id;`;

    res.status(200).json({
      success: true,
      data: insertedFiles,
    });
  } catch (error) {
    // remove file created with this request if request failed to proceed
    files.forEach((file) => fs.unlinkSync(file.path));
    if (error.message === "NO_FILES") {
      return res.status(401).json({
        success: false,
        error: "No files for upload",
      });
    } else if (error.message === "CLASSROOM_ID_UNAVAILABLE") {
      return res.status(401).json({
        success: false,
        error: "classroomId required",
      });
    } else {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        error: "Internal Server error",
      });
    }
  }
};
export { uploadFile };
