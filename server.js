const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app1 = express();
const PORT1 = process.env.PORT1 || 8000;

app1.use(express.json());
app1.use(cors());

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB for WIP"))
  .catch((err) => console.error("Error connecting to MongoDB for WIP:", err));

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

const BadgesSchema = new mongoose.Schema({
  smartprofessional: Boolean,
  futuremanager: Boolean,
  ceoinmaking: Boolean,
});

const wipSchema = new mongoose.Schema({
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
});

const WIP = mongoose.model("WIP", wipSchema);

app1.get("/wip", async (req, res) => {
  try {
    const wipData = await WIP.find();
    res.status(200).json(wipData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app1.listen(PORT1, () => {
  console.log(`Server for WIP running on port ${PORT1}`);
});

// 
// Second application for FormData
// 
const app2 = express();
const PORT2 = process.env.PORT2 || 8080;

app2.use(bodyParser.json());
app2.use(cors());

const secondDB = mongoose.createConnection(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
secondDB.on("connected", () =>
  console.log("Connected to MongoDB for FormData")
);
secondDB.on("error", (err) =>
  console.error("Error connecting to MongoDB for FormData:", err)
);

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
    originState: String,
  },
  { collection: "UserInfo" }
);

const FormData = secondDB.model("FormData", FormDataSchema);

app2.post("/api/user/:playerId", async (req, res) => {
  const playerId = req.params.playerId;
  const formData = new FormData({ ...req.body, playerId });

  try {
    const savedFormData = await formData.save();
    res.status(201).json(savedFormData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app2.get("/", (req, res) => {
  res.send("Hello from HTTP server");
});

app2.listen(PORT2, () => {
  console.log(`Server for FormData running on port ${PORT2}`);
});
