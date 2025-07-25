const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory database
let registrations = [];

// File storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Homepage
app.get('/', (req, res) => {
  res.send('✅ Boots and Glory Tournament Registration Backend is Running');
});

// Registration endpoint
app.post('/register', upload.single('receipt'), (req, res) => {
  const { name, phone } = req.body;
  const receiptFile = req.file?.filename || null;

  const newRegistration = {
    id: Date.now().toString(),
    name,
    phone,
    receipt: receiptFile,
    approved: false
  };

  registrations.push(newRegistration);
  res.status(200).json({ message: 'Registration received. Admin will contact you soon.' });
});

// Admin fetch registrations
app.get('/admin/registrations', (req, res) => {
  res.status(200).json(registrations);
});

// Admin approve
app.post('/admin/approve/:id', (req, res) => {
  const id = req.params.id;
  const registration = registrations.find(r => r.id === id);
  if (!registration) return res.status(404).json({ message: 'User not found' });

  registration.approved = true;
  res.status(200).json({ message: 'User approved successfully' });
});

app.listen(PORT, () => {
  console.log(`Boots and Glory site running on port ${PORT}`);
});const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory database
let registrations = [];

// File storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Homepage
app.get('/', (req, res) => {
  res.send('✅ Boots and Glory Tournament Registration Backend is Running');
});

// Registration endpoint
app.post('/register', upload.single('receipt'), (req, res) => {
  const { name, phone } = req.body;
  const receiptFile = req.file?.filename || null;

  const newRegistration = {
    id: Date.now().toString(),
    name,
    phone,
    receipt: receiptFile,
    approved: false
  };

  registrations.push(newRegistration);
  res.status(200).json({ message: 'Registration received. Admin will contact you soon.' });
});

// Admin fetch registrations
app.get('/admin/registrations', (req, res) => {
  res.status(200).json(registrations);
});

// Admin approve
app.post('/admin/approve/:id', (req, res) => {
  const id = req.params.id;
  const registration = registrations.find(r => r.id === id);
  if (!registration) return res.status(404).json({ message: 'User not found' });

  registration.approved = true;
  res.status(200).json({ message: 'User approved successfully' });
});

app.listen(PORT, () => {
  console.log(`Boots and Glory site running on port ${PORT}`);
});
