import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ButtonMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn, currentUser, signOut, isHRSignedIn, currentHRUser, signOutHR } = useAuth();

  const menuItems = [
    { label: 'Home', path: '/', icon: '🏠' },
    ...(isSignedIn
      ? [
          { label: 'Employee Dashboard', path: '/userDashboard', icon: '📊' },
          { label: 'Profile', path: '/profile', icon: '👤', action: null },
        ]
      : [{ label: 'Employee Login', path: '/LoginEmployee', icon: '👤' }]),
    ...(isHRSignedIn
      ? [
          { label: 'HR Dashboard', path: '/HRDashboard', icon: '💼' },
          { label: 'HR Profile', path: '/hr-profile', icon: '👔', action: null },
        ]
      : [{ label: 'HR Login', path: '/LoginHR', icon: '👔' }]),
  ];

  const handleLogout = () => {
    if (isSignedIn) {
      signOut();
    }
    if (isHRSignedIn) {
      signOutHR();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-md"
      >
        <span>☰</span>
        <span>Menu</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* User Info */}
          {(isSignedIn || isHRSignedIn) && (
            <div className="px-4 py-3 border-b border-gray-200">
              {isSignedIn && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    👤
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{currentUser}</p>
                    <p className="text-xs text-gray-500">Employee</p>
                  </div>
                </div>
              )}
              {isHRSignedIn && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    👔
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{currentHRUser}</p>
                    <p className="text-xs text-gray-500">HR Manager</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150 text-sm font-medium"
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          {(isSignedIn || isHRSignedIn) && <div className="border-t border-gray-200" />}

          {/* Logout Button */}
          {(isSignedIn || isHRSignedIn) && (
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-150 text-sm font-medium flex items-center gap-3"
            >
              <span className="text-lg">🚪</span>
              <span>Logout</span>
            </button>
          )}
        </div>
      )}

      {/* Close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ButtonMenu;
