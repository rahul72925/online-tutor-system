import SQL from "../../sql.js";
import {
  generateHash,
  generateJwtToken,
  validateHash,
} from "../../utils/index.js";

const allowedUserType = ["TUTOR", "STUDENT"];

export const handleLogIn = async (req, res) => {
  try {
    const { username, password, userType } = req.body;

    if (!username || !password) {
      throw new Error("INVALID_USERNAME_PASSWORD");
    }
    if (!userType || !allowedUserType.includes(userType)) {
      throw new Error("INVALID_USER_TYPE");
    }

    let token;
    let id;
    // handle tutor
    if (userType === "TUTOR") {
      const userData =
        await SQL`select * from "onlineTutorSystem"."tutors" where username=${username};`;
      if (userData.length === 0) {
        // insert tutor details
        const hash = await generateHash(password);
        const insertReturn =
          await SQL`INSERT INTO "onlineTutorSystem"."tutors" (username, password) values(${username},${hash})  returning id;`;

        if (insertReturn.length === 0) {
          throw new Error("FAILED_TO_INSERT");
        }

        const userInfo = {
          tutorId: insertReturn[0].id,
          userType: "TUTOR",
          iat: Math.floor(Date.now() / 1000) - 30,
        };
        id = insertReturn[0].id;
        token = generateJwtToken(userInfo, {
          expiresIn: 60 * 60 * 24,
        });
      } else {
        // validate password and send generate token
        const isPasswordCorrect = validateHash(password, userData[0].password);
        if (!isPasswordCorrect) {
          throw new Error("INCORRECT_PASSWORD");
        }
        const userInfo = {
          tutorId: userData[0].id,
          userType: "TUTOR",
          iat: Math.floor(Date.now() / 1000) - 30,
        };
        id = userData[0].id;
        token = generateJwtToken(userInfo, {
          expiresIn: 60 * 60 * 24,
        });
      }
    } else {
      // for student
      const userData =
        await SQL`select * from "onlineTutorSystem"."students" where username=${username};`;
      if (userData.length === 0) {
        const hash = await generateHash(password);
        const insertReturn =
          await SQL`INSERT INTO "onlineTutorSystem"."students" (username, password) values(${username},${hash})  returning id;`;

        if (insertReturn.length === 0) {
          throw new Error("FAILED_TO_INSERT");
        }

        const userInfo = {
          studentId: insertReturn[0].id,
          userType: "STUDENT",
          iat: Math.floor(Date.now() / 1000) - 30,
        };
        id = insertReturn[0].id;
        token = generateJwtToken(userInfo, {
          expiresIn: 60 * 60 * 24,
        });
      } else {
        const isPasswordCorrect = validateHash(password, userData[0].password);
        if (!isPasswordCorrect) {
          throw new Error("INCORRECT_PASSWORD");
        }
        const userInfo = {
          tutorId: userData[0].id,
          userType: "STUDENT",
          iat: Math.floor(Date.now() / 1000) - 30,
        };
        id = userData[0].id;
        token = generateJwtToken(userInfo, {
          expiresIn: 60 * 60 * 24,
        });
      }
    }
    res.status(200).json({
      success: true,
      token,
      id,
    });
  } catch (error) {
    console.log("error", error);
    if (error.message === "INVALID_USERNAME_PASSWORD") {
      res.status(400).json({
        success: false,
        error: "Username or Password is missing",
      });
    } else if (error.message === "INVALID_USER_TYPE") {
      res.status(400).json({
        success: false,
        error: "Invalid user type",
      });
    } else if (error.message === "FAILED_TO_INSERT") {
      res.status(500).json({
        success: false,
        error: "Failed to create user",
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
};
