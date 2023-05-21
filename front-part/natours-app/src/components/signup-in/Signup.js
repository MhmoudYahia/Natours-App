import React from "react";
import "./sign.css";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";

export const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [pass2, setPass2] = React.useState("");
  const [error, setError] = React.useState(null);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleChangeEmail = (event) => {
    if (!isValidEmail(event.target.value)) {
      setError("Email is invalid");
    } else {
      setError(null);
    }

    setEmail(event.target.value);
  };
  const handleChangePass = (e) => {
    setPass(e.target.value);
  };
  const handleChangePass2 = (e) => {
    setPass2(e.target.value);
  };
  const handelSubmitted = (e) => {
    console.log("submited");
  };

  const handleChangeFirstNAme = (e) => {
    setFirstName(e.target.value);
  };
  const handleChangeLastNAme = (e) => {
    setLastName(e.target.value);
  };
  return (
    <div className="layout">
      <form className="signup" onSubmit={handelSubmitted}>
        <h2>SIGN UP</h2>
        <TextField
          helperText="Please enter your first name"
          id="demo-helper-text-aligned"
          label="First Name"
          value={firstName}
          onChange={handleChangeFirstNAme}
        />
        <TextField
          helperText="Please enter your Last name"
          id="demo-helper-text-aligned"
          label="Last Name"
          value={lastName}
          onChange={handleChangeLastNAme}
        />
        <TextField
          helperText="Please enter your Mail"
          id="demo-helper-text-aligned"
          label="Email"
          value={email}
          onChange={handleChangeEmail}
        />
        <TextField
          helperText="Please enter your Password"
          id="demo-helper-text-aligned"
          label="Password"
          value={pass}
          onChange={handleChangePass}
        />
        <TextField
          helperText="Please confirm your Password"
          id="demo-helper-text-aligned"
          label="Password"
          value={pass2}
          onChange={handleChangePass2}
        />
        <Button className="Button" variant="outlined">
          Submit
        </Button>
        {error && <h2 style={{ color: "red" }}>{error}</h2>}
      </form>
    </div>
  );
};
