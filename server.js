const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

//HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//API routes 
app.get('/api/notes', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('api/notes', (req, res) => {
    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = notes.length + 1;

        notes.push(newNote);

        fs.writeFile('db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

//Delete route
app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);

    fs.readFile('db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notes =JSON.parse(data);

        notes = notes.filter((note) => note.id !== noteId);

        fs.writeFile('db.json', JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json({ message: 'Note deleted' });
        });
    });
});

//start server
app.listen(PORT, () => {
    console.log('Server listening on PORT ${PORT}');
});