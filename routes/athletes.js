const express = require("express");
const athletes = express.Router();
const AthleteModel = require("../models/athlete");
const validateAthlete = require("../middlewares/validateAthlete");
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/verifyToken");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const multer = require("multer");
const crypto = require("crypto");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "athletesCovers",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.name,
  },
});

const cloudUpload = multer({ storage: cloudStorage });

//GET DEGLI ATLETI
athletes.get("/athletes", verifyToken, async (req, res) => {
  try {
    const athletes = await AthleteModel.find().populate("team");
    res.status(200).send({
      statusCode: 200,
      athletes,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//POST DELLE IMMAGINI DI PROFILO ATLETA
athletes.post(
  "/athletes/cloudUpload",
  cloudUpload.single("cover"),
  async (req, res) => {
    try {
      res.status(200).json({
        cover: req.file.path,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server",
      });
    }
  }
);

//POST DI UN ATLETA
athletes.post("/athletes/create", validateAthlete, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newAthlete = new AthleteModel({
    name: req.body.name,
    surname: req.body.surname,
    email: req.body.email,
    age: Number(req.body.age),
    cover: req.body.cover,
    password: hashedPassword, 
    role: req.body.role,
    team: req.body.team,
    requestedTeam: req.body.requestedTeam
  });
  try {
    const athlete = await newAthlete.save();
    res.status(201).send({
      statusCode: 201,
      message: "Athlete created succesfully",
      payload: athlete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//GET DI UN ATLETA SPECIFICO
athletes.get("/athletes/byId/:athleteId", async (req, res) => {
  const { athleteId } = req.params;

  try {
    const athlete = await AthleteModel.findById(athleteId).populate('team');
    if (!athlete) {
      return res.status(404).send({
        statusCode: 404,
        message: "This athlete doesn't exists",
      });
    }
    res.status(200).send({
      statusCode: 200,
      athlete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//PATCH DI UN ATLETA
athletes.patch("/athletes/update/:athleteId", async (req, res) => {
  const { athleteId } = req.params;
  const athleteExist = await AthleteModel.findById(athleteId);
  if (!athleteExist) {
    return res.status(404).send({
      statusCode: 404,
      message: "This athlete doesn't exists",
    });
  }

  try {
    const dataToUpdate = req.body;
    const options = { new: true };
    const result = await AthleteModel.findByIdAndUpdate(
      athleteId,
      dataToUpdate,
      options
    );
    res.status(200).send({
      statusCode: 200,
      message: "Athlete edited succesfully",
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//DELETE DI UN ATLETA
athletes.delete("/athletes/delete/:athleteId", async (req, res) => {
  const { athleteId } = req.params;

  try {
    const athlete = await AthleteModel.findByIdAndDelete(athleteId);
    if (!athlete) {
      return res.status(404).send({
        statusCode: 404,
        message: "This athlete doesn't exists or already deleted!",
      });
    }
    res.status(200).send({
      statusCode: 200,
      message: "athlete deleted succesfully",
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

module.exports = athletes;
