const mongoose = require("mongoose");

const AthleteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    cover: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
        type:String,
        enum:['setter', 'middle-blocker', 'outside-hitter', 'opposite-hitter', 'libero']
    }
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model('athleteModel', AthleteSchema, "athletes");