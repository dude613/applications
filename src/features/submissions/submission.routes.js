// src/features/submissions/submission.routes.js
const express = require('express');
const SubmissionController = require('./submission.controller');

const router = express.Router();

// GET /api/submissions?name=John&page=1&limit=10...
router.get('/', SubmissionController.getSubmissions);

router.put('/:id/years', SubmissionController.updateYears);
router.put('/:id/status', SubmissionController.updateStatus);
router.put('/:id/notes', SubmissionController.updateNotes);

module.exports = router;
