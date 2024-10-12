import express from "express";
import "express-async-errors";
import router from "./routes/main";
import { errorHandler, notFound } from "./middlewares";

const app = express();

app.use(express.json());

app.use(router);

app.use(notFound);
app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});