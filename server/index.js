import express from "express";
import { aiRouter } from "./routes/ai.route.js";
import cors from "cors";
import { config } from "dotenv";
import winston from 'winston';
import morgan from 'morgan';
import responseTime from 'response-time';
import { v4 as uuidv4 } from 'uuid';
import expressWinston from 'express-winston';
import { WebSocketServer} from 'ws';

const wss = new WebSocketServer({
    port: 3000,
    perMessageDeflate: {
        zlibDeflateOptions: {
            // See zlib defaults.
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        // Other options settable:
        clientNoContextTakeover: true, // Defaults to negotiated value.
        serverNoContextTakeover: true, // Defaults to negotiated value.
        serverMaxWindowBits: 10, // Defaults to negotiated value.
        // Below options specified as default values.
        concurrencyLimit: 10, // Limits zlib concurrency for perf.
        threshold: 1024 // Size (in bytes) below which messages
        // should not be compressed if context takeover is disabled.
    }
});

wss.on('connection',  (ws) => {
    ws.on('error', () => console.log('Error from websocket'));
    ws.on('message', (data) => {
        console.log('data:', JSON.parse(data));
    })
    ws.send('Hello from server');
});

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
};


const app = express();

// Middleware
app.use(morgan('dev'));

// Example route with async handler
app.get('/api/example', asyncHandler(async (req, res) => {
    logger.info('API called', {
        requestId: req.id,
        path: req.path
    });
    res.status(500).json({ error: 'Internal server error' });
}));

app.use(express.json());
app.use(cors({
    origin: "*"
}))
app.use("/api/v1/ai", aiRouter);

app.listen(8080, () => console.log('server started on 8080'));