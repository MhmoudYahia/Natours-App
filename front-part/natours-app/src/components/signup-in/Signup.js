import React from "react";
import "./sign.css";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export const Signup = () => {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [pass2, setPass2] = React.useState("");
  const [error, setError] = React.useState(null);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [showPass1, setShowPass1] = React.useState(false);
  const [showPass2, setShowPass2] = React.useState(false);

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
  const handleToggleShowPass1 = () => {
    setShowPass1(!showPass1);
  };
  const handleToggleShowPass2 = () => {
    setShowPass2(!showPass2);
  };
  const handleChangePass1 = (e) => {
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
          id="pass"
          label="Password"
          type={showPass1 ? "text" : "password"}
          value={pass}
          onChange={handleChangePass1}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleShowPass1}
                  edge="end"
                  style={{ width: "50px" }}
                >
                  {showPass1 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          helperText="Please confirm your Password"
          id="pass"
          label="Password"
          type={showPass2 ? "text" : "password"}
          value={pass2}
          onChange={handleChangePass2}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={handleToggleShowPass2}
                  edge="end"
                  style={{ width: "50px" }}
                >
                  {showPass2 ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button className="Button" variant="outlined">
          Submit
        </Button>
        {error && <h2 style={{ color: "red" }}>{error}</h2>}
      </form>
    </div>
  );
};
