import prisma from "../database/prisma-client.js";
import bcrypt from 'bcrypt';

export const loginService = async (username, password) => {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
        return 'Username is not found';
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
        return 'Password is incorrect';
    }

    return user;
}