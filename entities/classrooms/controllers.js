import SQL from "../../sql.js";

const createClassroom = async (req, res) => {
  try {
    const { name, description, linkedStudentIds = [] } = req.body;
    if (!name || !description) {
      throw new Error("NAME_DESCRIPTION_ERROR");
    }
    const tutorId = req.tutorId;
    const newClassroom =
      await SQL`INSERT INTO "onlineTutorSystem"."classrooms" (name, description, "tutor_id")
    values(${name},${description},${tutorId}) returning id;`;

    if (linkedStudentIds.length > 0) {
      await SQL`INSERT INTO "onlineTutorSystem"."classrooms_students" (classroom_id,student_id) values ${linkedStudentIds.map(
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
export { createClassroom };
