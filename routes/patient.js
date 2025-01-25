// routes/patient.js
const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const Diagnosis = require("../models/Diagnosis");

// Create a new patient
router.post("/", async (req, res) => {
  const { name, age, weight, height, gender } = req.body; // Extracted gender

  // Basic validation
  if (!name || !age || !weight || !height || !gender) {
    // Include gender in validation
    return res
      .status(400)
      .json({ msg: "Please provide name, age, weight, height, and gender." });
  }

  try {
    // Check if patient already exists based on unique fields (adjust as needed)
    let patient = await Patient.findOne({ name, age, weight, height, gender });
    if (patient) {
      return res.status(400).json({ msg: "Patient already exists." });
    }

    // Generate a unique patientId (you can enhance this logic as needed)
    const patientId = `P${Date.now()}`;

    // Create new patient
    patient = new Patient({
      patientId,
      name,
      age,
      weight,
      height,
      gender, // Include gender in the new patient
      diagnoses: [],
    });

    await patient.save();

    res.status(201).json({ msg: "Patient created successfully.", patientId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all diagnosisIds for a patient
router.get("/:patientId/diagnosisIds", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientId: req.params.patientId,
    }).populate("diagnoses");

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    // Extract unique diagnosisIds
    const diagnosisIds = [
      ...new Set(patient.diagnoses.map((d) => d.diagnosisId)),
    ];

    res.json(diagnosisIds);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all diagnosis entries for a patient and a diagnosisId
router.get("/:patientId/diagnoses/:diagnosisId", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.patientId });

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    const diagnoses = await Diagnosis.find({
      patient: patient._id,
      diagnosisId: req.params.diagnosisId,
    })
      .populate("doctor", "name doctorId")
      .sort({ createdAt: -1 }); // Sort by latest first

    if (diagnoses.length === 0) {
      return res
        .status(404)
        .json({ msg: "No diagnoses found for the provided Diagnosis ID." });
    }

    res.json(diagnoses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get all diagnoses for a patient
router.get("/:patientId/diagnoses", async (req, res) => {
  try {
    const patient = await Patient.findOne({
      patientId: req.params.patientId,
    }).populate({
      path: "diagnoses",
      populate: { path: "doctor", select: "name doctorId" },
      options: { sort: { createdAt: -1 } }, // Sort by createdAt descending
    });

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    res.json(patient.diagnoses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
