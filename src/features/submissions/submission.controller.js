// src/features/submissions/submission.controller.js
const SubmissionService = require('./submission.service');

const SubmissionController = {
  getSubmissions: async (req, res, next) => {
    try {
      const result = await SubmissionService.getSubmissions(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  // Handle updating the years field
  updateYears: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { years } = req.body; // new years value from the client
      const updatedSubmission = await SubmissionService.updateYears(id, years);
      res.json(updatedSubmission);
    } catch (error) {
      next(error);
    }
  },

  // Handle updating the status field
  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // new status value from the client
      //console.log('Controller updateStatus - ID:', id, 'Status:', status);
      const updatedSubmission = await SubmissionService.updateStatus(id, status);
      //console.log('Controller updateStatus - Updated Submission:', updatedSubmission);
      res.json(updatedSubmission);
    } catch (error) {
      next(error);
    }
  },

  // Handle updating the notes field
  updateNotes: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { notes } = req.body; // new notes value from the client
      const updatedSubmission = await SubmissionService.updateNotes(id, notes);
      res.json(updatedSubmission);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = SubmissionController;
