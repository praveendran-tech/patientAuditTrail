// models/Diagnosis.js
const mongoose = require("mongoose");

const DiagnosisSchema = new mongoose.Schema(
  {
    diagnosisId: {
      type: String,
      required: true,
      // Removed unique: true
    },
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    symptoms: {
      type: String,
      required: true,
    },
    report: {
      type: String,
    }, // Path to uploaded PDF
    image: {
      type: String,
    }, // Path to uploaded Medical Image
    doctorDiagnosis: {
      type: String,
      required: true,
    },
    prescription: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diagnosis", DiagnosisSchema);
