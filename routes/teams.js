const express = require("express");
const teams = express.Router();
const TeamModel = require("../models/team");
const validateTeam = require("../middlewares/validateTeam");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config();
const multer = require("multer");
const crypto = require("crypto");

//GET DELLE SQUADRE
teams.get("/teams", async (req, res) => {
  try {
    const teams = await TeamModel.find();
    res.status(200).send({
      statusCode: 200,
      teams,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "teamCovers",
    format: async (req, file) => "jpg",
    public_id: (req, file) => file.name,
  },
});

const cloudUpload = multer({ storage: cloudStorage });

//POST DELLE IMMAGINI DI PROFILO SQUADRE
teams.post(
  "/teams/cloudUpload",
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

//POST DI UNA SQUADRA
teams.post("/teams/create", validateTeam, async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newTeam = new TeamModel({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword, //hashedPassword
  });
  try {
    const team = await newTeam.save();
    res.status(201).send({
      statusCode: 201,
      message: "Team created succesfully",
      payload: team,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//GET DI UNA SQUADRA SPECIFICA
teams.get("/teams/byId/:teamId", async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await TeamModel.findById(teamId);
    if (!team) {
      return res.status(404).send({
        statusCode: 404,
        message: "This team doesn't exists",
      });
    }
    res.status(200).send({
      statusCode: 200,
      team,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Errore interno del server",
    });
  }
});

//PATCH DI UNA SQUADRA
teams.patch("/teams/update/:teamId", async (req, res) => {
    const { teamId } = req.params;
    const teamExist = await TeamModel.findById(teamId);
    if (!teamExist) {
      return res.status(404).send({
        statusCode: 404,
        message: "This team doesn't exists",
      });
    }
  
    try {
      const dataToUpdate = req.body;
      const options = { new: true };
      const result = await TeamModel.findByIdAndUpdate(
        teamId,
        dataToUpdate,
        options
      );
      res.status(200).send({
        statusCode: 200,
        message: "Team edited succesfully",
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
  teams.delete("/teams/delete/:teamId", async (req, res) => {
    const { teamId } = req.params;
  
    try {
      const team = await TeamModel.findByIdAndDelete(teamId);
      if (!team) {
        return res.status(404).send({
          statusCode: 404,
          message: "This team doesn't exists or already deleted!",
        });
      }
      res.status(200).send({
        statusCode: 200,
        message: "Team deleted succesfully",
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Errore interno del server",
      });
    }
  });

module.exports = teams;
