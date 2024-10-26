import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import router from "./routes/main";
import cookieParser from "cookie-parser";
import { currentUser, errorHandler, notFound } from "@redagtickets/common";

const app = express();

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET!));
app.use(currentUser(process.env.JWT_SECRET!));

app.use(router);

app.use(notFound);
app.use(errorHandler);

export default app;