// routes/doctor.js
const express = require("express");
const router = express.Router();
const Diagnosis = require("../models/Diagnosis");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor"); // Assuming you have a Doctor model
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate a unique filename using timestamp and original name
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter to accept only specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only PDF, JPEG, JPG, and PNG files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
});

// Route to create a new diagnosis entry
router.post(
  "/diagnosis",
  upload.fields([
    { name: "report", maxCount: 1 },
    { name: "image", maxCount: 1 }, // Single image field
  ]),
  async (req, res) => {
    const {
      doctorId,
      patientId,
      diagnosisId,
      symptoms,
      doctorDiagnosis,
      prescription,
    } = req.body;

    // Validate required fields
    if (
      !doctorId ||
      !patientId ||
      !diagnosisId ||
      !symptoms ||
      !doctorDiagnosis
    ) {
      return res.status(400).json({
        msg: "Please provide doctorId, patientId, diagnosisId, symptoms, and doctorDiagnosis",
      });
    }

    try {
      // Find patient
      const patient = await Patient.findOne({ patientId });
      if (!patient) {
        return res.status(404).json({ msg: "Patient not found" });
      }

      // Find doctor
      const doctor = await Doctor.findOne({ doctorId });
      if (!doctor) {
        return res.status(404).json({ msg: "Doctor not found" });
      }

      // Create new diagnosis entry without checking for existing diagnosisId
      const diagnosis = new Diagnosis({
        diagnosisId: diagnosisId, // Provided by doctor
        patient: patient._id,
        doctor: doctor._id,
        symptoms,
        report: req.files.report ? req.files.report[0].path : null,
        image: req.files.image ? req.files.image[0].path : null, // Single image field
        doctorDiagnosis,
        prescription,
      });

      await diagnosis.save();

      // Link diagnosis to patient
      patient.diagnoses.push(diagnosis._id);
      await patient.save();

      res
        .status(201)
        .json({ msg: "Diagnosis submitted successfully", diagnosis });
    } catch (err) {
      console.error(err.message);
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        return res.status(400).json({ msg: err.message });
      } else if (
        err.message === "Only PDF, JPEG, JPG, and PNG files are allowed"
      ) {
        return res.status(400).json({ msg: err.message });
      }
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
