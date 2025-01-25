import React from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Card
        sx={{
          padding: 4,
          boxShadow: 3,
        }}
      >
        <CardContent>
          <Typography variant="h3" gutterBottom>
            Welcome to the Patient Safety Portal
          </Typography>
          <Typography variant="body1" paragraph>
            Choose your role to proceed. This portal leverages advanced
            technology to ensure secure and efficient healthcare management.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate("/patient")}
              sx={{ margin: 2 }}
            >
              I am a Patient
            </Button>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate("/doctor")}
              sx={{ margin: 2 }}
            >
              I am a Doctor
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LandingPage;
