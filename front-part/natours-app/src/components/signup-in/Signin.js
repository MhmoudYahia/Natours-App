import React from "react";
import "./sign.css";
import MailIcon from "@mui/icons-material/Mail";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Link, useNavigate } from "react-router-dom";
import axiosWrapper from "../utils/axiosWrapper";


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

  const handelSubmitted = async (e) => {
    console.log(email, pass);
    try {
      const { token } = await axiosWrapper.post("/users/login", {
        email,
        password: pass,
      });
      // setEmail("");
      // setPass("");
      console.log(token);
    } catch (error) {
      console.log(error);
    }
  };
  // request

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
        <Button className="Button" variant="outlined" onClick={handelSubmitted}>
          SIGN IN
        </Button>
        <Link to="/signup">
          <p>Need Account?</p>
        </Link>
        {error && <h2 style={{ color: "red" }}>{error}</h2>}
      </form>
    </div>
  );
};
