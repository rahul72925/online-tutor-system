import { validateJwtToken, isStudent, isTutor } from "../utils/index.js";

export const authorize = (req, res, next) => {
  try {
    const authorizationToken = req.headers["authorization"];
    if (!authorizationToken) {
      throw new Error("TOKEN_NOT_AVAILABLE");
    }
    const [_, token] = authorizationToken.split(" ");
    if (!token) {
      throw new Error("TOKEN_NOT_AVAILABLE");
    }

    const decodedData = validateJwtToken(token);
    if (!decodedData) {
      throw new Error("INVALID_TOKEN");
    }
    req.userType = decodedData.userType;
    req.tutorId = isTutor(decodedData.userType) ? decodedData.tutorId : null;
    req.studentId = isStudent(decodedData.userType)
      ? decodedData.studentId
      : null;
    next();
  } catch (error) {
    if (error.message === "TOKEN_NOT_AVAILABLE") {
      return res.status(400).json({
        success: false,
        error: "token required",
      });
    } else if (error.message === "INVALID_TOKEN") {
      return res.status(400).json({
        success: false,
        error: "Invalid token",
      });
    } else {
      console.log(error);
      return res.status(500).json({
        success: false,
        error: "internal server error",
      });
    }
  }
};

export const authorizedToTutor = async (req, res, next) => {
  try {
    const { userType } = req;
    if (!isTutor(userType)) {
      throw new Error("UNAUTHORIZED_ACCESS");
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "access denied",
    });
  }
};
export const authorizedToStudent = async (req, res) => {
  try {
    const { userType } = req;
    if (!isStudent(userType)) {
      throw new Error("UNAUTHORIZED_ACCESS");
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "access denied",
    });
  }
};
