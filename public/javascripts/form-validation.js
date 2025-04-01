document.querySelector('#newNoteForm').addEventListener('submit', function (event) {
const title = document.querySelector('input[name="title"]');
const content = document.querySelector('textarea[name="content"]');
let isValid = true;

// Clear previous error messages
document.querySelectorAll('.error').forEach(error => error.remove());

// Title Validation
if (!title.value.trim()) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = 'Title is required.';
    title.after(error);
    isValid = false;
}

// Content Validation
if (!content.value.trim()) {
    const error = document.createElement('div');
    error.className = 'error';
    error.textContent = 'Content is required.';
    content.after(error);
    isValid = false;
}

// Prevent form submission if validation fails
if (!isValid) {
    event.preventDefault();
}
});