const express = require("express");
const login = express.Router();
const bcrypt = require("bcrypt");
const AthleteModel = require("../models/athlete");
const jwt = require("jsonwebtoken");
require("dotenv").config();

login.post("/loginAthlete", async (req, res) => {
  const athlete = await AthleteModel.findOne({ email: req.body.email });
  if (!athlete) {
    return res.status(404).send({
      message: "Email o password errati",
      statusCode: 404,
    });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    athlete.password
  );

  if (!validPassword) {
    return res.status(400).send({
      message: "Email o password errati",
      statusCode: 400,
    });
  }

  const token = jwt.sign(
    {
      id: athlete._id,
      name: athlete.name,
      surname: athlete.surname,
      email: athlete.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );

  res.header("Authorization", token).status(200).send({
    message: "Login effettuato con successo",
    statusCode: 200,
    token,
  });

  console.log(token)
});

module.exports = login;
