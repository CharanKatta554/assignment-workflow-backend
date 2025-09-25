import jwt from 'jsonwebtoken';
import { loginService } from "../services/auth-service.js";

export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await loginService(username, password);

    if (user === 'Username is not found' || user === 'Password is incorrect') {
        return res.status(401).json({ error: user });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, role: user.role, user: { id: user.id, email: user.email, name: user.name } });
}