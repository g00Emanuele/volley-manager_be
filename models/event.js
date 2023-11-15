const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teamModel",
      required: true,
    },
  },
  { timestamps: true, strict: true }
);

module.exports = mongoose.model("eventModel", EventSchema, "events");
