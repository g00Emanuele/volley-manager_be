const validateEvent = (req, res, next) => {
    const errors = [];
    const { title, content, team } = req.body;
    if (typeof title !== "string") {
      errors.push("Event title must be a string");
    }
    if (typeof content !== "string") {
      errors.push("Content must be a string");
    }
    if (typeof team !== "string") {
      errors.push("Password must be a string");
    }
    if (errors.length > 0) {
      res.status(400).send({ errors });
    } else {
      next();
    }
  };
  
  module.exports = validateEvent;
  