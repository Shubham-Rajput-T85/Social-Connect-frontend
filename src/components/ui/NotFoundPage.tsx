import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 5,
          width: "80%",
          textAlign: "center",
          borderRadius: "25px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <SentimentDissatisfiedIcon
            sx={{
              fontSize: 100,
              color: "primary.main",
              mb: 1,
            }}
          />
          <Typography variant="h2" sx={{ fontWeight: 700 }}>
            404
          </Typography>
          <Typography variant="h5" color="text.secondary">
            Oops! Page not found
          </Typography>
          <Typography variant="body1" sx={{ mt: 1, mb: 3 }}>
            The page you’re looking for doesn’t exist or has been moved.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              px: 3,
              py: 1,
              borderRadius: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.10)",
              "&:hover": {
                backgroundColor: "#5558a3",
              },
            }}
          >
            Go Back Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default NotFoundPage;
