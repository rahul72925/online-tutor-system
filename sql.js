import postgres from "postgres";
import { get_env } from "./utils/index.js";
import "dotenv/config";

const SQL = postgres(get_env("POSTGRES_DATA_BASE_URL"));

export default SQL;
