import express from "express";
import { body } from "express-validator";
import { login } from "../controllers/auth-controller.js";

const router = express.Router();

router.post('/login', body('username'), body('password').isLength({ min: 3 }), login);

export default router;