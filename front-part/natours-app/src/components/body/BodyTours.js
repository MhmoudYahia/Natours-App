import React from "react";
import { TourCard } from "./TourCard";
import "./Card.css";

import { useFetch } from "../utils/useFetch";

// const myCookie = document.cookie
//   .split("; ")
//   .find((row) => row.startsWith("my_cookie="))
//   .split("=")[1];

export const BodyTours = () => {
    

  const { status, data } = useFetch("http://localhost:1444/api/v1/tours");

  return (
    <div className="Body-cards">
      {status &&
        data.docs.map((tour) => {
          return <TourCard tour={tour} />;
        })}
    </div>
  );
};
