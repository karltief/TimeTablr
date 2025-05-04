const examForm = document.getElementById('exam-form');
const examList = document.getElementById('exam-list');
const timetableDiv = document.getElementById('timetable');
const optimizeBtn = document.getElementById('optimize-btn');
const examSettingsForm = document.getElementById('exam-settings-form');
const examStartInput = document.getElementById('exam-start');
const examEndInput = document.getElementById('exam-end');
const venueSizeInput = document.getElementById('venue-size');

// Halls
const hallForm = document.getElementById('hall-form');
const hallNameInput = document.getElementById('hall-name');
const hallSizeInput = document.getElementById('hall-size');
const hallComputerInput = document.getElementById('hall-computer');
const hallAccessInput = document.getElementById('hall-access');
const hallUnavailableInput = document.getElementById('hall-unavailable');
const hallList = document.getElementById('hall-list');
let manualHalls = [];
let csvHalls = [];
let halls = manualHalls; // Default to manual

// Add this near the top of the file, after the hall variables
const manualToggleBtn = document.getElementById('manual-toggle-btn');
const csvToggleBtn = document.getElementById('csv-toggle-btn');
const manualInputSection = document.getElementById('manual-input-section');
const csvInputSection = document.getElementById('csv-input-section');
const hallCsvInput = document.getElementById('hall-csv');
const hallCsvSummaryDiv = document.getElementById('hall-csv-summary');

// --- Hall available date ranges ---
let hallAvailableRanges = [];
const hallAvailableList = document.getElementById('hall-available-list');
const hallAvailableStart = document.getElementById('hall-available-start');
const hallAvailableEnd = document.getElementById('hall-available-end');
const addHallAvailableBtn = document.getElementById('add-hall-available');
if (addHallAvailableBtn) {
    addHallAvailableBtn.addEventListener('click', function() {
        const start = hallAvailableStart.value;
        const end = hallAvailableEnd.value;
        if (start && end && new Date(start) < new Date(end)) {
            hallAvailableRanges.push({ start, end });
            renderHallAvailableList();
            hallAvailableStart.value = '';
            hallAvailableEnd.value = '';
        }
    });
}
function renderHallAvailableList() {
    hallAvailableList.innerHTML = '';
    hallAvailableRanges.forEach((range, idx) => {
        const span = document.createElement('span');
        span.className = 'range';
        span.textContent = `${range.start.replace('T',' ')} to ${range.end.replace('T',' ')}`;
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-range';
        removeBtn.innerHTML = '&times;';
        removeBtn.onclick = () => {
            hallAvailableRanges.splice(idx, 1);
            renderHallAvailableList();
        };
        span.appendChild(removeBtn);
        hallAvailableList.appendChild(span);
    });
}

// Navigation
const examNav = document.getElementById('exam-nav');
const classNav = document.getElementById('class-nav');
const examPage = document.getElementById('exam-page');
const classPage = document.getElementById('class-page');

examNav.addEventListener('click', () => {
    examPage.style.display = '';
    classPage.style.display = 'none';
    examNav.classList.add('active');
    classNav.classList.remove('active');
});
classNav.addEventListener('click', () => {
    examPage.style.display = 'none';
    classPage.style.display = '';
    classNav.classList.add('active');
    examNav.classList.remove('active');

    // Attach dropdown logic every time you switch to class page
    const classFeatureDropdownBtn = document.getElementById('class-feature-dropdown-btn');
    const classFeatureDropdownList = document.getElementById('class-feature-dropdown-list');
    if (classFeatureDropdownBtn && classFeatureDropdownList && !classFeatureDropdownBtn.dataset.listener) {
        classFeatureDropdownBtn.addEventListener('click', function(e) {
            classFeatureDropdownList.classList.toggle('show');
            classFeatureDropdownBtn.classList.toggle('active');
        });
        document.addEventListener('click', function(e) {
            if (!classFeatureDropdownBtn.contains(e.target) && !classFeatureDropdownList.contains(e.target)) {
                classFeatureDropdownList.classList.remove('show');
                classFeatureDropdownBtn.classList.remove('active');
            }
        });
        classFeatureDropdownBtn.dataset.listener = 'true'; // Prevent duplicate listeners
    }
});

