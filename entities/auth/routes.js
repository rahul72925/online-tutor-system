import express from "express";
import { handleLogIn } from "./controllers.js";

const router = express.Router();

router.post("/login", handleLogIn);

export default router;
