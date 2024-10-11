import express from "express";

const app = express();

app.use(express.json());

app.get("/api/users/current-user", (req, res) => {
    res.status(200).json({ name: "Redouane" });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});