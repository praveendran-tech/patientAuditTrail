import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import PatientPortal from "./components/PatientPortal";
import DoctorPortal from "./components/DoctorPortal";
import CreatePatient from "./components/CreatePatient";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/patient" element={<PatientPortal />} />
        <Route path="/doctor" element={<DoctorPortal />} />
        <Route path="/create-patient" element={<CreatePatient />} />{" "}
        {/* Add the route */}
      </Routes>
    </Router>
  );
};

export default App;