let exams = [];

// --- Required Features Dropdown Logic ---
const featureDropdownBtn = document.getElementById('feature-dropdown-btn');
const featureDropdownList = document.getElementById('feature-dropdown-list');
if (featureDropdownBtn && featureDropdownList) {
    featureDropdownBtn.addEventListener('click', function(e) {
        featureDropdownList.classList.toggle('show');
        featureDropdownBtn.classList.toggle('active');
    });
    document.addEventListener('click', function(e) {
        if (!featureDropdownBtn.contains(e.target) && !featureDropdownList.contains(e.target)) {
            featureDropdownList.classList.remove('show');
            featureDropdownBtn.classList.remove('active');
        }
    });
}

// --- Exams ---
if (examForm) {
    examForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('exam-id').value.trim();
        const degree = document.getElementById('exam-degree').value.trim();
        const duration = parseInt(document.getElementById('duration').value);
        const numPeople = parseInt(document.getElementById('num-students').value);
        const twosession = document.getElementById('exam-twosession').checked;
        const special = document.getElementById('exam-special').checked;
        const requirements = Array.from(document.querySelectorAll('.exam-feature:checked')).map(cb => cb.value);
        if (id && degree && duration && numPeople) {
            exams.push({ id, degree, duration, numPeople, twosession, special, requirements });
            renderExamList();
            examForm.reset();
            // Uncheck all feature checkboxes
            document.querySelectorAll('.exam-feature').forEach(cb => cb.checked = false);
        }
        featureDropdownList.classList.remove('show');
        featureDropdownBtn.classList.remove('active');
    });
}

function renderExamList() {
    examList.innerHTML = '';
    exams.forEach((exam, idx) => {
        const li = document.createElement('li');
        li.className = 'entry-card';
        
        // Create main display (condensed info)
        const span = document.createElement('span');
        span.textContent = `${exam.id} (${exam.degree})`;
        li.appendChild(span);

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering card click
            exams.splice(idx, 1);
            renderExamList();
        };
        li.appendChild(removeBtn);

        // Create details section
        const details = document.createElement('div');
        details.className = 'entry-details';
        const studentText = exam.numPeople === 1 ? 'student' : 'students';
        details.innerHTML = `
            <p><strong>Duration:</strong> ${exam.duration}h</p>
            <p><strong>Students:</strong> ${exam.numPeople} ${studentText}</p>
            <p><strong>Two-session:</strong> ${exam.twosession ? 'Yes' : 'No'}</p>
            <p><strong>Special Needs:</strong> ${exam.special ? 'Yes' : 'No'}</p>
            ${exam.requirements.length ? `<p><strong>Requirements:</strong> ${exam.requirements.join(', ')}</p>` : ''}
        `;
        
        // Add click handler for expanding/collapsing
        li.onclick = () => {
            details.classList.toggle('show');
        };

        examList.appendChild(li);
        examList.appendChild(details);
    });
}

optimizeBtn.addEventListener('click', function() {
    if (exams.length === 0) {
        timetableDiv.textContent = 'Please add some exams first.';
        return;
    }
    // Validate settings
    const startDate = examStartInput.value;
    const endDate = examEndInput.value;
    if (!startDate || !endDate) {
        timetableDiv.textContent = 'Please fill in exam period.';
        return;
    }
    if (halls.length === 0) {
        timetableDiv.textContent = 'Please add at least one exam hall.';
        return;
    }
    // Check if any exam exceeds all hall sizes
    const tooBig = exams.find(e => halls.every(h => h.size < e.numPeople));
    if (tooBig) {
        timetableDiv.textContent = `Exam for ${tooBig.course} (${tooBig.numPeople} students) exceeds all hall sizes.`;
        return;
    }
    const timetable = optimizeExams(exams, startDate, endDate, halls);
    renderTimetable(timetable);
});

// Helper: get all weekdays between two dates
function getExamDates(start, end) {
    const dates = [];
    let d = new Date(start);
    end = new Date(end);
    while (d <= end) {
        const day = d.getDay();
        if (day !== 0 && day !== 6) { // skip weekends
            dates.push(new Date(d));
        }
        d.setDate(d.getDate() + 1);
    }
    return dates;
}

