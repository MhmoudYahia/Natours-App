import React from "react";
import "./nav.modul.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import PermIdentityOutlinedIcon from "@mui/icons-material/PermIdentityOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import IosShareIcon from "@mui/icons-material/IosShare";
import SailingIcon from "@mui/icons-material/Sailing";


export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link className="link" to="/">
          <SailingIcon style={{ color: "#ffc100" }} />
          <div>All Tours</div>
        </Link>
      </div>
      <div className="navlinks">
        <Link to="/signin" className="link">
          <Button
            variant="contained"
            className="Button"
            endIcon={<PermIdentityOutlinedIcon />}
          >
            Sign IN
          </Button>
        </Link>
        <Link to="/signup" className="link">
          <Button
            variant="contained"
            className="Button"
            endIcon={<IosShareIcon />}
          >
            Sign UP
          </Button>
        </Link>
        <Link to="/logout" className="link">
          <Button
            variant="contained"
            className="Button"
            endIcon={<LogoutIcon />}
          >
            LOG OUT
          </Button>
        </Link>
      </div>
    </nav>
  );
};
