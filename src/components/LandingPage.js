// src/components/LandingPage.js
import React, { useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/bg.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false); // Track animation state

  // Navigation handler with fade-out animation
  const handleNavigation = (role) => {
    setIsAnimating(true); // Trigger fade-out animation
    setTimeout(() => {
      navigate(`/${role}`); // Navigate after animation delay
    }, 500); // Delay matches the animation duration
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: isAnimating ? 0 : 1, // Fade-out effect
        transition: "opacity 0.5s ease-in-out", // Smooth fade transition
      }}
    >
      <Card
        sx={{
          padding: 5,
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)", // Enhanced shadow
          backgroundColor: "rgba(255, 255, 255, 0.9)", // Slightly opaque card background
          borderRadius: "16px",
          maxWidth: "600px",
          width: "90%", // Responsive width
          textAlign: "center",
          transform: isAnimating ? "scale(0.95)" : "scale(1)", // Shrinking effect
          transition: "transform 0.5s ease-in-out", // Smooth scaling transition
        }}
      >
        <CardContent>
          <Typography
            variant="h3"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#2C3E50" }} // Darker heading
          >
            Welcome to Byte Doctor
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.2rem", color: "#34495E" }} // Subheading
          >
            A platform designed to assist and enhance your diagnostics!
          </Typography>
          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1rem", color: "#7F8C8D" }} // Description text
          >
            Select your role to get started..
          </Typography>
          <Box
            sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
          >
            {/* Patient Button */}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => handleNavigation("patient")}
              sx={{
                paddingX: 4,
                paddingY: 1.5,
                fontSize: "1rem",
                borderRadius: "30px", // Rounded button
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Button shadow
              }}
            >
              I AM A PATIENT
            </Button>
            {/* Doctor Button */}
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => handleNavigation("doctor")}
              sx={{
                paddingX: 4,
                paddingY: 1.5,
                fontSize: "1rem",
                borderRadius: "30px", // Rounded button
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", // Button shadow
              }}
            >
              I AM A DOCTOR
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LandingPage;
