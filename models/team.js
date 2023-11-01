const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cover: {
      type: String,
      required: false,
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model('teamModel', TeamSchema, "teams");