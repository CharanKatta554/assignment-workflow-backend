import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const passwordForTeacher = await bcrypt.hash('Tailwebs@123', 10);
    const passwordForStudent1 = await bcrypt.hash('Charan@123', 10);
    const passwordForStudent2 = await bcrypt.hash('Sanjay@123', 10);
    await prisma.user.upsert({
        where: { username: 'tail.webs@gmail.com' },
        update: {},
        create: { username: 'tail.webs@gmail.com', name: 'Tailwebs', password: passwordForTeacher, role: 'TEACHER' }
    });
    await prisma.user.upsert({
        where: { username: 'charan.katta@gmail.com' },
        update: {},
        create: { username: 'charan.katta@gmail.com', name: 'Charan', password: passwordForStudent1, role: 'STUDENT' }
    });
    await prisma.user.upsert({
        where: { username: 'sanjay@gmail.com' },
        update: {},
        create: { username: 'sanjay@gmail.com', name: 'Sanjay', password: passwordForStudent2, role: 'STUDENT' }
    });
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
