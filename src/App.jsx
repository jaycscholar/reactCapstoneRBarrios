import React, {createContext, useState, useEffect} from "react";

import HomePage from "./components/Home.jsx";

import Protected from "./components/EmployeeLogin/protected";
import ProtectedHR from "./components/HRLogin/ProtectedHR";

import LoginEmployee from "./components/EmployeeLogin/LoginEmployee";
import LoginHR from "./components/HRLogin/LoginHR";

import EmployeeDashboard from "./components/EmployeeDashboard"

import HRDashboard from "./components/HRDashboard"


import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Link} from 'react-router-dom';



const App = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    
    <Router>
      <div className="App">

        <header className="bg-gradient-to-r from-forest-700 to-forest-900 shadow-lg sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h3 className="text-white text-2xl font-bold">LeafCorp</h3>
              
              {/* Hamburger Menu Button - Only visible on small screens */}
              <button 
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-white focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Navigation Menu - Hidden on mobile, shown in hamburger */}
            <nav className={`${menuOpen ? 'block' : 'hidden'} md:flex md:flex-wrap gap-2 mt-4`}>
              <Link 
                to='/' 
                onClick={() => setMenuOpen(false)}
                className="block md:inline-block px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105 mb-2 md:mb-0"
              >
                🏠 Home
              </Link>
              <Link 
                to='/LoginEmployee' 
                onClick={() => setMenuOpen(false)}
                className="block md:inline-block px-4 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105 mb-2 md:mb-0"
              >
                👤 Employee Login
              </Link>
              <Link 
                to='/userDashboard' 
                onClick={() => setMenuOpen(false)}
                className="block md:inline-block px-4 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105 mb-2 md:mb-0"
              >
                📊 Employee Dashboard
              </Link>
              <Link 
                to='/LoginHR' 
                onClick={() => setMenuOpen(false)}
                className="block md:inline-block px-4 py-2 bg-forest-700 hover:bg-forest-600 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105 mb-2 md:mb-0"
              >
                👔 HR Login
              </Link>
              <Link 
                to='/HRDashboard' 
                onClick={() => setMenuOpen(false)}
                className="block md:inline-block px-4 py-2 bg-forest-700 hover:bg-forest-600 text-white rounded-lg font-semibold transition duration-200 ease-in-out transform hover:scale-105 mb-2 md:mb-0"
              >
                💼 HR Dashboard
              </Link>
            </nav>
          </div>
        </header>

        <Routes>
          <Route path="/" element={<HomePage />} />
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

