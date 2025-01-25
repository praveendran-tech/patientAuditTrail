// models/Patient.js
const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    gender: {
      // Added gender field
      type: String,
      enum: ["Male", "Female", "Other", "Prefer Not to Say"], // Restricting to predefined values
      required: true,
    },
    diagnoses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Diagnosis",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Patient", PatientSchema);
