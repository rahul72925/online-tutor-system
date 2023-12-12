import SQL from "../../sql.js";
import { isStudent, isTutor } from "../../utils/index.js";

const createClassroom = async (req, res) => {
  try {
    const { name, description, toBeLinkStudentIds = [] } = req.body;
    if (!name || !description) {
      throw new Error("NAME_DESCRIPTION_ERROR");
    }
    const tutorId = req.tutorId;
    const newClassroom =
      await SQL`INSERT INTO "onlineTutorSystem"."classrooms" (name, description, "tutor_id")
    values(${name},${description},${tutorId}) returning id;`;

    if (toBeLinkStudentIds.length > 0) {
      await SQL`INSERT INTO "onlineTutorSystem"."classrooms_students" (classroom_id,student_id) values ${toBeLinkStudentIds.map(
        (eachId, index) => SQL`(${newClassroom[0].id},${eachId})`
      )};`;
    }
    res.status(200).json({
      success: true,
      error: null,
      data: {
        classroom: newClassroom[0],
      },
    });
  } catch (error) {
    console.log(error);
    if (error.message === "NAME_DESCRIPTION_ERROR") {
      return res.status(400).json({
        success: false,
        error: "name and description are required",
      });
    }
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

const updateClassroom = async (req, res) => {
  try {
    const {
      name = null,
      description = null,
      toBeLinkStudentIds = [],
      classroomId,
    } = req.body;
    if (!classroomId) {
      throw new Error("CLASSROOM_ID_NOT_AVAILABLE");
    }

    if (!name && !description && toBeLinkStudentIds.length === 0) {
      throw new Error("NOT_DATA_TO_UPDATE");
    }
    const updatedInfo = {};
    if (name !== null) updatedInfo.name = name;
    if (description !== null) updatedInfo.description = description;
    let updatedClassroom = null;
    if (name || description) {
      updatedClassroom =
        await SQL`UPDATE "onlineTutorSystem"."classrooms" set ${SQL(
          updatedInfo
        )} , updated_at = now() where id=${classroomId} returning *;`;
    }
    if (toBeLinkStudentIds.length > 0) {
      const mappedDataWithClassroomId = toBeLinkStudentIds.map((eachId) => ({
        classroom_id: classroomId,
        student_id: eachId,
      }));
      // link classroom with student || if student already link with classroom then do nothing
      await SQL`INSERT INTO "onlineTutorSystem"."classrooms_students" ${SQL(
        mappedDataWithClassroomId,
        "classroom_id",
        "student_id"
      )} ON CONFLICT (classroom_id, student_id) DO NOTHING;`;
    }
    res.status(200).json({
      success: true,
      error: null,
      data: {
        updatedClassroom,
        studentLinked: toBeLinkStudentIds.length,
      },
    });
  } catch (error) {
    if (error.message === "CLASSROOM_ID_NOT_AVAILABLE") {
      return res.status(401).json({
        status: false,
        error: "classroomId is required",
      });
    } else if (error.message === "NOT_DATA_TO_UPDATE") {
      return res.status(401).json({
        status: false,
        error: "no data available for update",
      });
    } else {
      console.log("error", error);
      return res.status(500).json({
        status: false,
        error: error.message,
      });
    }
  }
};

const deleteClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    if (!classroomId) {
      throw new Error("CLASSROOM_ID_UNAVAILABLE");
    }
    await SQL`UPDATE "onlineTutorSystem"."classrooms" set is_archived = true where id=${classroomId};`;
    return res.status(200).json({
      success: true,
      message: "classroom deleted successfully",
    });
  } catch (error) {
    if (error.message === "CLASSROOM_ID_UNAVAILABLE") {
      return res.status(401).json({
        success: false,
        error: "classroomId required",
      });
    } else {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
};

const getAllClassrooms = async (req, res) => {
  try {
    const { userType, tutorId, studentId } = req;

    if (isTutor(userType)) {
      //get all the classrooms of a tutor
      const allClassRoomsCreatedByTutor =
        await SQL`SELECT * FROM "onlineTutorSystem"."classrooms" where tutor_id = ${tutorId} and is_archived =false;`;

      return res.status(200).json({
        success: true,
        data: {
          classrooms: allClassRoomsCreatedByTutor,
        },
      });
    }
    if (isStudent(userType)) {
      const studentClassrooms = await SQL`
      SELECT oc.* from "onlineTutorSystem"."classrooms" oc 
      LEFT JOIN "onlineTutorSystem"."classrooms_students" ocs 
      ON oc.id = ocs."classroom_id" 
      where oc."is_archived" = false and ocs."student_id" = ${studentId};
      `;
      return res.status(200).json({
        success: true,
        data: {
          classrooms: studentClassrooms,
        },
      });
    }
    throw new Error("INSUFFICIENT_DATA");
  } catch (error) {
    if (error.message === "INSUFFICIENT_DATA") {
      return res.status(401).json({
        success: false,
        error: "userType not available",
      });
    } else {
      console.log("get classroom error", error);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
};

const getClassroom = async (req, res) => {
  try {
    const { userType, studentId, tutorId } = req;
    const { classroomId } = req.params;
    if (!userType) throw new Error("INSUFFICIENT_DATA");

    if (!classroomId) throw new Error("CLASSROOM_ID_UNAVAILABLE");

    let classroom = [];
    if (isTutor(userType)) {
      classroom =
        await SQL`SELECT * FROM "onlineTutorSystem"."classrooms" where is_archived=false and tutor_id = ${tutorId} and id=${classroomId};`;
    }
    if (isStudent(userType)) {
      classroom = await SQL`
      SELECT oc.* from "onlineTutorSystem"."classrooms" oc 
      LEFT JOIN "onlineTutorSystem"."classrooms_students" ocs 
      ON oc.id = ocs."classroom_id" 
      where oc."is_archived" = false and ocs."student_id" = ${studentId} and oc.id = ${classroomId};
      `;
    }
    return res.status(200).json({
      success: true,
      data: {
        classroom,
      },
    });
  } catch (error) {
    if (error.message === "INSUFFICIENT_DATA") {
      return res.status(401).json({
        success: false,
        error: "userType not available",
      });
    } else if (error.message === "CLASSROOM_ID_UNAVAILABLE") {
      return res.status(401).json({
        success: false,
        error: "classroomId not available",
      });
    } else {
      console.log(error.message);
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
};

export {
  createClassroom,
  updateClassroom,
  deleteClassroom,
  getAllClassrooms,
  getClassroom,
};
