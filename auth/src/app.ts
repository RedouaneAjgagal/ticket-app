import express from "express";
import router from "./routes/main";
import { errorHandler } from "./middlewares";

const app = express();

app.use(express.json());

app.use(router);

app.use(errorHandler);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});