// Schedule using real dates, halls, and people per course
function optimizeExams(exams, startDate, endDate, halls) {
    const dates = getExamDates(startDate, endDate);
    // Each slot is a {date, time, hall}
    const slots = [];
    for (const date of dates) {
        for (const time of ['9:00', '13:00']) {
            for (const hall of halls) {
                slots.push({ date, time, hall });
            }
        }
    }
    // Sort exams by degree group size (largest first)
    const degreeGroups = {};
    exams.forEach(exam => {
        if (!degreeGroups[exam.degree]) degreeGroups[exam.degree] = [];
        degreeGroups[exam.degree].push(exam);
    });
    const sortedExams = Object.values(degreeGroups)
        .sort((a, b) => b.length - a.length)
        .flat();
    // Assign slots
    const assigned = [];
    const usedSlots = new Set();
    for (let exam of sortedExams) {
        // Only consider slots with a hall big enough
        let possibleSlots = slots
            .map((s, idx) => ({ ...s, idx }))
            .filter(s => !usedSlots.has(s.idx) && s.hall.size >= exam.numPeople);
        if (assigned.length > 0) {
            const sameDegree = assigned.filter(e => e.degree === exam.degree);
            if (sameDegree.length > 0) {
                possibleSlots = possibleSlots.sort((a, b) => {
                    const minDistA = Math.min(...sameDegree.map(e => Math.abs((a.date - e.date) / (1000*60*60*24))));
                    const minDistB = Math.min(...sameDegree.map(e => Math.abs((b.date - e.date) / (1000*60*60*24))));
                    // Prefer 1pm and greater distance
                    return (minDistB - minDistA) || ((b.time === '13:00') - (a.time === '13:00'));
                });
            } else {
                possibleSlots = possibleSlots.sort((a, b) => (b.time === '13:00') - (a.time === '13:00'));
            }
        } else {
            possibleSlots = possibleSlots.sort((a, b) => (b.time === '13:00') - (a.time === '13:00'));
        }
        const chosenSlot = possibleSlots[0];
        if (!chosenSlot) {
            assigned.push({ ...exam, date: null, time: null, hall: null, error: `No available hall can fit ${exam.numPeople} students for exam ${exam.id}` });
            continue;
        }
        usedSlots.add(chosenSlot.idx);
        assigned.push({ ...exam, date: chosenSlot.date, time: chosenSlot.time, hall: chosenSlot.hall });
    }
    return assigned;
}

function renderTimetable(timetable) {
    timetableDiv.innerHTML = '';
    if (!timetable || timetable.length === 0) {
        timetableDiv.textContent = 'No timetable generated.';
        return;
    }
    const table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    const header = document.createElement('tr');
    ['Course', 'Degree', 'Duration', '# Students', 'Date', 'Time', 'Hall'].forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        th.style.borderBottom = '1px solid #ccc';
        th.style.padding = '0.5rem';
        table.appendChild(th);
        header.appendChild(th);
    });
    table.appendChild(header);
    timetable.forEach(e => {
        const row = document.createElement('tr');
        if (e.error) {
            const td = document.createElement('td');
            td.colSpan = 7;
            td.textContent = `${e.course}: ${e.error}`;
            td.style.color = 'red';
            row.appendChild(td);
        } else {
            [e.course, e.degree, e.duration + 'h', e.numPeople, e.date ? e.date.toLocaleDateString() : '', e.time || '', e.hall ? e.hall.name : ''].forEach(val => {
                const td = document.createElement('td');
                td.textContent = val;
                td.style.padding = '0.5rem';
                row.appendChild(td);
            });
        }
        table.appendChild(row);
    });
    timetableDiv.appendChild(table);
}

// Initial render for halls
renderHallList();

