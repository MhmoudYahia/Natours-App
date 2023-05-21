import React from "react";
import "./sign.css";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link } from "react-router-dom";

export const Signin = () => {
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [error, setError] = React.useState(null);

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

  const handelSubmitted = (e) => {
    console.log("submited");
  };
  return (
    <div className="layout">
      <form className="signin" onSubmit={handelSubmitted}>
        <h2>LOG INTO YOUR ACCOUNT</h2>

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
        <Button className="Button" variant="outlined">
          SIGN IN
        </Button>
        <Link to='/signup'>
          <p>Need Account?</p>
        </Link>
        {error && <h2 style={{ color: "red" }}>{error}</h2>}
      </form>
    </div>
  );
};
