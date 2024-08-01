const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
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

//-------------------------WIP---------------------------------------

const TrainingStatisticsSchema = new mongoose.Schema({
  workplacetackled: Number,
  uniquemodels: Number,
  personalities: Number,
  workplacesimulation: Number,
});

const SoftSkillsSchema = new mongoose.Schema({
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
    name: { type: String },
    designation: { type: String },
    organization: { type: String },
    profileSummary: String,
    trainingStatistics: TrainingStatisticsSchema,
    analysis: { type: [String] },
    badges: BadgesSchema,
    ceoInMaking: Boolean,
    uniqueTraits: { type: [Boolean] },
    softskills: SoftSkillsSchema,
  },
  { collection: "wip" }
);

const WIP = mongoose.model("WIP", wipSchema);

// ------------------------Signup-------------------------------
const FormDataSchema = new mongoose.Schema(
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
    designation: String,
    highestEducation: String,
    gameLiteracy: String,
    playerId: String,
    locationState: String,
    originState: String
  },
  { collection: "UserInfo" }
);

const UserInfoSchema = new mongoose.Schema({
  playerId: { type: String, required: true },
  registered: { type: Number, default: 0 },
}, { collection: "UserInfo" });

const UserInfo = mongoose.model('UserInfo', UserInfoSchema);

const FormData = mongoose.model("FormData", FormDataSchema);
app.get("/", (req, res) => {
  res.send("Hello from http server");
});

// -----------------------Signup--------------------------------

app.post("/api/user/:playerId", async (req, res) => {
  const playerId = req.params.playerId;
  const formData = new FormData({ ...req.body, playerId });
  try {
    const savedFormData = await formData.save();
    await UserInfo.updateOne(
      { playerId: playerId },
      { $set: { registered: 1 } },
      { upsert: true }
    );
    res.status(201).json(savedFormData);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
// -------------------------------------------------------

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
