import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

const ErrorPage = ({ errorMessage }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "80vh",
        textAlign: "center",
        backgroundColor: (theme) => theme.palette.background.default,
      }}
    >
      <Typography variant="h2" sx={{ marginBottom: 4, color: "chocolate" }}>
        OH, SOME THING WENT WRONG
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 4 }}>
        {errorMessage || "An error occurred."}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 4 }}
        onClick={() => window.location.reload(true)}
      >
        Reload Page
      </Button>
    </Box>
  );
};

export default ErrorPage;
