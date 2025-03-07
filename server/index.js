import express from "express";
import { aiRouter } from "./routes/ai.route.js";
import cors from "cors";
import { config } from "dotenv";
import winston from 'winston';
import morgan from 'morgan';
import responseTime from 'response-time';
import { v4 as uuidv4 } from 'uuid';
import expressWinston from 'express-winston';

// // Logger configuration
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//     ),
//     transports: [
//         new winston.transports.File({ filename: 'error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'combined.log' })
//     ]
// });

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple()
//     }));
// }

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};


const app = express();

// Middleware
// app.use(responseTime());
// app.use(morgan('dev'));
// app.use(expressWinston.logger({
//     winstonInstance: logger,
//     meta: true,
//     msg: 'HTTP {{req.method}} {{req.url}}',
//     expressFormat: true
// }));

// Example route with async handler
app.get('/api/example', asyncHandler(async (req, res) => {
    logger.info('API called', { 
        requestId: req.id,
        path: req.path 
    });
    res.status(500).json({error: 'Internal server error'});
    // res.json({ status: 'success' });
}));

// Error logging middleware
// app.use(expressWinston.errorLogger({
//     winstonInstance: logger
// }));

app.use(express.json());
app.use(cors({
    origin: "*"
}))
app.use("/api/v1/ai", aiRouter);

app.listen(8080, () => console.log('server started on 8080'));