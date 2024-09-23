const express = require("express");
const session = require("express-session");
const { google } = require("googleapis");
const path = require("path");
const crypto = require("crypto");
const cors = require("cors");
const { Client, ID, Databases } = require("node-appwrite");
require("dotenv").config();


const credentials = require("./creds.json");
const { fitness } = require("googleapis/build/src/apis/fitness");

const { client_secret, client_id, redirect_uris } = credentials.web;
const oAuth2Client = new google.auth.OAuth2(
  client_id,
  client_secret,
  redirect_uris[0]
);

const client = new Client();

const database = new Databases(client);

const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.blood_glucose.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.reproductive_health.read",
  "https://www.googleapis.com/auth/userinfo.profile",
];
const secretKey = crypto.randomBytes(32).toString("hex");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the actual origin of your React app
  })
);
app.use(express.json()); // Parse JSON-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

let userProfileData;
async function getUserProfile(auth) {
  const service = google.people({ version: "v1", auth });
  const profile = await service.people.get({
    resourceName: "people/me",
    personFields: "names,photos,emailAddresses",
  });

  const displayName = profile.data.names[0].displayName;
  const url = profile.data.photos[0].url;
  let userID = profile.data.resourceName;
  userID = parseInt(userID.replace("people/", ""), 10);
  return {
    displayName,
    profilePhotoUrl: url,
    userID,
  };
}

app.get("/auth/google", (req, res) => {
  console.log("hittttt!!!!");

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.json({ authUrl });
  //res.redirect(authUrl);
});

app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    req.session.tokens = tokens;

    const profile = await getUserProfile(oAuth2Client);
    // Save user profile data in the session

    req.session.userProfile = profile;
    userProfileData = profile;
    res.redirect("http://localhost:3000/dashboard");

    // res.redirect("/fetch-data");
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.redirect("/error");
  }
});
let isSecondHit = false;
app.get("/fetch-data", async (req, res) => {
  try {
    const fitness = google.fitness({
      version: "v1",
      auth: oAuth2Client,
    });

    //  const userProfile = req.session.userProfile;

    // Access user's name, profile photo, and ID
    const userName = userProfileData.displayName;
    const profilePhoto = userProfileData.profilePhotoUrl;
    const userId = userProfileData.userID;

    const sevenDaysInMillis = 14 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    const startTimeMillis = Date.now() - sevenDaysInMillis; // Start time is 7 days ago
    const endTimeMillis = Date.now() + 24 * 60 * 60 * 1000; // End time is the current time

    const response = await fitness.users.dataset.aggregate({
      userId: "me",
      requestBody: {
        aggregateBy: [
          {
            dataTypeName: "com.google.step_count.delta",
          },
          {
            dataTypeName: "com.google.blood_glucose",
          },
          {
            dataTypeName: "com.google.heart_rate.bpm",
          },
          {
            dataTypeName: "com.google.weight",
          },
          {
            dataTypeName: "com.google.height",
          },
          {
            dataTypeName: "com.google.body.fat.percentage",
          },
        ],
        bucketByTime: { durationMillis: 86400000 }, // Aggregate data in daily buckets
        startTimeMillis,
        endTimeMillis,
      },
    });

    const fitnessData = response.data.bucket;
    const formattedData = [];

    fitnessData.map((data) => {
      const date = new Date(parseInt(data.startTimeMillis));
      const formattedDate = date.toDateString();

      //console.log("Date:", formattedDate);
      const formattedEntry = {
        date: formattedDate,
        step_count: 0,
        glucose_level: 0,
        heart_rate: 0,
        weight: 0,
        height_in_cms: 0,
        body_fat_in_percent: 0,
      };

      const datasetMap = data.dataset;
      datasetMap.map((mydataset) => {
        const point = mydataset.point;
        // console.log(mydataset.dataSourceId)
        if (point && point.length > 0) {
          const value = point[0].value;
          switch (mydataset.dataSourceId) {
            case "derived:com.google.step_count.delta:com.google.android.gms:aggregated":
              // console.log("Step count:", value[0]?.intVal);
              formattedEntry.step_count = value[0]?.intVal || 0;
              break;
            case "derived:com.google.blood_glucose.summary:com.google.android.gms:aggregated":
              // console.log("Blood glucose:",mydataset.point[0]?.value)
              let glucoseLevel = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  const dataArray = mydataset.point[0]?.value;
                  dataArray.map((data) => {
                    if (data.fpVal) {
                      glucoseLevel = data.fpVal * 10;
                    }
                  });
                }
              }
              formattedEntry.glucose_level = glucoseLevel;
              break;
            case "derived:com.google.heart_rate.summary:com.google.android.gms:aggregated":
              // console.log("Heart rate:",mydataset.point[0]?.value)
              let heartData = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  const heartArray = mydataset.point[0]?.value;
                  heartArray.map((data) => {
                    if (data.fpVal) {
                      heartData = data.fpVal;
                    }
                  });
                }
              }
              formattedEntry.heart_rate = heartData;
              break;
            case "derived:com.google.weight.summary:com.google.android.gms:aggregated":
              // console.log("Weight:",value[0]?.fpVal)
              formattedEntry.weight = value[0]?.fpVal || 0;
              break;
            case "derived:com.google.height.summary:com.google.android.gms:aggregated":
              // console.log("Height:",value[0]?.fpVal)
              formattedEntry.height_in_cms = value[0]?.fpVal * 100 || 0;
              break;
            case "derived:com.google.body.fat.percentage.summary:com.google.android.gms:aggregated":
              // console.log("Body Fat:",mydataset.point[0]?.value)
              let bodyFat = 0;
              if (mydataset.point[0]?.value) {
                if (mydataset.point[0]?.value.length > 0) {
                  bodyFat = mydataset.point[0].value[0].fpVal;
                }
              }
              formattedEntry.body_fat_in_percent = bodyFat;
              break;
            default:
              break;
          }
        }
        // else {
        //     console.log(`No data available`);
        //   }
      });
      formattedData.push(formattedEntry);
    });
    console.log("Fitness data fetched successfully!");
    isSecondHit = true;
    res.send({
      userName,
      profilePhoto,
      userId,
      formattedData, // Include your fitness data here
    });
  } catch (error) {
    console.error("Error fetching fitness data:", error);
    res.redirect("/error");
  }
});

app.post("/add-entry", async (req, res) => {
  const { workoutName, duration, caloriesBurnt, date} = req.body;
  console.log(workoutName, duration, caloriesBurnt, date);
  if (!workoutName || !duration || !caloriesBurnt || !date ) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    const response = await database.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      {
        workoutName,
        duration: parseInt(duration),
        caloriesBurnt: parseFloat(parseFloat(caloriesBurnt).toFixed(2)),
        date,
        id: new Date().toISOString() // Use current date and time as the id
      }
    );
    console.log(caloriesBurnt);

    console.log("Activity entry saved to Appwrite:", response);
    res.status(201).json({ message: "Entry added successfully", data: response });
  } catch (error) {
    console.error("Error saving activity entry to Appwrite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/get-entries", async (req, res) => {
  try {

    const response = await database.listDocuments(databaseId, collectionId);

    res.status(200).json(response.documents);
  } catch (error) {
    console.error("Error fetching activity entries from Appwrite:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8000, () => {
  console.log("service listening at 8000");
});
