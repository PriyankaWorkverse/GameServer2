const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
var csv = require("csv");
const fs = require("fs");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Hello from http server");
});

//-------------------------WIP---------------------------------------

const TrainingStatisticsSchema = new mongoose.Schema({
  workplacetackled: Number,
  uniquemodels: Number,
  personalities: Number,
  workplacesimulation: Number,
});

const SoftSkillsSchema = new mongoose.Schema({
  skills: {
    creativeProblemSolving: Number,
    entrepreneurialMindset: Number,
    Negotiation: Number,
    storyTelling: Number,
    firstPrinciplesThinking: Number,
    emotionalIntelligence: Number,
    Collaboration: Number,
    sharpRemoteCommunication: Number,
    productivityManagement: Number,
  },
  smartestAlternative: {
    capable: Number,
    impressive: Number,
    exceptional: Number,
  },
  existingIdeas: {
    capable: Number,
    impressive: Number,
    exceptional: Number,
  },
  lackResources: {
    capable: Number,
    impressive: Number,
    exceptional: Number,
  },
  capable: String,
  impressive: String,
  exceptional: String,
});

// Define badges schema
const BadgesSchema = new mongoose.Schema({
  smartprofessional: Boolean,
  futuremanager: Boolean,
  ceoinmaking: Boolean,
});

const wipSchema = new mongoose.Schema(
  {
    wip_id: { type: String },
    playerURL: { type: String },
    name: { type: String },
    designation: { type: String },
    organization: { type: String },
    profileSummary: String,
    trainingStatistics: TrainingStatisticsSchema,
    analysis: { type: [String] },
    badges: BadgesSchema,
    ceoInMaking: Boolean,
    jobFunction: { type: [Boolean] },
    uniqueTraits: { type: [Boolean] },
    softskills: SoftSkillsSchema,
  },
  { collection: "wip" }
);

const WIP = mongoose.model("WIP", wipSchema);

// ------------------------Signup-------------------------------
const UserInfoSchema = new mongoose.Schema(
  {
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
    yearOfExp: Number,
    designation: String,
    highestEducation: String,
    gameLiteracy: String,
    playerId: { type: String, required: true },
    locationState: String,
    originState: String,
    registered: { type: Number, default: 0 },
  },
  { collection: "UserInfo" }
);

const UserInfo = mongoose.model("UserInfo", UserInfoSchema);

// -----------------------Signup--------------------------------

app.post("/api/user/:playerId", async (req, res) => {
  const playerId = req.params.playerId;
  const formData = { ...req.body, playerId, registered: 1 };

  try {
    const existingUser = await UserInfo.findOne({ playerId });

    if (existingUser) {
      // Update the existing document
      await UserInfo.updateOne({ playerId: playerId }, { $set: formData });
      res.status(200).json({ message: "User data updated successfully" });
    } else {
      // Create a new document
      const newUser = new UserInfo(formData);
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

let colleges = [];

fs.readFile("db/database.csv", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the CSV file:", err);
    return;
  }

  const lines = data.split("\n");

  lines.forEach((line, index) => {
    if (index === 0) {
      // console.log("Header:", line);
      return;
    }

    let collegeName = line.trim();

    if (collegeName.startsWith('"') && collegeName.endsWith('"')) {
      collegeName = collegeName.slice(1, -1);
    }

    collegeName = collegeName.replace(/\\/g, "");

    collegeName = collegeName.replace(/^["']+|["']+$/g, "");

    collegeName = collegeName.trim();

    if (collegeName) {
      colleges.push(collegeName);
    }
  });

  // console.log("CSV Loaded!");
});

app.get("/colleges", (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : "";
  const filteredColleges = colleges.filter((college) =>
    college.toLowerCase().includes(query)
  );
  if (filteredColleges.length === 0) {
    return res.status(404).json({ error: "No college data available" });
  }
  res.json(filteredColleges);
});

// -----------------------WIP--------------------------------

app.get("/api/user/wip", async (req, res) => {
  try {
    const wipData = await WIP.find();
    res.status(200).json(wipData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// -------------------------------------------------------

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
