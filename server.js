// Week 1 Assignment
// console.log("Hello Node.js!");

import express from "express";

const NODE_ENV = "production";
const PORT = 3000;

const app = express();

app.get("/", (req, res) => {
    res.send("Hello from Express (using nodemon)!!");
});

app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
});
