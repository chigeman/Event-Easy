import React from 'react';
import NavBar from './Components/navBar';  // Use capitalized NavBar
import HomePage from "./Sections/HomePage";

export default function App() {
  return (
    <>
      <NavBar />  {/* Use the correct component name */}
      <HomePage/>
    </>
  );
}