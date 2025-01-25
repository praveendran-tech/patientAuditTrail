// src/components/CreatePatient.js
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
} from "@mui/material";
import API from "../api";
import { useNavigate } from "react-router-dom";

const CreatePatient = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    gender: "", // Added gender field
    // Add other necessary patient fields if required
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleCreatePatient = async () => {
    const { name, age, weight, height, gender } = form; // Extract gender

    // Basic frontend validation
    if (!name || !age || !weight || !height || !gender) {
      // Include gender in validation
      setError("Please fill in all required fields.");
      setSuccessMsg("");
      return;
    }

    try {
      const res = await API.post("/patients", form); // Ensure the endpoint matches your backend
      setSuccessMsg(
        `Patient created successfully! Patient ID: ${res.data.patientId}`
      );
      setError("");
      // Optionally, reset the form
      setForm({
        name: "",
        age: "",
        weight: "",
        height: "",
        gender: "", // Reset gender field
      });
      // Redirect to another page if desired
      // navigate('/doctor');
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        setError("An error occurred while creating the patient.");
      }
      setSuccessMsg("");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Create New Patient
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

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            name="name"
            label="Patient Name"
            variant="outlined"
            value={form.name}
            onChange={handleChange}
            required
          />
          <TextField
            name="age"
            label="Age"
            variant="outlined"
            type="number"
            value={form.age}
            onChange={handleChange}
            required
          />
          <TextField
            name="weight"
            label="Weight (kg)"
            variant="outlined"
            type="number"
            value={form.weight}
            onChange={handleChange}
            required
          />
          <TextField
            name="height"
            label="Height (cm)"
            variant="outlined"
            type="number"
            value={form.height}
            onChange={handleChange}
            required
          />

          {/* Added Gender Field */}
          <FormControl variant="outlined" required>
            <InputLabel id="gender-label">Gender</InputLabel>
            <Select
              labelId="gender-label"
              name="gender"
              value={form.gender}
              onChange={handleChange}
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

          {/* Add other necessary fields here */}

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreatePatient}
          >
            Create Patient
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreatePatient;
