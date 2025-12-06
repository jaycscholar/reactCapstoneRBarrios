import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, currentUser, signOut, isHRSignedIn, currentHRUser, signOutHR } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold hover:text-blue-100 transition">
              SLCorpManage
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition"
            >
              Home
            </Link>

            {!isSignedIn && (
              <Link
                to="/LoginEmployee"
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition"
              >
                Employee Login
              </Link>
            )}

            {isSignedIn && (
              <Link
                to="/userDashboard"
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition"
              >
                Employee Dashboard
              </Link>
            )}

            {!isHRSignedIn && (
              <Link
                to="/LoginHR"
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition"
              >
                HR Login
              </Link>
            )}

            {isHRSignedIn && (
              <Link
                to="/HRDashboard"
                className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-500 transition"
              >
                HR Dashboard
              </Link>
            )}
          </div>

          {/* User Info & Logout */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn && (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm font-medium">{currentUser}</span>
                <button
                  onClick={signOut}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            )}

            {isHRSignedIn && (
              <div className="flex items-center space-x-3">
                <span className="text-white text-sm font-medium">{currentHRUser} (HR)</span>
                <button
                  onClick={signOutHR}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-500 transition"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>

            {!isSignedIn && (
              <Link
                to="/LoginEmployee"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Employee Login
              </Link>
            )}

            {isSignedIn && (
              <Link
                to="/userDashboard"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                Employee Dashboard
              </Link>
            )}

            {!isHRSignedIn && (
              <Link
                to="/LoginHR"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                HR Login
              </Link>
            )}

            {isHRSignedIn && (
              <Link
                to="/HRDashboard"
                className="text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition"
                onClick={() => setIsOpen(false)}
              >
                HR Dashboard
              </Link>
            )}

            {(isSignedIn || isHRSignedIn) && (
              <div className="px-3 py-2 space-y-2">
                {isSignedIn && (
                  <>
                    <div className="text-white text-sm">{currentUser}</div>
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Logout
                    </button>
                  </>
                )}

                {isHRSignedIn && (
                  <>
                    <div className="text-white text-sm">{currentHRUser} (HR)</div>
                    <button
                      onClick={() => {
                        signOutHR();
                        setIsOpen(false);
                      }}
                      className="w-full bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
