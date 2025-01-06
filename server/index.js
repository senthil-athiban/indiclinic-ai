import express from "express";
import router from "./services/anthropic";

const app = express();

app.router("/api/v1/suggestion", router);

app.listen(8080, () => console.log('server started on 8080'));