var express = require('express');
var router = express.Router();
var fs = require('fs');
var path=require('path');
const { title } = require('process');

function loadJSON() {
  const filePath = path.join(__dirname, '../public/notes.json');
  console.log(filePath);
  try {
    const data = fs.readFileSync(filePath, 'utf8'); 
    return JSON.parse(data);
  } 
  catch (err) {
    console.error('Error reading or parsing JSON:', err);
    return []; // Return a default value if there's an error
  }
}

function writeJSON(data) {
  const filePath = path.join(__dirname, '../public/notes.json');
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } 
  catch (err) {
    console.error('Error writing JSON:', err);
  }
}

/* GET home page. */
router.get('/', function (req, res, next) {
  const notes = loadJSON(); // Load all notes
  const searchQuery = req.query.search ? req.query.search.toLowerCase() : ""; // Get the search query

  // Filter notes if a search query is provided
  const filteredNotes = notes.filter(note => {
    const titleMatch = note.title.toLowerCase().includes(searchQuery);
    const contentMatch = note.content.toLowerCase().includes(searchQuery);
    return titleMatch || contentMatch; // Return true if either matches
  });

  res.render('index', { title: 'Notes', data: filteredNotes }); // Render the filtered notes
});

/* Render the create new note form.*/
router.get('/notes/new', function(req, res, next) {
  res.render('new', { title: 'New Note' });
});

/* Render the edit note form for a specific note. */
router.get('/notes/:id/edit', function(req, res, next) {
  const notes = loadJSON(); // Load all notes
  const noteId = req.params.id; // Get the note ID from the URL

  const noteToEdit = notes.find(note => note.id === noteId); // Find the specific note
  if (!noteToEdit) {
    return res.status(404).send('Note not found'); // Handle case where note doesn't exist
  }
  
  res.render('update', { title: 'Update Note', data: noteToEdit }); // Pass the note data to the view
});

/* Toggle the starred attribute of the note. */
router.get('/notes/:id/star', function(req, res, next) {
  const notes = loadJSON(); // Load all notes
  const noteId = req.params.id; // Get the note ID from the URL

  const note = notes.find(note => note.id === noteId); // Find the specific note
  if (!note) {
    return res.status(404).send('Note not found'); // Handle case where note doesn't exist
  }

  const newNote = {
    id: note.id,
    title: note.title,
    content: note.content,
    starred: !note.starred,
    color: note.color,
    createdAt: note.createdAt,
    updatedAt: new Date().toISOString() // Update timestamp
  };

  // Update the notes array
  const updatedNotes = notes.map(note => note.id === newNote.id ? newNote : note);

  // Write updated notes back to the file
  writeJSON(updatedNotes);

  // Render the updated list of notes
  res.render('index', { title: 'Notes', data: updatedNotes });

  res.render();
});

/* Handle the creation of a new note. */
router.post('/notes', function(req, res, next) {
  const notes = loadJSON(); // Load existing notes
  const noteId = new Date().toISOString();

  const noteTitle = req.body.title;
  const noteContent = req.body.content;
  const noteStarred = !!req.body.starred; // Convert to boolean
  const noteColor = req.body.color;
  const noteCreatedAt = new Date().toISOString(); // Consistent date format
  const noteUpdatedAt = new Date().toISOString();

  const newNote = {
    id: noteId,
    title: noteTitle,
    content: noteContent,
    starred: noteStarred,
    color: noteColor,
    createdAt: noteCreatedAt,
    updatedAt: noteUpdatedAt
  };

  notes.push(newNote); // Append the new note
  writeJSON(notes); // Save the updated array

  res.render('index', { title: 'Notes', data: notes }); // Render the page with updated notes
});

/* Handle the editing of an existing note. */
router.post('/update/:id', function(req, res, next) {
  const notes = loadJSON(); // Load all notes
  const noteId = req.params.id; // Get the note ID from the URL

  const noteToEdit = notes.find(note => note.id === noteId); // Find the specific note
  if (!noteToEdit) {
    return res.status(404).send('Note not found');
  }

  const noteTitle = req.body.title;
  const noteContent = req.body.content;
  const noteStarred = !!req.body.starred;
  const noteColor = req.body.color;

  const newNote = {
    id: noteToEdit.id,
    title: noteTitle,
    content: noteContent,
    starred: noteStarred,
    color: noteColor,
    createdAt: noteToEdit.createdAt,
    updatedAt: new Date().toISOString() // Update timestamp
  };

  // Update the notes array
  const updatedNotes = notes.map(note => note.id === newNote.id ? newNote : note);

  // Write updated notes back to the file
  writeJSON(updatedNotes);

  // Render the updated list of notes
  res.render('index', { title: 'Notes', data: updatedNotes });
});

/* Handle the deletion of a note. */
router.get('/delete/:id', function(req, res, next) {
  notes = loadJSON();
  var id= req.params.id;

  notes = notes.filter(note => note.id !== id); 

  writeJSON(notes);

  res.render('index', { title: 'Notes', data: loadJSON() });
});


module.exports = router;