import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  publishAssignment,
  updateAssignmentStatus,
  getAllAssignments,
  getAssignmentDetails,
  listPublishedAssignments,
  submitAssignment,
  getSubmissionsForAssignment,
  addMarksForAssignment,
  getReviewedAssignments,
} from '../controllers/assignment-controller.js';

const router = express.Router();

router.post('/', authenticateToken, authorizeRoles('TEACHER'), createAssignment);

router.put('/:id', authenticateToken, authorizeRoles('TEACHER'), updateAssignment);

router.delete('/:id', authenticateToken, authorizeRoles('TEACHER'), deleteAssignment);

router.post('/:id/publish', authenticateToken, authorizeRoles('TEACHER'), publishAssignment);

router.post('/:id/complete', authenticateToken, authorizeRoles('TEACHER'), updateAssignmentStatus);

router.get('/', authenticateToken, authorizeRoles('TEACHER'), getAllAssignments);

router.get('/getReviewedAssignments', authenticateToken, authorizeRoles('STUDENT'),getReviewedAssignments);

router.get('/:id', authenticateToken, getAssignmentDetails);

router.get('/published/list', authenticateToken, authorizeRoles('STUDENT'), listPublishedAssignments);

router.post('/:id/submissions', authenticateToken, authorizeRoles('STUDENT'), submitAssignment);

router.get('/:id/submissions', authenticateToken, authorizeRoles('TEACHER'), getSubmissionsForAssignment);

router.post('/:id/submissions/:sid/review', authenticateToken, authorizeRoles('TEACHER'), addMarksForAssignment);

export default router;
