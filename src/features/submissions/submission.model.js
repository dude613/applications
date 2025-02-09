// src/features/submissions/submission.model.js
const pool = require('../../config/db');

const Submission = {
  getAll: async ({ filters, limit, offset }) => {
    let query = `
      SELECT id, created_at, name, email, phone, response, resumeurl, years, degree, status, notes
      FROM public.applications
    `;
    const whereClauses = [];
    const values = [];
    let idx = 1;

    // Build dynamic filtering
    if (filters) {
      if (filters.id) {
        whereClauses.push(`id = $${idx++}`);
        values.push(filters.id);
      }
      if (filters.name) {
        whereClauses.push(`name ILIKE $${idx++}`);
        values.push(`%${filters.name}%`);
      }
      if (filters.email) {
        whereClauses.push(`email ILIKE $${idx++}`);
        values.push(`%${filters.email}%`);
      }
      if (filters.phone) {
        whereClauses.push(`phone ILIKE $${idx++}`);
        values.push(`%${filters.phone}%`);
      }
      if (filters.response) {
        whereClauses.push(`response ILIKE $${idx++}`);
        values.push(`%${filters.response}%`);
      }
      if (filters.resumeurl) {
        whereClauses.push(`resumeurl ILIKE $${idx++}`);
        values.push(`%${filters.resumeurl}%`);
      }
      if (filters.years) {
        whereClauses.push(`years ILIKE $${idx++}`);
        values.push(`%${filters.years}%`);
      }
      if (filters.degree) {
        whereClauses.push(`degree ILIKE $${idx++}`);
        values.push(`%${filters.degree}%`);
      }
      if (filters.created_at) {
        // Assuming an exact date match for simplicity.
        whereClauses.push(`DATE(created_at) = $${idx++}`);
        values.push(filters.created_at);
      }
      if (filters.status && filters.status.trim()) {
        whereClauses.push(`status = $${idx++}`);
        values.push(filters.status.trim().toLowerCase());
      }
    }

    if (whereClauses.length) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }
    
    query += ' ORDER BY created_at ASC';

    if (limit) {
      query += ` LIMIT $${idx++}`;
      values.push(limit);
    }
    if (offset) {
      query += ` OFFSET $${idx++}`;
      values.push(offset);
    }

    const result = await pool.query(query, values);
    const submissions = result.rows;

    function extractYearValue(yearText) {
      const matches = yearText.match(/\d+/g);
      if (!matches) return 0;
      return Math.max(...matches.map(Number));
    }

    submissions.sort((a, b) => extractYearValue(b.years) - extractYearValue(a.years));
    console.log('Executing query:', query, 'with values:', values);
    return submissions;
  },

  count: async ({ filters }) => {
    let query = `SELECT COUNT(*) FROM public.applications`;
    const whereClauses = [];
    const values = [];
    let idx = 1;

    if (filters) {
      if (filters.id) {
        whereClauses.push(`id = $${idx++}`);
        values.push(filters.id);
      }
      if (filters.name) {
        whereClauses.push(`name ILIKE $${idx++}`);
        values.push(`%${filters.name}%`);
      }
      if (filters.email) {
        whereClauses.push(`email ILIKE $${idx++}`);
        values.push(`%${filters.email}%`);
      }
      if (filters.phone) {
        whereClauses.push(`phone ILIKE $${idx++}`);
        values.push(`%${filters.phone}%`);
      }
      if (filters.response) {
        whereClauses.push(`response ILIKE $${idx++}`);
        values.push(`%${filters.response}%`);
      }
      if (filters.resumeurl) {
        whereClauses.push(`resumeurl ILIKE $${idx++}`);
        values.push(`%${filters.resumeurl}%`);
      }
      if (filters.years) {
        whereClauses.push(`years ILIKE $${idx++}`);
        values.push(`%${filters.years}%`);
      }
      if (filters.degree) {
        whereClauses.push(`degree ILIKE $${idx++}`);
        values.push(`%${filters.degree}%`);
      }
      if (filters.created_at) {
        whereClauses.push(`DATE(created_at) = $${idx++}`);
        values.push(filters.created_at);
      }
      if (filters.status && filters.status.trim()) {
        whereClauses.push(`status = $${idx++}`);
        values.push(filters.status.trim().toLowerCase());
      }
      if (filters.notes) {
        whereClauses.push(`notes ILIKE $${idx++}`);
        values.push(`%${filters.notes}%`);
      }
    }

    if (whereClauses.length) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    const result = await pool.query(query, values);
    return parseInt(result.rows[0].count, 10);
  },

  // Update the years column for a given submission
  updateYears: async (id, newYears) => {
    let query = 'UPDATE public.applications SET years = $1 WHERE id = $2 RETURNING *';
    let result = await pool.query(query, [newYears, id]);
    return result.rows[0];
  },

  updateStatus: async (id, newStatus) => {
    const allowedStatuses = ['null', 'rejected', 'screening', 'interviewing', 'hired', 'saved', null];
    if (!allowedStatuses.includes(newStatus)) {
      throw new Error('Invalid status: ' + newStatus + '. Allowed statuses are: ' + allowedStatuses.join(', '));
    }
    let query = 'UPDATE public.applications SET status = $1 WHERE id = $2 RETURNING *';
    let result = await pool.query(query, [newStatus, id]);
    return result.rows[0];
  },

  updateNotes: async (id, newNotes) => {
    let query = 'UPDATE public.applications SET notes = $1 WHERE id = $2 RETURNING *';
    let result = await pool.query(query, [newNotes, id]);
    return result.rows[0];
  }
};

module.exports = Submission;
