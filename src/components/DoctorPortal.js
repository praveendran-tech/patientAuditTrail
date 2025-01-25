// src/components/DoctorDashboard.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Modal,
  CircularProgress,
} from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";
import TimelineComponent from "./Timeline";

const DoctorPortal = () => {
  const [option, setOption] = useState(""); // 'new' or 'existing'
  const [form, setForm] = useState({
    doctorId: "",
    patientId: "",
    diagnosisId: "",
    symptoms: "",
    doctorDiagnosis: "",
    prescription: "",
  });
  const [files, setFiles] = useState({
    report: null,
    image: null,
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [existingDiagnoses, setExistingDiagnoses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDiagnosisEntries, setSelectedDiagnosisEntries] = useState([]);
  const navigate = useNavigate(); // Assigned but not used

  const handleOptionChange = (e) => {
    setOption(e.target.value);
    // Reset form and other states when option changes
    setForm({
      doctorId: "",
      patientId: "",
      diagnosisId: "",
      symptoms: "",
      doctorDiagnosis: "",
      prescription: "",
    });
    setFiles({
      report: null,
      image: null,
    });
    setError("");
    setSuccessMsg("");
    setExistingDiagnoses([]);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  // **New Function Added**
  const handleAddDiagnosisEntry = () => {
    setOption("new"); // Switch to 'Create New Diagnosis' form
    setForm((prevForm) => ({
      ...prevForm,
      patientId: prevForm.patientId, // Retain existing Patient ID
      diagnosisId: prevForm.diagnosisId, // Retain existing Diagnosis ID
      symptoms: "",
      doctorDiagnosis: "",
      prescription: "",
    }));
    setError(""); // Clear any existing errors
    setSuccessMsg(""); // Clear any existing success messages
  };

  const handleSubmit = async () => {
    const {
      doctorId,
      patientId,
      diagnosisId,
      symptoms,
      doctorDiagnosis,
      prescription,
    } = form;

    // Basic frontend validation
    if (
      !doctorId ||
      !patientId ||
      !diagnosisId ||
      !symptoms ||
      !doctorDiagnosis
    ) {
      setError("Please fill in all required fields.");
      setSuccessMsg("");
      return;
    }

    // Create FormData object
    const formData = new FormData();
    formData.append("doctorId", doctorId);
    formData.append("patientId", patientId);
    formData.append("diagnosisId", diagnosisId);
    formData.append("symptoms", symptoms);
    formData.append("doctorDiagnosis", doctorDiagnosis);
    formData.append("prescription", prescription);
    if (files.report) formData.append("report", files.report);
    if (files.image) formData.append("image", files.image);

    setLoading(true);
    try {
      const res = await API.post("/doctors/diagnosis", formData);
      setSuccessMsg("Diagnosis submitted successfully!");
      setError("");
      // Reset form
      setForm({
        doctorId: "",
        patientId: "",
        diagnosisId: "",
        symptoms: "",
        doctorDiagnosis: "",
        prescription: "",
      });
      setFiles({
        report: null,
        image: null,
      });
      // Refresh existing diagnoses
      handleCheckDiagnosis();
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred while submitting the diagnosis.");
      }
      setSuccessMsg("");
    }
    setLoading(false);
  };

  const handleCheckDiagnosis = async () => {
    const { patientId, diagnosisId } = form;

    if (!patientId.trim() || !diagnosisId.trim()) {
      setError("Please enter both Patient ID and Diagnosis ID.");
      setExistingDiagnoses([]);
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(
        `/patients/${patientId}/diagnoses/${diagnosisId}`
      );
      setExistingDiagnoses(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        // Diagnosis ID does not exist for the patient
        setExistingDiagnoses([]);
        setError(
          "Diagnosis ID does not exist for this patient. You can create a new diagnosis."
        );
      } else {
        setError("An error occurred while checking the diagnosis.");
        setExistingDiagnoses([]);
      }
    }
    setLoading(false);
  };

  const handleViewTimeline = async (diagnosisId) => {
    try {
      const res = await API.get(
        `/patients/${form.patientId}/diagnoses/${diagnosisId}`
      );
      setSelectedDiagnosisEntries(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      setError("An error occurred while fetching the timeline.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Doctor Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel id="option-label">Select Option</InputLabel>
          <Select
            labelId="option-label"
            value={option}
            label="Select Option"
            onChange={handleOptionChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="new">Create New Diagnosis</MenuItem>
            <MenuItem value="existing">Use Existing Diagnosis</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Option to Create New Diagnosis */}
      {option === "new" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Create New Diagnosis
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="doctorId"
              label="Doctor ID"
              variant="outlined"
              value={form.doctorId}
              onChange={handleChange}
              required
            />
            <TextField
              name="patientId"
              label="Patient ID"
              variant="outlined"
              value={form.patientId}
              onChange={handleChange}
              required
            />
            <TextField
              name="diagnosisId"
              label="Diagnosis ID"
              variant="outlined"
              value={form.diagnosisId}
              onChange={handleChange}
              required
            />
            <TextField
              name="symptoms"
              label="Symptoms"
              variant="outlined"
              multiline
              rows={4}
              value={form.symptoms}
              onChange={handleChange}
              required
            />
            <TextField
              name="doctorDiagnosis"
              label="Diagnosis"
              variant="outlined"
              multiline
              rows={4}
              value={form.doctorDiagnosis}
              onChange={handleChange}
              required
            />
            <TextField
              name="prescription"
              label="Prescription"
              variant="outlined"
              multiline
              rows={2}
              value={form.prescription}
              onChange={handleChange}
            />

            {/* File Uploads */}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
            >
              <Button variant="contained" component="label">
                Upload Report PDF
                <input
                  type="file"
                  name="report"
                  hidden
                  onChange={handleFileChange}
                  accept=".pdf"
                />
              </Button>
              <Button variant="contained" component="label">
                Upload Medical Image
                <input
                  type="file"
                  name="image"
                  hidden
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </Button>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              sx={{ mt: 2 }}
            >
              Submit Diagnosis
            </Button>
          </Box>
        </Box>
      )}

      {/* Option to Use Existing Diagnosis */}
      {option === "existing" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Use Existing Diagnosis
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="doctorId"
              label="Doctor ID"
              variant="outlined"
              value={form.doctorId}
              onChange={handleChange}
              required
            />
            <TextField
              name="patientId"
              label="Patient ID"
              variant="outlined"
              value={form.patientId}
              onChange={handleChange}
              required
            />
            <TextField
              name="diagnosisId"
              label="Diagnosis ID"
              variant="outlined"
              value={form.diagnosisId}
              onChange={handleChange}
              required
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCheckDiagnosis}
            >
              Check Diagnosis
            </Button>
          </Box>
        </Box>
      )}

      {/* Display Existing Diagnoses Timeline */}
      {existingDiagnoses.length > 0 && option === "existing" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Diagnosis Timeline:
          </Typography>
          <TimelineComponent diagnoses={existingDiagnoses} />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddDiagnosisEntry}
            >
              Add New Diagnosis Entry
            </Button>
          </Box>
        </Box>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Modal for Viewing Timeline */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="timeline-modal-title"
        aria-describedby="timeline-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", md: "80%" },
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <TimelineComponent diagnoses={selectedDiagnosisEntries} />
        </Box>
      </Modal>
    </Container>
  );
};

export default DoctorPortal;
