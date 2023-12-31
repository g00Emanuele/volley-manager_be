const validateAthlete = (req, res, next) => {
  const errors = [];
  const { name, surname, email, age, cover, password, role, team, requestedTeam } = req.body;
  if (typeof name !== "string") {
    errors.push("Name must be a string");
  }
  if (typeof surname !== "string") {
    errors.push("Surname must be a string");
  }
  if (typeof email !== "string") {
    errors.push("Email must be a string");
  }
  if (typeof age !== "number") {
    errors.push("Age must be a number");
  }
  if (typeof cover !== "string" && cover) {
    errors.push("Cover must be a string");
  }
  if (typeof password !== "string") {
    errors.push("Password must be a string");
  }
  if (typeof role !== "string") {
    errors.push("Role must be a string");
  }
  if (typeof team !== "string" && team) {
    errors.push("Team must be a string");
  }
  if (typeof requestedTeam !== "string" && requestedTeam) {
    errors.push("requestedTeam must be a string");
  }
  if (errors.length > 0) {
    res.status(400).send({ errors });
  } else {
    next();
  }
};

module.exports = validateAthlete;
