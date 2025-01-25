// models/Doctor.js
const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    doctorId: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    licenseNumber: { type: String, unique: true, required: true },
    healthcareInstitution: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", DoctorSchema);
