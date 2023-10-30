const express = require("express");
const loginTeam = express.Router();
const bcrypt = require("bcrypt");
const TeamModel = require("../models/team");
const jwt = require("jsonwebtoken");
require("dotenv").config();

loginTeam.post("/loginTeam", async (req, res) => {
  const team = await TeamModel.findOne({ email: req.body.email });
  if (!team) {
    return res.status(404).send({
      message: "Email o password errati",
      statusCode: 404,
    });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    team.password
  );

  if (!validPassword) {
    return res.status(400).send({
      message: "Email o password errati",
      statusCode: 400,
    });
  }

  const token = jwt.sign(
    {
      id: team._id,
      name: team.name,
      email: team.email,
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

module.exports = loginTeam;
