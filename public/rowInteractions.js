// public/rowInteractions.js

export function setupRowInteractions(tr, item) {
    const editRowButton = tr.querySelector('.edit-row');
    const saveRowButton = tr.querySelector('.save-row');
    const yearsCell = tr.querySelector('.years-cell');
    const yearsDisplay = yearsCell.querySelector('.years-display');
    const yearsInput = yearsCell.querySelector('.years-input');
    const statusCell = tr.querySelector('.status-cell');
    const statusDisplay = statusCell.querySelector('.status-display');
    const filterStatus = statusCell.querySelector('.filterStatus');
    const notesCell = tr.querySelector('.notes-cell');
    const notesDisplay = notesCell.querySelector('.notes-display');
    const notesInput = notesCell.querySelector('.notes-input');
    const responseCell = tr.querySelector('.response');
    const notesCellElement = tr.querySelector('.notes-cell');

    const hideEditElements = () => {
        yearsDisplay.style.display = 'inline-block';
        yearsInput.style.display = 'none';
        statusDisplay.style.display = 'inline-block';
        filterStatus.style.display = 'none';
        notesDisplay.style.display = 'inline-block';
        notesInput.style.display = 'none';
        editRowButton.style.display = 'inline-block';
        saveRowButton.style.display = 'none';
        yearsInput.value = yearsDisplay.textContent;
        filterStatus.value = statusDisplay.textContent === 'null' ? '' : statusDisplay.textContent;
        notesInput.value = notesDisplay.textContent;
    };

    yearsInput.addEventListener('blur', (event) => {
        if (!isElementInRow(event.relatedTarget, tr)) {
            hideEditElements();
        }
    });

    filterStatus.addEventListener('blur', (event) => {
        if (!isElementInRow(event.relatedTarget, tr)) {
            hideEditElements();
            statusDisplay.textContent = filterStatus.value || 'null';
        }
    });

    notesInput.addEventListener('blur', (event) => {
        if (!isElementInRow(event.relatedTarget, tr)) {
            hideEditElements();
        }
    });

    yearsInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveRowButton.click();
        } else if (event.key === 'Escape') {
            hideEditElements();
        }
    });

    filterStatus.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveRowButton.click();
        } else if (event.key === 'Escape') {
            hideEditElements();
        }
    });

    notesInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            saveRowButton.click();
        } else if (event.key === 'Escape') {
            hideEditElements();
        }
    });


    editRowButton.addEventListener('click', () => {
        yearsDisplay.style.display = 'none';
        yearsInput.style.display = 'inline-block';
        statusDisplay.style.display = 'none';
        filterStatus.style.display = 'inline-block';
        notesDisplay.style.display = 'none';
        notesInput.style.display = 'inline-block';
        editRowButton.style.display = 'none';
        saveRowButton.style.display = 'inline-block';
        yearsInput.focus();
    });

    saveRowButton.addEventListener('click', () => {
        const id = saveRowButton.dataset.id;
        const newYears = yearsInput.value;
        const newStatus = filterStatus.value;
        const newNotes = notesInput.value;
        updateSubmissionStatusAndNotes(id, newStatus, newNotes, () => {
            yearsDisplay.textContent = newYears;
            statusDisplay.textContent = newStatus || 'null';
            notesDisplay.textContent = newNotes;
            hideEditElements();
        });
    });

    responseCell.addEventListener('click', () => {
        toggleExpandedText(responseCell);
    });

    notesCellElement.addEventListener('click', () => {
        toggleExpandedText(notesCellElement);
    });
}

function isElementInRow(element, row) {
    return element && element.closest('tr') && element.closest('tr') === row;
}