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
import TimelineComponent from "./Timeline";

const DoctorPortal = () => {
  const [option, setOption] = useState("");
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
  const [showTimeline, setShowTimeline] = useState(false);
  const [diagnoses, setDiagnoses] = useState([]);

  const handleOptionChange = (e) => {
    setOption(e.target.value);
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

  const handleAddDiagnosisEntry = () => {
    setOption("new");
    setForm((prevForm) => ({
      ...prevForm,
      patientId: prevForm.patientId,
      diagnosisId: prevForm.diagnosisId,
      symptoms: "",
      doctorDiagnosis: "",
      prescription: "",
    }));
    setError("");
    setSuccessMsg("");
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
      const timelineRes = await API.get(`/patients/${patientId}/diagnoses`);
      setDiagnoses(timelineRes.data);
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
      handleCheckDiagnosis();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg ||
          "An error occurred while submitting the diagnosis."
      );
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
      setError(
        err.response?.status === 404
          ? "Diagnosis ID does not exist for this patient. You can create a new diagnosis."
          : "An error occurred while checking the diagnosis."
      );
      setExistingDiagnoses([]);
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

  if (showTimeline) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <TimelineComponent diagnoses={existingDiagnoses} showAIButton={false} />
      </Container>
    );
  }

  return (
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFAF0", // Background color
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#2C3E50", mb: 4 }}
      >
        Doctor Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Modal
          open={!!successMsg} // Show modal if successMsg exists
          onClose={() => setSuccessMsg("")} // Clear success message on close
          aria-labelledby="success-modal-title"
          aria-describedby="success-modal-description"
          sx={{
            backdropFilter: "blur(6px)", // Add light blur effect
            bgcolor: "rgba(0, 0, 0, 0.5)", // Darken background
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: "400px" },
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <Typography
              id="success-modal-title"
              variant="h5"
              gutterBottom
              sx={{
                fontWeight: "bold",
                color: "#2E7D32",
                mb: 2,
              }}
            >
              Success!
            </Typography>
            <Typography
              id="success-modal-description"
              sx={{
                fontSize: "1.2rem",
                fontWeight: "medium",
                color: "#444",
                mb: 3,
              }}
            >
              {successMsg}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                setSuccessMsg("");
                setShowTimeline(true);
              }}
              sx={{
                borderRadius: "20px",
                fontSize: "1rem",
                padding: "10px 20px",
                bgcolor: "#4CAF50",
                "&:hover": {
                  bgcolor: "#45A049",
                },
              }}
            >
              OK
            </Button>
          </Box>
        </Modal>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ mb: 4, width: "100%", maxWidth: "600px" }}>
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

      {option === "new" && (
        <Box sx={{ width: "100%", maxWidth: "600px", mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#34495E" }}>
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
              sx={{ mt: 2, borderRadius: "20px" }}
            >
              Submit Diagnosis
            </Button>
          </Box>
        </Box>
      )}

      {option === "existing" && (
        <Box sx={{ width: "100%", maxWidth: "600px", mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#34495E" }}>
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
              sx={{ borderRadius: "20px" }}
            >
              Check Diagnosis
            </Button>
          </Box>
        </Box>
      )}

      {existingDiagnoses.length > 0 && option === "existing" && (
        <Box sx={{ mb: 4, width: "100%", maxWidth: "600px" }}>
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#2C3E50" }}
          ></Typography>
          <TimelineComponent diagnoses={existingDiagnoses} />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleAddDiagnosisEntry}
              sx={{ borderRadius: "20px" }}
            >
              Add New Diagnosis Entry
            </Button>
          </Box>
        </Box>
      )}

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

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
          <TimelineComponent
            diagnoses={selectedDiagnosisEntries}
            showAIButton={false}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default DoctorPortal;
