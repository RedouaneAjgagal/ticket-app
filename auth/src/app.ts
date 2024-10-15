import express from "express";
import "express-async-errors";
import router from "./routes/main";
import { currentUser, errorHandler, notFound } from "./middlewares";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET!));

app.use(currentUser);
app.use(router);

app.use(notFound);
app.use(errorHandler);

export default app;