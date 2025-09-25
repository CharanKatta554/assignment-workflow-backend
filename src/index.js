import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import authRoutes from './routes/auth-route.js';
import assignmentRoutes from './routes/assignment-route.js';

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);

app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err.message);
    res.status(500).json({ error: "Something went wrong!" });
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection:", reason);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
