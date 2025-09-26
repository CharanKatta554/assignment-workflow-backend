import prisma from "../database/prisma-client.js";

export const createAssignmentService = async (title, description, dueDate, teacherId) => {
    const assignment = await prisma.assignment.create({
        data: {
            title, description, dueDate: new Date(dueDate),
            createdById: teacherId
        }
    });
    return assignment;
}

export const updateAssignmentService = async (id, title, description, dueDate, teacherId) => {
    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
        return 'Not found';
    }
    if (existing.createdById !== teacherId) {
        return 'Forbidden';
    }
    if (existing.status !== 'DRAFT') {
        return 'Only draft can be edited';
    }
    const updated = await prisma.assignment.update({ where: { id }, data: { title, description, dueDate: dueDate ? new Date(dueDate) : undefined } });
    return updated;
}

export const deleteAssignmentService = async (id, teacherId) => {
    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
        return 'Not found';
    }
    if (existing.createdById !== teacherId) {
        return 'Forbidden';
    }

    const deleted = await prisma.assignment.delete({ where: { id } });
    return deleted;
}

export const publishAssignmentService = async (id, teacherId) => {
    const existing = await prisma.assignment.findFirst({ where: { id: id } });
    if (!existing) {
        return 'Not found';
    }
    if (existing.createdById !== teacherId) {
        return 'Forbidden';
    }
    if (existing.status !== 'DRAFT') {
        return 'Only draft can be published';
    }

    const updated = await prisma.assignment.update({ where: { id }, data: { status: 'PUBLISHED' } });
    return updated;
}

export const updateAssignmentStatusService = async (id, teacherId) => {
    const existing = await prisma.assignment.findUnique({ where: { id } });
    if (!existing) {
        return 'Not found';
    }
    if (existing.createdById !== teacherId) {
        return 'Forbidden';
    }
    if (existing.status !== 'PUBLISHED') {
        return 'Only published can be completed';
    }

    const updated = await prisma.assignment.update({ where: { id }, data: { status: 'COMPLETED' } });
    return updated;
}

export const getAllAssignmentsService = async (teacherId, status, page = 1, limit = 20) => {
    const where = { createdById: teacherId, ...(status ? { status } : {}) };
    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
        prisma.assignment.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
        prisma.assignment.count({ where })
    ]);
    return { items, total };
}

export const getAssignmentDetailService = async (id, studentId, role) => {
    const assignment = await prisma.assignment.findUnique({
        where: { id },
        include: { submissions: { include: { student: true } } }
    });
    if (!assignment) {
        return 'Not found';
    }

    if (assignment.status === 'DRAFT') {
        if (!(role === 'TEACHER' && id === assignment.createdById)) {
            return 'Forbidden';
        }
    } else if (assignment.status === 'PUBLISHED' || assignment.status === 'COMPLETED') {
        if (role === 'STUDENT') {
            const mine = await prisma.submission.findUnique({ where: { assignmentId_studentId: { assignmentId: id, studentId: studentId } } });
            return { assignment, mySubmission: mine };
        }
    }
}

export const listPublishedAssignmentsService = async (page = 1, limit = 20) => {
    const skip = (Number(page) - 1) * Number(limit);
    const where = { status: 'PUBLISHED' };
    const [items, total] = await Promise.all([
        prisma.assignment.findMany({ where, skip, take: Number(limit), orderBy: { createdAt: 'desc' } }),
        prisma.assignment.count({ where })
    ]);
    return { items, total };
}

export const submitAssignmentService = async (id, studentId, answer) => {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
        return 'Not found';
    }
    if (assignment.status !== 'PUBLISHED') {
        return 'Assignment not open';
    }
    if (new Date() > new Date(assignment.dueDate)) {
        return 'Past due date';
    }

    try {
        const submission = await prisma.submission.create({
            data: { assignmentId: id, studentId, answer }
        });
        return submission;
    } catch (err) {
        if (err.code === 'P2002') {
            return 'You already submitted';
        }
        console.error(err);
        return 'Server error';
    }
}

export const getSubmissionsForAssignmentService = async (id, userId) => {
    const assignment = await prisma.assignment.findUnique({ where: { id } });
    if (!assignment) {
        return 'Not found';
    }
    if (assignment.createdById !== userId) {
        return 'Forbidden';
    }

    const subs = await prisma.submission.findMany({ where: { assignmentId: id }, include: { student: true }, orderBy: { submittedAt: 'desc' } });
    return subs;
}

export const addMarksForAssignmentService = async (id, sid, reviewed = true, reviewNote, userId) => {
    const assignment = await prisma.assignment.findUnique({ where: { id } });

    if (!assignment) {
        return 'Not found';
    }
    if (assignment.createdById !== userId) {
        return 'Forbidden';
    }

    const updated = await prisma.submission.update({
        where: {
            assignmentId_studentId: {
                assignmentId: id,
                studentId: sid
            }
        },
        data: {
            reviewed: reviewed,
            reviewNote: reviewNote
        }
    });

    return updated;
}