// --- Class Scheduler Dropdown Logic ---
const classFeatureDropdownBtn = document.getElementById('class-feature-dropdown-btn');
const classFeatureDropdownList = document.getElementById('class-feature-dropdown-list');
console.log('classFeatureDropdownBtn:', classFeatureDropdownBtn);
console.log('classFeatureDropdownList:', classFeatureDropdownList);
if (classFeatureDropdownBtn && classFeatureDropdownList) {
    classFeatureDropdownBtn.addEventListener('click', function(e) {
        console.log('Room Features button clicked');
        classFeatureDropdownList.classList.toggle('show');
        classFeatureDropdownBtn.classList.toggle('active');
    });
    document.addEventListener('click', function(e) {
        if (!classFeatureDropdownBtn.contains(e.target) && !classFeatureDropdownList.contains(e.target)) {
            classFeatureDropdownList.classList.remove('show');
            classFeatureDropdownBtn.classList.remove('active');
        }
    });
}

// --- Class Scheduler Logic ---
const classForm = document.getElementById('class-form');
const classListEl = document.getElementById('class-list');
const classOptimizeBtn = document.getElementById('class-optimize-btn');
const classTimetableDiv = document.getElementById('class-timetable');
let classes = [];
if (classForm) {
    classForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('class-id').value.trim();
        const degree = document.getElementById('class-degree').value.trim();
        const sections = parseInt(document.getElementById('class-sections').value);
        const hours = parseInt(document.getElementById('class-hours').value);
        const instructor = document.getElementById('class-instructor').value.trim();
        const features = Array.from(document.querySelectorAll('.class-feature:checked')).map(cb => cb.value);
        if (id && degree && sections && hours && instructor) {
            classes.push({ id, degree, sections, hours, instructor, features });
            renderClassList();
            classForm.reset();
            document.querySelectorAll('.class-feature').forEach(cb => cb.checked = false);
        }
        classFeatureDropdownList.classList.remove('show');
        classFeatureDropdownBtn.classList.remove('active');
    });
}
function renderClassList() {
    classListEl.innerHTML = '';
    classes.forEach((cls, idx) => {
        const li = document.createElement('li');
        li.textContent = `${cls.id} (${cls.degree}, ${cls.sections} sections, ${cls.hours}h, ${cls.instructor}${cls.features.length ? ', features: ' + cls.features.join('; ') : ''})`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '1rem';
        removeBtn.onclick = () => {
            classes.splice(idx, 1);
            renderClassList();
        };
        li.appendChild(removeBtn);
        classListEl.appendChild(li);
    });
}
if (classOptimizeBtn) {
    classOptimizeBtn.addEventListener('click', function() {
        classTimetableDiv.innerHTML = '<em>Class schedule optimization coming soon!</em>';
    });
}

// --- Hall Details CSV Upload ---

// Add the toggle functionality
if (manualToggleBtn && csvToggleBtn) {
    manualToggleBtn.addEventListener('click', () => {
        manualToggleBtn.classList.add('active');
        csvToggleBtn.classList.remove('active');
        manualInputSection.style.display = 'flex';
        csvInputSection.style.display = 'none';
        halls = manualHalls;
        renderHallList();
    });

    csvToggleBtn.addEventListener('click', () => {
        csvToggleBtn.classList.add('active');
        manualToggleBtn.classList.remove('active');
        csvInputSection.style.display = 'flex';
        manualInputSection.style.display = 'none';
        halls = csvHalls;
        renderHallList();
    });
}

// Update CSV upload handler
if (hallCsvInput) {
    hallCsvInput.addEventListener('change', function(e) {
        console.log('Hall CSV file selected');
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const text = evt.target.result;
            parseHallCsv(text);
        };
        reader.readAsText(file);
    });
}

// Update the hall form handler
if (hallForm) {
    hallForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Hall form submitted');
        const name = hallNameInput.value.trim();
        const size = parseInt(hallSizeInput.value);
        const features = [];
        if (hallComputerInput.checked) features.push('computer');
        if (hallAccessInput.checked) features.push('accessibility');
        let available = [];
        if (hallAvailableRanges && hallAvailableRanges.length > 0) {
            available = [...hallAvailableRanges];
        }
        if (name && size) {
            console.log('Adding new hall:', { name, size, features, available });
            manualHalls.push({ name, size, features, available });
            halls = manualHalls;
            renderHallList();
            hallForm.reset();
            if (hallAvailableRanges) hallAvailableRanges.length = 0;
            if (typeof renderHallAvailableList === 'function') renderHallAvailableList();
        }
    });
}

