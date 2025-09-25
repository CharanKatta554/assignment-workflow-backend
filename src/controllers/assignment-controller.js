import {
    createAssignmentService,
    updateAssignmentService,
    deleteAssignmentService,
    publishAssignmentService,
    updateAssignmentStatusService,
    getAllAssignmentsService,
    getAssignmentDetailService,
    listPublishedAssignmentsService,
    submitAssignmentService,
    getSubmissionsForAssignmentService,
    addMarksForAssignmentService
} from '../services/assignment-service.js';

export const createAssignment = async (req, res) => {
    const { title, description, dueDate } = req.body;
    const teacherId = req.user.id;
    if (!title || !dueDate) {
        return res.status(400).json({ error: 'title and dueDate required' });
    }

    const assignment = await createAssignmentService(title, description, dueDate, teacherId);
    res.json(assignment);
}

export const updateAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const teacherId = req.user.id;

    const updated = await updateAssignmentService(id, req.body.title, req.body.description, req.body.dueDate, teacherId);

    if (updated === 'Not found') {
        return res.status(404).json({ error: 'Not found' });
    }
    if (updated === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    if (updated === 'Only draft can be edited') {
        return res.status(400).json({ error: 'Only draft can be edited' });
    }
    res.json(updated);
}

export const deleteAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const teacherId = req.user.id;

    const result = await deleteAssignmentService(id, teacherId);

    if (result === 'Not found') {
        return res.status(404).json({ error: 'Not found' });
    }
    if (updated === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    res.json({ status: 'Deleted successfully' });
}

export const publishAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const teacherId = req.user.id;
    const updated = await publishAssignmentService(id, teacherId);

    if (updated === 'Not found') {
        return res.status(404).json({ error: 'Not found' });
    }
    if (updated === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    if (updated === 'Only draft can be published') {
        return res.status(400).json({ error: 'Only draft can be published' });
    }

    res.json(updated);
}

export const updateAssignmentStatus = async (req, res) => {
    const id = Number(req.params.id);
    const teacherId = req.user.id;
    const updated = await updateAssignmentStatusService(id, teacherId);

    if (updated === 'Not found') {
        return res.status(404).json({ error: 'Not found' });
    }
    if (updated === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    if (updated === 'Only published can be completed') {
        return res.status(400).json({ error: 'Only published can be completed' });
    }

    res.json(updated);
}

export const getAllAssignments = async (req, res) => {
    const teacherId = req.user.id;
    const { status, page = 1, limit = 20 } = req.query;
    const { items, total } = await getAllAssignmentsService(teacherId, status, page, limit);
    res.json({ items, total, page: Number(page), limit: Number(limit) });
}

export const getAssignmentDetails = async (req, res) => {
    console.log('getAssignmentDetails called');
    const id = Number(req.params.id);
    const role = req.user.role;
    const studentId = req.user.id;
    console.log('Params:', req.params, 'User:', req.user);
    const result = await getAssignmentDetailService(id, studentId, role);
    console.log('Result:', result);
    if (result === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    if (!result.assignment) {
        return res.status(404).json({ error: 'Not found' });
    }
    const { assignment, mySubmission } = result;
    return res.json({ assignment, mySubmission });
}

export const listPublishedAssignments = async (req, res) => {
    const { page = 1, limit = 20 } = req.query;
    const { items, total } = await listPublishedAssignmentsService(page, limit);
    return res.json({ items, total, page: Number(page), limit: Number(limit) });
}

export const submitAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const studentId = req.user.id;
    const { answer } = req.body;

    if (!answer) return res.status(400).json({ error: 'Answer required' });

    const result = await submitAssignmentService(id, studentId, answer);
    if (result === 'Not found') {
        return res.status(404).json({ error: 'Not found' });
    }
    if (result === 'Assignment not open') {
        return res.status(400).json({ error: 'Assignment not open' });
    }
    if (result === 'Past due date') {
        return res.status(400).json({ error: 'Past due date' });
    }
    if (result === 'You already submitted') {
        return res.status(409).json({ error: 'You already submitted' });
    }
    return res.json(result);
}

export const getSubmissionsForAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const subs = await getSubmissionsForAssignmentService(id, req.user.id);
    if (subs === 'Not found') {
        return res.status(404).json({ error: 'Not found' });
    }
    if (subs === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json(subs);
}

export const addMarksForAssignment = async (req, res) => {
    const id = Number(req.params.id);
    const sid = Number(req.params.sid);
    const { reviewed = true, reviewNote } = req.body;
    const updated = await addMarksForAssignmentService(id, sid, reviewed, reviewNote, req.user.id);
    if (updated === 'Not found') {
        return res.status(404).json({ error: 'Not found' });
    }
    if (updated === 'Forbidden') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json(updated);
}