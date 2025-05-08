
import React from 'react';
import NavBar from './Components/navBar';  
import HomePage from "./Pages/HomePage";
import { Route, Routes } from 'react-router-dom';
import Classify_SU from './Pages/Classify_SU';
import Login_org from './Pages/Login_org'; 
import Login_att from './Pages/Login_att'; 
// import { DarkModeProvider } from './context/DarkModeContext';
import EmailVerify from './Pages/EmailVerify';

export default function App() {
  return (
    <div>
       {/* <NavBar />  */}
      
      {/* Use Routes and Route to define paths correctly */}
      <Routes>
        <Route path="/" element={<HomePage />} />  {/* HomePage will render for the root path */}
        <Route path="/Classify" element={<Classify_SU />} />  {/* Ensure this is correct for the signup page */}
        <Route path="/Login_Organizer" element={<Login_org />} />  {/* Ensure this is correct for the signup page */}
        <Route path="/Login_Attendee" element={<Login_att />} />  {/* Ensure this is correct for the signup page */}
        <Route path="/email-verify" element={<EmailVerify />} />  

      </Routes>
     
    </div>
  );
}

