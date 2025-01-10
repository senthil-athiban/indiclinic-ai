import express from "express";
import { aiRouter } from "./routes/ai.route.js";

const app = express();
app.use(express.json());
app.use("/api/v1/ai", aiRouter);

app.listen(8080, () => console.log('server started on 8080'));