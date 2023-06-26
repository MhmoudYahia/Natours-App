import React from "react";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";

const MyAlert = ({ severity, title, message }) => {
  return (
    <div className="alert">
      <Alert severity={severity}>
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </div>
  );
};

export default MyAlert;
