const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); 

const app = express();

// Use cors middleware
app.use(cors());
app.use(bodyParser.json());

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
app.post('/api/user/:playerId', async (req, res) => {
  const playerId = req.params.playerId;
  const formData = new FormData({ ...req.body, playerId });

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