function renderHallList() {
    console.log('Rendering hall list, current halls:', halls);
    hallList.innerHTML = '';
    const currentHalls = halls || manualHalls;
    
    currentHalls.forEach((hall, idx) => {
        const li = document.createElement('li');
        li.className = 'entry-card';
        
        // Create main display (condensed info)
        const span = document.createElement('span');
        span.textContent = `${hall.name} (Capacity: ${hall.size})`;
        li.appendChild(span);

        // Create remove button
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent triggering card click
            currentHalls.splice(idx, 1);
            renderHallList();
        };
        li.appendChild(removeBtn);

        // Create details section
        const details = document.createElement('div');
        details.className = 'entry-details';
        details.innerHTML = `
            ${hall.features && hall.features.length ? `<p><strong>Features:</strong> ${hall.features.join(', ')}</p>` : ''}
            ${hall.available && hall.available.length ? `<p><strong>Available Dates:</strong></p>
            <ul style="margin-top: 0.5em;">
                ${hall.available.map(r => `<li>${r.start.replace('T', ' ')} to ${r.end.replace('T', ' ')}</li>`).join('')}
            </ul>` : ''}
        `;
        
        // Add click handler for expanding/collapsing
        li.onclick = () => {
            details.classList.toggle('show');
        };

        hallList.appendChild(li);
        hallList.appendChild(details);
    });
}

// --- Robust CSV parsing utility ---
function parseCsvLine(line) {
    // Handles quoted fields and commas inside quotes
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
}

function parseHallCsv(text) {
    csvHalls = []; // Reset on new upload
    let count = 0;
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    console.log('parseHallCsv: total lines (including header):', lines.length);
    for (let i = 1; i < lines.length; i++) { // skip header
        const line = lines[i];
        if (!line.trim()) continue;
        const cols = parseCsvLine(line);
        if (cols.length !== 7) {
            console.warn('Skipping line (wrong number of columns):', line, cols);
            continue;
        }
        const [name, size, computer, accessibility, projector, whiteboard, available] = cols;
        if (!name || !size) {
            console.warn('Skipping line (missing required fields):', line);
            continue;
        }
        const features = [];
        if (computer.toLowerCase() === 'true') features.push('computer');
        if (accessibility.toLowerCase() === 'true') features.push('accessibility');
        if (projector.toLowerCase() === 'true') features.push('projector');
        if (whiteboard.toLowerCase() === 'true') features.push('whiteboard');
        let availableArr = [];
        if (available) {
            availableArr = available.split(';').map(pair => {
                const [start, end] = pair.split('|').map(s => s.trim());
                return start && end ? { start, end } : null;
            }).filter(Boolean);
        }
        csvHalls.push({ name, size: parseInt(size), features: features, available: availableArr });
        count++;
    }
    halls = csvHalls;
    renderHallList();
    hallCsvSummaryDiv.innerHTML = `<strong>Loaded:</strong> ${count} halls from CSV.`;
}

// --- Exams, Rooms, Timeslots ---
let timeslots = [];

// Timeslots
const timeslotForm = document.getElementById('timeslot-form');
const timeslotList = document.getElementById('timeslot-list');
if (timeslotForm) {
    timeslotForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const date = document.getElementById('slot-date').value;
        const start = document.getElementById('slot-start').value;
        const length = parseInt(document.getElementById('slot-length').value);
        if (date && start && length) {
            timeslots.push({ date, start, length });
            renderTimeslotList();
            timeslotForm.reset();
        }
    });
}
function renderTimeslotList() {
    timeslotList.innerHTML = '';
    timeslots.forEach((slot, idx) => {
        const li = document.createElement('li');
        li.textContent = `${slot.date} ${slot.start} (${slot.length}h)`;
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.style.marginLeft = '1rem';
        removeBtn.onclick = () => {
            timeslots.splice(idx, 1);
            renderTimeslotList();
        };
        li.appendChild(removeBtn);
        timeslotList.appendChild(li);
    });
}

// --- Exam Details CSV Upload ---
const examCsvInput = document.getElementById('exam-csv');
const examCsvSummaryDiv = document.getElementById('exam-csv-summary');

if (examCsvInput) {
    examCsvInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(evt) {
            const text = evt.target.result;
            parseExamCsv(text);
        };
        reader.readAsText(file);
    });
}

