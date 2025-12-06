import React, {createContext, useState, useEffect} from "react";

import homePage from "./components/Home.jsx";

import Protected from "./components/EmployeeLogin/protected";
import ProtectedHR from "./components/HRLogin/ProtectedHR";

import LoginEmployee from "./components/EmployeeLogin/LoginEmployee";
import LoginHR from "./components/HRLogin/LoginHR";

import EmployeeDashboard from "./components/EmployeeDashboard"

import HRDashboard from "./components/HRDashboard"


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Link} from 'react-router-dom';



const App = () => {



  return (
    
    <Router>
      <div className="App">

        <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h3 className="text-white text-2xl font-bold mb-4">LeafCorp Services</h3>
            <nav className="flex flex-wrap gap-2">
              <Link 
                to='/' 
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105"
              >
                🏠 Home
              </Link>
              <Link 
                to='/LoginEmployee' 
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105"
              >
                👤 Employee Login
              </Link>
              <Link 
                to='/userDashboard' 
                className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105"
              >
                📊 Employee Dashboard
              </Link>
              <Link 
                to='/LoginHR' 
                className="inline-block px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105"
              >
                👔 HR Login
              </Link>
              <Link 
                to='/HRDashboard' 
                className="inline-block px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105"
              >
                💼 HR Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<homePage />} />
          <Route path="/LoginEmployee" element={<LoginEmployee />} />
      
           <Route path="/userDashboard" element={
              <Protected>
              <EmployeeDashboard /> 
              </Protected>

          } />

          <Route path="/LoginHR" element={<LoginHR />} />
          <Route path="/HRDashboard" element={
               <ProtectedHR>
              <div>
              <HRDashboard />
              </div>
            </ProtectedHR>

          } />

        </Routes>
      </div>
    </Router>
  );
};

export default App;

