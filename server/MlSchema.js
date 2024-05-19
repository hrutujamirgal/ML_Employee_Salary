const mongoose = require("mongoose");

// User schema
const userSchema = new mongoose.Schema({
    										
  work_year: {
    type: Number,
  },
  experience_level: {
    type: String,
  },
  employment_type: {
    type: String,
  },
  job_title: {
    type: String,
  },
  salary: {
    type: Number,
  },
  salary_currency: {
    type: String,
  },
  salary_in_usd: {
    type: Number,
  },
  employee_residence: {
    type: String,
  },
  remote_ratio: {
    type: Number,
  },
  company_location: {
    type: String,
  },
  company_size: {
    type: String,
  },
});



module.exports = mongoose.model("ml_engineer_salary", userSchema)