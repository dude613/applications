// public/main.js
import { setupRowInteractions } from './rowInteractions.js';

document.addEventListener('DOMContentLoaded', initializePage);

let currentPage = 1;
let totalPages = 1;
const limit = 20;

function initializePage() {
    setupEventListeners();
    fetchSubmissions();
}

function setupEventListeners() {
    document.getElementById('applyFilters').addEventListener('click', fetchSubmissions);
    document.getElementById('nextPage').addEventListener('click', goToNextPage);
    document.getElementById('prevPage').addEventListener('click', goToPrevPage);
}

function goToNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchSubmissions();
    }
}

function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchSubmissions();
    }
}

function fetchSubmissions() {
    console.log('Fetching data...');
    console.log('currentPage:', currentPage, 'limit:', limit);
    const filters = getFilters();
    console.log('Filters - id:', filters.id, 'name:', filters.name, 'email:', filters.email, 'status:', filters.status);

    const params = createSearchParams(currentPage, limit, filters);
    console.log('Final params:', params.toString());

    fetch(`/api/submissions?${params.toString()}`)
        .then(response => response.json())
        .then(data => {
            totalPages = data.pagination.totalPages;
            updatePageInfo(data.pagination.page, totalPages);
            renderTable(data.data);
        })
        .catch(err => console.error('Error fetching data:', err));
}

function getFilters() {
    return {
        id: document.getElementById('filterId').value,
        name: document.getElementById('filterName').value,
        email: document.getElementById('filterEmail').value,
        status: document.getElementById('filterStatus').value,
    };
}

function createSearchParams(page, limit, filters) {
    const params = new URLSearchParams({
        page: page,
        limit: limit,
    });
    if (filters.id) {
        params.append('id', filters.id);
    }
    if (filters.name) {
        params.append('name', filters.name);
    }
    if (filters.email) {
        params.append('email', filters.email);
    }
    if (filters.status) {
        params.append('status', filters.status);
    }
    return params;
}

function updatePageInfo(currentPage, totalPages) {
    const pageInfoElement = document.getElementById('pageInfo');
    if (pageInfoElement) {
        pageInfoElement.textContent = `Page ${currentPage} of ${totalPages}`;
    } else {
        console.error('Element with id "pageInfo" not found.');
    }
}

function renderTable(data) {
    console.log('Rendering table...', data);
    const tbody = document.querySelector('#submissionsTable tbody');
    tbody.innerHTML = ''; // Clear existing rows
    data.forEach(item => {
        const tr = createTableRow(item);
        tbody.appendChild(tr);
    });
}

function createTableRow(item) {
    console.log('Creating table row for item:', item);
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td style="padding: 10px; border-bottom: 1px solid #eee">${item.id}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee">${new Date(item.created_at).toLocaleString()}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee">${item.email}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee">${item.phone}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee" class="response" data-full-response="${item.response}" data-truncated-response="${truncateText(item.response, 15)}">${truncateText(item.response, 15)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee"><a href="${item.resumeurl}" target="_blank">View Resume</a></td>
        <td style="padding: 10px; border-bottom: 1px solid #eee" class="years-cell" data-years="${formatYears(item.years)}">
            <span class="years-display">${formatYears(item.years)}</span>
            <input type="text" class="years-input" style="display:none;" value="${formatYears(item.years)}" />
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee">${item.degree}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee" class="status-cell" data-status="${item.status}">
            <span class="status-display">${item.status || 'null'}</span>
            <select class="filterStatus" style="display:none;">
                <option value="">null</option>
                <option value="rejected">rejected</option>
                <option value="screening">screening</option>
                <option value="interviewing">interviewing</option>
                <option value="hired">hired</option>
                <option value="saved">saved</option>
            </select>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee" class="notes-cell" data-full-notes="${item.notes}" data-truncated-notes="${truncateText(item.notes, 15)}">
            <span class="notes-display">${truncateText(item.notes, 15)}</span>
            <textarea class="notes-input" style="display:none;">${item.notes || ''}</textarea>
        </td>
        <td>
            <button class="edit-row" data-id="${item.id}">Edit</button>
            <button class="save-row" data-id="${item.id}" style="display:none;">Save</button>
        </td>
    `;
    setupRowInteractions(tr, item);
    return tr;
}


function truncateText(text, wordLimit) {
    if (!text) return '';
    const words = text.split(' ');
    const truncatedText = words.slice(0, wordLimit).join(' ');
    return words.length > wordLimit ? `${truncatedText}...` : truncatedText;
}

function formatYears(yearsString) {
    return yearsString
        ? yearsString
            .split(',')
            .map(part => part.replace(/\b(year|years)\b/gi, '').trim())
            .filter(Boolean)
            .join(', ')
        : '';
}


function updateSubmissionStatusAndNotes(id, status, notes, callback) {
    updateSubmissionStatus(id, status);
    updateSubmissionNotes(id, notes, callback);
}

function updateSubmissionStatus(id, status) {
    fetch(`/api/submissions/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: status })
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                });
            }
            return response.json();
        })
        .then(updatedSubmission => {
            console.log('Status updated successfully:', id);
            alert('Status updated successfully');
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Error updating status' + error);
        });
}


function updateSubmissionNotes(id, notes, callback) {
    fetch(`/api/submissions/${id}/notes`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ notes: notes })
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`HTTP error! status: ${response.status}, body: ${text}`);
                });
            }
            return response.json();
        })
        .then(updatedSubmission => {
            console.log('Notes updated successfully:', id);
            alert('Notes updated successfully');
            if (callback) {
                callback(updatedSubmission);
            }
        })
        .catch(error => {
            console.error('Error updating notes:', error);
            alert('Error updating notes' + error);
        });
}

function toggleExpandedText(cellElement) {
    const isExpanded = cellElement.classList.contains('expanded');
    if (isExpanded) {
        cellElement.textContent = cellElement.getAttribute('data-truncated-response') || cellElement.getAttribute('data-truncated-notes');
    } else {
        cellElement.textContent = cellElement.getAttribute('data-full-response') || cellElement.getAttribute('data-full-notes');
    }
    cellElement.classList.toggle('expanded');
}