import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Modal,
} from "@mui/material";
import API from "../api";
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

  const handleOptionChange = (e) => {
    setOption(e.target.value);
    setForm({ patientId: "" });
    setPatientForm({ name: "", age: "", weight: "", height: "", gender: "" });
    setError("");
    setSuccessMsg("");
    setDiagnosisIds([]);
  };

  const handleFormChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePatientFormChange = (e) =>
    setPatientForm({ ...patientForm, [e.target.name]: e.target.value });

  const handleCreatePatient = async () => {
    const { name, age, weight, height, gender } = patientForm;

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
      setPatientForm({ name: "", age: "", weight: "", height: "", gender: "" });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.msg ||
          "An error occurred while creating the patient."
      );
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
      if (res.data.length === 0) {
        setError("You currently have no diagnostic reports.");
        setDiagnosisIds([]);
      } else {
        setError("");
        setDiagnosisIds(res.data);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.status === 404
          ? "Patient not found. Please check the Patient ID."
          : "An error occurred while fetching diagnoses."
      );
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
    <Container
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        backgroundColor: "#FFAF0",
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
        Patient Dashboard
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2, width: "100%", maxWidth: "600px" }}
        >
          {error}
        </Alert>
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
            <MenuItem value="new">Create New Patient</MenuItem>
            <MenuItem value="existing">Use Existing Patient</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {option === "new" && (
        <Box sx={{ width: "100%", maxWidth: "600px", mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#34495E" }}>
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
              sx={{ borderRadius: "20px" }}
            >
              Create Patient
            </Button>
          </Box>
          {/* Success Modal */}
          <Modal
            open={!!successMsg}
            onClose={() => setSuccessMsg("")} // Close modal on dismiss
            aria-labelledby="success-modal-title"
            aria-describedby="success-modal-description"
            sx={{
              backdropFilter: "blur(6px)", // Adds a light blur to the background
              bgcolor: "rgba(0, 0, 0, 0.5)", // Slightly darken the background for focus
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
                borderRadius: "16px", // Rounded corners
                textAlign: "center",
                fontFamily: "'Poppins', sans-serif", // Nice font style
              }}
            >
              <Typography
                id="success-modal-title"
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: "bold",
                  color: "#2E7D32", // Green color for success
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
                onClick={() => setSuccessMsg("")} // Close modal when clicked
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
        </Box>
      )}

      {option === "existing" && (
        <Box sx={{ width: "100%", maxWidth: "600px", mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "#34495E" }}>
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
              sx={{ borderRadius: "20px" }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      )}

      {diagnosisIds.length > 0 && option === "existing" && (
        <Box
          sx={{
            mb: 4,
            width: "100%",
            maxWidth: "600px",
            backgroundColor: "#f7f9fc", // Soft background color
            padding: 3,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", // Subtle shadow for better focus
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              color: "#2C3E50",
              textAlign: "center",
              fontWeight: "bold",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Diagnosis Timeline
          </Typography>
          <Grid container spacing={2}>
            {diagnosisIds.map((id) => (
              <Grid item xs={12} md={6} key={id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)", // Slight zoom effect on hover
                      boxShadow: "0px 6px 14px rgba(0, 0, 0, 0.2)",
                    },
                    backgroundColor: "#ffffff",
                  }}
                  onClick={() => handleViewTimeline(id)}
                >
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "#2C3E50",
                        fontFamily: "'Poppins', sans-serif",
                        textAlign: "center",
                      }}
                    >
                      Diagnosis ID: {id}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Modal for Viewing Timeline */}
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
            width: { xs: "90%", sm: "70%" },
            bgcolor: "#ffffff", // White background
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
            p: 4,
            borderRadius: "16px",
            maxHeight: "90vh",
            overflowY: "auto",
            fontFamily: "'Poppins', sans-serif",
            position: "relative",
          }}
        >
          {/* Close Button */}
          <Button
            onClick={() => setIsModalOpen(false)}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "#e0e0e0",
              borderRadius: "50%",
              minWidth: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "1.2rem",
              color: "#2C3E50",
              "&:hover": {
                backgroundColor: "#d6d6d6",
              },
            }}
          >
            ✕
          </Button>

          <Typography
            id="timeline-modal-title"
            variant="h5"
            gutterBottom
            sx={{
              textAlign: "center",
              color: "#2C3E50",
              fontWeight: "bold",
              mb: 3,
            }}
          >
            Diagnosis Details
          </Typography>
          <TimelineComponent
            diagnoses={selectedDiagnosisEntries}
            showAIButton={true}
          />
        </Box>
      </Modal>
    </Container>
  );
};

export default PatientPortal;
