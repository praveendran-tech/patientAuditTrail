// src/components/PatientPortal.js
import React, { useState } from "react";
import { TextField } from "@mui/material";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Alert,
  Grid,
  Modal,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";
import TimelineComponent from "./Timeline";

const PatientPortal = () => {
  const [option, setOption] = useState(""); // 'new' or 'existing'
  const [form, setForm] = useState({
    patientId: "",
  });
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [diagnosisIds, setDiagnosisIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDiagnosisEntries, setSelectedDiagnosisEntries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleOptionChange = (e) => {
    setOption(e.target.value);
    // Reset forms and states when option changes
    setForm({
      patientId: "",
    });
    setPatientForm({
      name: "",
      age: "",
      weight: "",
      height: "",
      gender: "",
    });
    setError("");
    setSuccessMsg("");
    setDiagnosisIds([]);
  };

  const handleFormChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handlePatientFormChange = (e) => {
    setPatientForm({
      ...patientForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePatient = async () => {
    const { name, age, weight, height, gender } = patientForm;

    // Basic frontend validation
    if (!name || !age || !weight || !height || !gender) {
      setError("Please fill in all required fields.");
      setSuccessMsg("");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/patients", patientForm);
      setSuccessMsg(
        `Patient created successfully! Patient ID: ${res.data.patientId}`
      );
      setError("");
      // Reset patient form
      setPatientForm({
        name: "",
        age: "",
        weight: "",
        height: "",
        gender: "",
      });
      // Optionally, navigate to another page
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred while creating the patient.");
      }
      setSuccessMsg("");
    }
    setLoading(false);
  };

  const handleSubmitPatientId = async () => {
    const { patientId } = form;

    if (!patientId.trim()) {
      setError("Please enter a valid Patient ID.");
      setDiagnosisIds([]);
      return;
    }

    setLoading(true);
    try {
      const res = await API.get(`/patients/${patientId}/diagnosisIds`);
      setDiagnosisIds(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        setError("Patient not found. Please check the Patient ID.");
      } else {
        setError("An error occurred while fetching diagnoses.");
      }
      setDiagnosisIds([]);
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
        Patient Dashboard
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
            <MenuItem value="new">Create New Patient</MenuItem>
            <MenuItem value="existing">Use Existing Patient</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Option to Create New Patient */}
      {option === "new" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Create New Patient
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="name"
              label="Patient Name"
              variant="outlined"
              value={patientForm.name}
              onChange={handlePatientFormChange}
              required
            />
            <TextField
              name="age"
              label="Age"
              variant="outlined"
              type="number"
              value={patientForm.age}
              onChange={handlePatientFormChange}
              required
            />
            <TextField
              name="weight"
              label="Weight (kg)"
              variant="outlined"
              type="number"
              value={patientForm.weight}
              onChange={handlePatientFormChange}
              required
            />
            <TextField
              name="height"
              label="Height (cm)"
              variant="outlined"
              type="number"
              value={patientForm.height}
              onChange={handlePatientFormChange}
              required
            />

            {/* Gender Field */}
            <FormControl variant="outlined" required>
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                name="gender"
                value={patientForm.gender}
                onChange={handlePatientFormChange}
                label="Gender"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
                <MenuItem value="Prefer Not to Say">Prefer Not to Say</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleCreatePatient}
            >
              Create Patient
            </Button>
          </Box>
        </Box>
      )}

      {/* Option to Use Existing Patient */}
      {option === "existing" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Use Existing Patient
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              name="patientId"
              label="Patient ID"
              variant="outlined"
              value={form.patientId}
              onChange={handleFormChange}
              required
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitPatientId}
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}

      {/* Display Diagnosis IDs */}
      {diagnosisIds.length > 0 && option === "existing" && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Your Diagnoses:
          </Typography>
          <Grid container spacing={2}>
            {diagnosisIds.map((diagId) => (
              <Grid item xs={12} md={6} key={diagId}>
                <Card
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleViewTimeline(diagId)}
                >
                  <CardContent>
                    <Typography variant="h6">Diagnosis ID: {diagId}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
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

export default PatientPortal;
