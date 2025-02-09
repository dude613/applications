// src/features/submissions/submission.service.js
const Submission = require('./submission.model');

const SubmissionService = {
  getSubmissions: async (queryParams) => {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const offset = (page - 1) * limit;

    // Extract filters from the query parameters.
    const filters = {};
    if (queryParams.id) filters.id = queryParams.id;
    if (queryParams.name) filters.name = queryParams.name;
    if (queryParams.email) filters.email = queryParams.email;
    if (queryParams.phone) filters.phone = queryParams.phone;
    if (queryParams.response) filters.response = queryParams.response;
    if (queryParams.resumeurl) filters.resumeurl = queryParams.resumeurl;
    if (queryParams.years) filters.years = queryParams.years;
    if (queryParams.degree) filters.degree = queryParams.degree;
    if (queryParams.created_at) filters.created_at = queryParams.created_at;

    const data = await Submission.getAll({ filters, limit, offset });
    const total = await Submission.count({ filters });

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  },

  //Update years value via the model
  updateYears: async (id, newYears) => {
    return await Submission.updateYears(id, newYears);
  },

  // Update status value via the model
  updateStatus: async (id, newStatus) => {
    //console.log('Service updateStatus - ID:', id, 'Status:', newStatus);
    const result = await Submission.updateStatus(id, newStatus);
    //console.log('Service updateStatus - Result:', result);
    return result;
  },

  // Update notes value via the model
  updateNotes: async (id, newNotes) => {
    return await Submission.updateNotes(id, newNotes);
  }
};

module.exports = SubmissionService;
