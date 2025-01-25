import React, { useState } from "react";
import { Button, Modal, Typography, Box } from "@mui/material";

const AIButton = () => {
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState("");

  const handleAiAnalysis = () => {
    const randomParagraphs = [
      "AI analysis reveals potential early warning signs. Consult your doctor for more details.",
      "Machine learning algorithms detected a unique pattern in the diagnostic data.",
      "Advanced algorithms found no anomalies in the diagnostic timeline. All clear!",
    ];
    const randomIndex = Math.floor(Math.random() * randomParagraphs.length);
    setAiAnalysis(randomParagraphs[randomIndex]);
    setAiModalOpen(true);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleAiAnalysis}
        sx={{
          borderRadius: "20px",
          textTransform: "none",
          fontSize: "0.9rem",
        }}
      >
        Analyze with AI
      </Button>
      <Modal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        aria-labelledby="ai-modal-title"
        aria-describedby="ai-modal-description"
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
            id="ai-modal-title"
            variant="h5"
            sx={{ fontWeight: "bold", mb: 2 }}
          >
            AI Analysis
          </Typography>
          <Typography id="ai-modal-description">{aiAnalysis}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setAiModalOpen(false)}
            sx={{ mt: 3, borderRadius: "20px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default AIButton;
