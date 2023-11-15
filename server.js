const express = require("express");
const mongoose = require("mongoose");
const PORT = 3001;
require("dotenv").config();
const athletesRoute = require("./routes/athletes");
const teamsRoute = require("./routes/teams");
const eventsRoute = require("./routes/events");
const loginAthleteRoute = require("./routes/loginAthlete");
const loginTeamRoute = require("./routes/loginTeam");
const logger = require("./middlewares/logger");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
app.use(logger);
//ROUTES
app.use("/", athletesRoute);
app.use("/", teamsRoute);
app.use("/", eventsRoute);
app.use("/", loginAthleteRoute);
app.use("/", loginTeamRoute);

//SERVER SETTINGS
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error during db connection"));
db.once("open", () => {
  console.log("Database succesfully connected!");
});

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
