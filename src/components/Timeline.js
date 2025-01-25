import React from "react";
import { Typography, Box, Paper, Link, Grid } from "@mui/material";
import {
  Timeline as MuiTimeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import AIButton from "./AIButton"; // Import the AIButton component

const TimelineComponent = ({ diagnoses, showAIButton }) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Diagnosis Timeline
      </Typography>
      <MuiTimeline position="alternate">
        {diagnoses.map((diag, index) => (
          <TimelineItem key={diag._id}>
            <TimelineOppositeContent color="text.secondary">
              {new Date(diag.createdAt).toLocaleDateString()}
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                <MedicalServicesIcon />
              </TimelineDot>
              {index !== diagnoses.length - 1 && <TimelineConnector />}
            </TimelineSeparator>
            <TimelineContent>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={9}>
                    <Typography variant="h6" component="span">
                      Diagnosis by Dr. {diag.doctor.name} (ID:{" "}
                      {diag.doctor.doctorId})
                    </Typography>
                    <Typography variant="body1">
                      <strong>Symptoms:</strong> {diag.symptoms}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Diagnosis:</strong> {diag.doctorDiagnosis}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Prescription:</strong> {diag.prescription}
                    </Typography>
                    {diag.report && (
                      <Box sx={{ mt: 1 }}>
                        <Link
                          href={`http://localhost:5000/${diag.report}`}
                          target="_blank"
                          rel="noopener"
                        >
                          View Lab Report
                        </Link>
                      </Box>
                    )}
                    {diag.image && (
                      <Box sx={{ mt: 1 }}>
                        <Link
                          href={`http://localhost:5000/${diag.image}`}
                          target="_blank"
                          rel="noopener"
                        >
                          View Medical Image
                        </Link>
                      </Box>
                    )}
                  </Grid>
                  {showAIButton && (
                    <Grid item xs={12} md={3}>
                      <AIButton /> {/* AIButton rendered conditionally */}
                    </Grid>
                  )}
                </Grid>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </MuiTimeline>
    </Box>
  );
};

export default TimelineComponent;
