import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 3000;
export const DB_HOST = process.env.DB_HOST || "86.38.202.204";
export const DB_USER = process.env.DB_USER || "u211881118_disturbia";
export const DB_PASSWORD = process.env.DB_PASSWORD || "Disturbia0.*";
export const DB_DATABASE = process.env.DB_DATABASE || "u211881118_disturbia";
export const DB_PORT = process.env.DB_PORT || 3306;
