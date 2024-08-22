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
  res.send("Go away!! you are seen, I can see your exact location");
});

//-------------------------Video Schema---------------------------------------

  const videoSchema = new mongoose.Schema({
    videoId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      required: true,
    },
    tags: [String],
  }, { collection: "VideoBank" });

  const Video = mongoose.model("Video", videoSchema);

//-------------------------WIP Schema---------------------------------------

const GeneralSaveDataSchema = new mongoose.Schema(
  {
    kamai: { type: Number },
    playerBadgeData: { type: [String] },
  },
  { collection: "GeneralSaveData" }
);

const GeneralSaveData = mongoose.model("GeneralSaveData", GeneralSaveDataSchema);

const TrainingStatisticsSchema = new mongoose.Schema({
  workplacetackled: Number,
  uniquemodels: Number,
  personalities: Number,
  workplacesimulation: Number,
});

const AnalysisSchema = new mongoose.Schema({
  approach_to_work: {
    strengths: [String],
    to_improve: [String],
  },
  key_traits: {
    strengths: [String],
    to_improve: [String],
  },
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

const BadgesSchema = new mongoose.Schema({
  smartprofessional: Boolean,
  futuremanager: Boolean,
  ceoinmaking: Boolean,
});

const JobFunctionSchema = new mongoose.Schema({
  job_function: String,
  description: String,
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
    analysis: AnalysisSchema,
    badges: BadgesSchema,
    ceoInMaking: Boolean,
    jobFunction: { type: [JobFunctionSchema] },
    uniqueTraits: { type: [Boolean] },
    softskills: SoftSkillsSchema,
  },
  { collection: "wip" }
);

const WIP = mongoose.model("WIP", wipSchema);



// ------------------------UserInfo Schema-------------------------------
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

// -----------------------Video Api--------------------------------

app.get("/api/videos/:videoId", async (req, res) => {
  const { videoId } = req.params;

  try {
    const videoData = await Video.findOne({ videoId });

    if (videoData) {
      res.status(200).json(videoData);
    } else {
      res.status(404).json({ message: "Video not found" });
    }
  } catch (err) {
    console.error("Error fetching video data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// -----------------------Signup Api--------------------------------

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

// --------------college list Api---------------

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
      name: { $regex: query, $options: "i" }, 
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

// -----------------------WIP Api--------------------------------

app.get("/api/user/wip/:wipId", async (req, res) => {
  try {
    const { wipId } = req.params;
    const wipData = await WIP.findOne({ wip_id: wipId });

    if (wipData) {
      res.status(200).json(wipData);
    } else {
      res.status(404).json({ message: "WIP data not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------Get User Info by WIP ID --------------------------------

app.get("/api/user/info/:wipId", async (req, res) => {
  const { wipId } = req.params;

  try {
    const wipData = await WIP.findOne({ wip_id: wipId });

    if (!wipData) {
      return res.status(404).json({ message: "WIP ID not found" });
    }

    const playerId = wipData.playerId;
 
    if (!playerId) {
      return res
        .status(404)
        .json({ message: "Player ID not found in WIP data" });
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


app.get("/api/user/kamai/:wipId", async (req, res) => {
  const { wipId } = req.params;

  try {
    const wipData = await WIP.findOne({ wip_id: wipId });

    if (!wipData) {
      return res.status(404).json({ message: "WIP ID not found" });
    }

    const playerId = wipData.playerId;

    if (!playerId) {
      return res.status(404).json({ message: "Player ID not found in WIP data" });
    }

    const GeneralSaveDataKamai = await GeneralSaveData.findOne({ playerId: playerId });

    if (!GeneralSaveDataKamai) {
      return res.status(404).json({ message: "User not found" });
    }

    const { kamai, playerBadgeData } = GeneralSaveDataKamai;
    return res.json({ kamai , playerBadgeData});

  } catch (error) {
    console.error("Error fetching kamai data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
