const express = require("express");
const mongoose = require("mongoose");
const PORT = 3001;
const exampleRoute = require('./routes/exampleRoute')

const app = express();

//ROUTES
app.use('/', exampleRoute)






//SERVER SETTINGS
mongoose.connect(
  "mongodb+srv://g00emanuele:pMpuARnnwmcUada3@epicluster.gyhucxu.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error during db connection"));
db.once('open', ()=>{
    console.log('Database succesfully connected!')
})

app.listen(PORT, () => console.log(`Server up and running on port ${PORT}`));
