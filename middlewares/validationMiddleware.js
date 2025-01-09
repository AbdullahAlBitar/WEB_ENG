
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    console.log(req.body);
    
    if (error) {
      console.log("validation error ", error.details[0].message)
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  }
}

module.exports = {
  validate
};