const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const { type } = require("os");
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

// Base route
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
    playerId: { type: String },
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

// ------------------------UserInfo-------------------------------
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
    cours: String,
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

// --------------college list---------------

const collegeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { collection: "collegeList" }
);

const College = mongoose.model("College", collegeSchema);

app.get("/api/user/colleges", async (req, res) => {
  const query = req.query.q ? req.query.q.toLowerCase() : "";

  try {
    const filteredColleges = await College.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    }).limit(10); // Limit results to 10

    if (filteredColleges.length === 0) {
      return res.status(201).json({ error: "No college data available" });
    }

    res.json(filteredColleges.map((college) => college.name));
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
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

// -----------------------Get User Info by WIP ID--------------------------------

app.get("/api/user/info", async (req, res) => {
  const { wipId } = req.params;

  try {
    const wipData = await WIP.findOne({ wip_id: wipId });

    if (!wipData) {
      // console.log(`WIP ID ${wipId} not found`);
      return res.status(404).json({ message: "WIP ID not found" });
    }

    // Debug: Print the entire wipData
    // console.log("WIP Data:", wipData);

    const playerId = wipData.playerId;
    // console.log(`Player ID from WIP: ${playerId}`);

    if (!playerId) {
      return res.status(404).json({ message: "Player ID not found in WIP data" });
    }

    const userInfo = await UserInfo.findOne({ playerId });

    if (!userInfo) {
      // console.log(`User with Player ID ${playerId} not found`);
      return res.status(404).json({ message: "User not found" });
    }
    
    const { firstName, lastName } = userInfo;
    return res.json({ firstName, lastName });

  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
