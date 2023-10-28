const validateTeam = (req, res, next) => {
  const errors = [];
  const { name, email, password } = req.body;
  if (typeof name !== "string") {
    errors.push("Name must be a string");
  }
  if (typeof email !== "string") {
    errors.push("Email must be a string");
  }
  if (typeof password !== "string") {
    errors.push("Password must be a string");
  }
  if (errors.length > 0) {
    res.status(400).send({ errors });
  } else {
    next();
  }
};

module.exports = validateTeam;
