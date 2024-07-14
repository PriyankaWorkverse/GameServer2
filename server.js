const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

const corsOptions = {
  origin: 'https://signup.xbsl.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
  next();
});

const PORT = process.env.PORT || 80;
const MONGODB_URI = process.env.MONGODB_URI;

// MongoDB connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Data schema
const FormDataSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  gender: String,
  dob: Date,
  location: String,
  cityOfOrigin: String,
  currentStatus: String,
  collegeName: String,
  collegeNameLast: String,
  currentYear: Number,
  course: String,
  courseLast: String,
  industry: String,
  passoutYear: Number,
  designation: String,
  highestEducation: String,
  gameLiteracy: String,
  playerId: String
}, { collection: 'UserInfo' });

const FormData = mongoose.model('FormData', FormDataSchema);

// Routes
app.post('/api/user', async (req, res) => {
  const formData = new FormData({ ...req.body });

  try {
    const savedFormData = await formData.save();
    res.status(201).json(savedFormData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
