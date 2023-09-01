const express = require('express');
const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;
const dbFilePath = path.join(__dirname, 'db', 'db.json');

//middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static('public'));

//API routes 
app.get('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        res.json(notes);
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        const newNote = req.body;
        newNote.id = uuidv4();
        notes.push(newNote);

        fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

//Delete route
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(dbFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);

        notes = notes.filter((note) => note.id !== noteId);

        fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
            if (err) throw err;
            res.json({ message: 'Note deleted' });
        });
    });
});

//HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//start server
app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});