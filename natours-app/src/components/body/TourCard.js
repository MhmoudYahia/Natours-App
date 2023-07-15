import React from "react";
import "./Card.css";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import TourIcon from "@mui/icons-material/Tour";
import WorkIcon from "@mui/icons-material/Work";
import PeopleIcon from "@mui/icons-material/People";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";

export const TourCard = ({ tour }) => {
  return (
    <div className="card">
      <div className="card-header">
        <div className="img-layout"></div>
        <div className="image">
          <img src={`/img/tours/${tour.imageCover}`} alt="" />
        </div>
        <div className="text-img tour-name">{tour.name}</div>
      </div>
      <div className="card-data">
        <p style={{ fontWeight: 700,textTransform:'uppercase' }}>
          {` ${tour.difficulty} ${tour.duration}-DAY TOUR`}
        </p>
        <p>{tour.summary}</p>
        <div className="card-details">
          <div>
            <LocationOnIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />

            <span>{tour.startLocation.description}</span>
          </div>
          <div>
            <PeopleIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />
            <span>{tour.maxGroupSize}</span>
            <span> People</span>
          </div>
          <div>
            <TourIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />
            <span>{tour.locations.length}</span>
            <span> stops</span>
          </div>
          <div>
            <WorkIcon style={{ color: "rgba(40, 180, 135, 0.85)" }} />
            <span>
              {new Date(tour.startDates[0].date).toLocaleString("en-us", {
                month: "long",
                year: "numeric",
              })
              }
            </span>
          </div>
        </div>
      </div>
      <div className="card-footer">
        <div className="footer-data">
          <p>
            <span style={{ fontWeight: "bold" }}>{`$${tour.price}`}</span> Per
            Person
          </p>
          <p>
            <span style={{ fontWeight: "bold" }}>{tour.ratingsAverage}</span>{" "}
            rating
            <span >{`(${tour.ratingsQuantity})`}</span>
          </p>
        </div>
        <div>
          <Link to={`/tour/${tour._id}`} className="link">
            {" "}
            <Button className="Button" variant="outlined">
              Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