function parseExamCsv(text) {
    let count = 0;
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    console.log('parseExamCsv: total lines (including header):', lines.length);
    exams = []; // Reset exams array when loading CSV
    for (let i = 1; i < lines.length; i++) { // skip header
        const line = lines[i];
        if (!line.trim()) continue;
        const cols = parseCsvLine(line);
        if (cols.length !== 10) {
            console.warn('Skipping line (wrong number of columns):', line, cols);
            continue;
        }
        const [id, degree, duration, numPeople, twosession, special, computer, accessibility, projector, whiteboard] = cols;
        if (!id || !degree || !duration || !numPeople) {
            console.warn('Skipping line (missing required fields):', line);
            continue;
        }
        const requirements = [];
        if (computer.toLowerCase() === 'true') requirements.push('computer');
        if (accessibility.toLowerCase() === 'true') requirements.push('accessibility');
        if (projector.toLowerCase() === 'true') requirements.push('projector');
        if (whiteboard.toLowerCase() === 'true') requirements.push('whiteboard');
        exams.push({
            id,
            degree,
            duration: parseInt(duration),
            numPeople: parseInt(numPeople),
            twosession: twosession === '1' || twosession.toLowerCase() === 'true',
            special: special === '1' || special.toLowerCase() === 'true',
            requirements
        });
        count++;
    }
    console.log('parseExamCsv: exams loaded:', count);
    renderExamList();
    examCsvSummaryDiv.innerHTML = `<strong>Loaded:</strong> ${count} exams from CSV.`;
}

// --- Optimizer: maximize distance between same-degree exams ---
// (Simple greedy approach for demo)
function optimizeExamsMaxDegreeDistance(exams, timeslots) {
    // Sort timeslots by date/time
    const sortedSlots = timeslots.slice().sort((a, b) => {
        const dA = new Date(a.date + 'T' + a.start);
        const dB = new Date(b.date + 'T' + b.start);
        return dA - dB;
    });
    // Group exams by degree
    const degreeGroups = {};
    exams.forEach(exam => {
        if (!degreeGroups[exam.degree]) degreeGroups[exam.degree] = [];
        degreeGroups[exam.degree].push(exam);
    });
    // Assign exams from each degree as far apart as possible
    const assignments = [];
    let slotIdx = 0;
    const usedSlots = new Set();
    Object.values(degreeGroups).forEach(group => {
        const n = group.length;
        // Spread exams as far apart as possible
        const step = Math.floor(sortedSlots.length / n);
        let idx = 0;
        group.forEach(exam => {
            // Find next available slot
            while (usedSlots.has(idx) && idx < sortedSlots.length) idx++;
            if (idx >= sortedSlots.length) idx = 0;
            while (usedSlots.has(idx) && idx < sortedSlots.length) idx++;
            assignments.push({ ...exam, slot: sortedSlots[idx] });
            usedSlots.add(idx);
            idx += step;
        });
    });
    return assignments;
}

// --- CSV Preview Buttons ---
const showExamCsvBtn = document.getElementById('show-exam-csv-btn');
const examCsvPreview = document.getElementById('exam-csv-preview');
if (showExamCsvBtn && examCsvPreview) {
    showExamCsvBtn.addEventListener('click', function() {
        examCsvPreview.classList.toggle('show');
        showExamCsvBtn.textContent = examCsvPreview.classList.contains('show') ? 
            'Hide Uploaded Exam CSV Data' : 'Show Uploaded Exam CSV Data';
    });
}

const showHallCsvBtn = document.getElementById('show-hall-csv-btn');
const hallCsvPreview = document.getElementById('hall-csv-preview');
if (showHallCsvBtn && hallCsvPreview) {
    showHallCsvBtn.addEventListener('click', function() {
        hallCsvPreview.classList.toggle('show');
        showHallCsvBtn.textContent = hallCsvPreview.classList.contains('show') ? 
            'Hide Uploaded Hall CSV Data' : 'Show Uploaded Hall CSV Data';
    });
}

console.log(exams)

getEventListeners(document.getElementById('show-exam-csv-btn'))

function getSelectedHallInputMethod() {
    return document.querySelector('input[name="hall-input-method"]:checked').value;
}

