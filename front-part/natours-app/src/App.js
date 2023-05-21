import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/header/Navbar";
import { Footer } from "./components/footer/Footer";
import { BodyTours } from "./components/body/BodyTours";
import { Signin } from "./components/signup-in/Signin";
import { Signup } from "./components/signup-in/Signup";
import { TourDetails } from "./components/body/TourDetails";
function App() {
  return (
    <div className="App">
      <Router path="/">
        <Navbar />
        <Routes>
          <Route path="/" element={<BodyTours />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/tour" element={<TourDetails />}></Route>
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
