
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('public'));

const DB_FILE = './db.json';

function loadDB() {
    return JSON.parse(fs.readFileSync(DB_FILE));
}

function saveDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/rules', (req, res) => {
    res.sendFile(__dirname + '/public/rules.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/submit-registration', (req, res) => {
    const { phone, contact } = req.body;
    const file = req.files?.receipt;

    if (!file) return res.status(400).send('No file uploaded.');

    const filename = Date.now() + '_' + file.name;
    file.mv(__dirname + '/uploads/' + filename);

    const db = loadDB();
    db.registrations.push({ phone, contact, receipt: filename, approved: false });
    saveDB(db);

    res.send('Registration submitted. Admin will get back to you shortly.');
});

app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin.html');
});

app.post('/admin-login', (req, res) => {
    const { password } = req.body;
    if (password === 'admin123') {
        const db = loadDB();
        res.json(db.registrations);
    } else {
        res.status(403).send('Invalid password.');
    }
});

app.post('/approve', (req, res) => {
    const { phone } = req.body;
    const db = loadDB();
    const entry = db.registrations.find(r => r.phone === phone);
    if (entry) entry.approved = true;
    saveDB(db);
    res.send('User approved.');
});

app.listen(PORT, () => {
    console.log(`Boots and Glory site running on port ${PORT}`);
});
