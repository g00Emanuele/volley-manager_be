const express = require("express");
const events = express.Router();
const EventModel = require("../models/event");
const validateEvent = require("../middlewares/validateEvent");
const verifyToken = require("../middlewares/verifyToken");

//GET
events.get("/events", verifyToken, async (req, res) => {
  try {
    const events = await EventModel.find().populate("team");
    res.status(200).send({
      statusCode: 200,
      events,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

events.get("/events/byTeam", verifyToken, async (req, res) => {
  const { team, page, pageSize = 8 } = req.query;

  try {
    const eventsByTeam = await EventModel.find({
      team: team,
    })
      .populate("team")
      .limit(pageSize)
      .skip((page - 1) * pageSize);
    const totalEvents = await EventModel.find({
      team: team,
    }).count();

    res.status(200).send({
      eventsByTeam,
      statusCode: 200,
      currentPage: Number(page),
      totalPages: Math.ceil(totalEvents / pageSize),
      totalEvents,
    });
  } catch (e) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//POST
events.post("/events/create", validateEvent, verifyToken, async (req, res) => {
  const newEvent = new EventModel({
    title: req.body.title,
    content: req.body.content,
    team: req.body.team,
  });
  try {
    const event = await newEvent.save();
    res.status(201).send({
      statusCode: 201,
      message: "Event created succesfully",
      payload: event,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//DELETE
events.delete("/events/delete/:eventId", verifyToken, async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await EventModel.findByIdAndDelete(eventId);
    if (!event) {
      return res.status(404).send({
        statusCode: 404,
        message: "This event doesn't exists or already deleted!",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "Event deleted succesfully",
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

module.exports = events;
