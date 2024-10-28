import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import { currentUser, errorHandler, notFound } from "@redagtickets/common";
dotenv.config();
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET!));
app.use(currentUser(process.env.JWT_SECRET!));

app.use(notFound);
app.use(errorHandler);


export default app;