const express = require("express");
const mongoose = require("mongoose");
const PORT = 3001;
require("dotenv").config();
const athletesRoute = require("./routes/athletes");
const teamsRoute = require("./routes/teams");

const app = express();

app.use(express.json());
//ROUTES
app.use("/", athletesRoute);
app.use("/", teamsRoute);

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
