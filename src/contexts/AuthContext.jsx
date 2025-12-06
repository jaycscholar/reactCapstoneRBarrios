import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({
  isSignedIn: false,
  currentUser: null,
  signIn: () => {},
  signOut: () => {},
  isHRSignedIn: false,
  currentHRUser: null,
  signInHR: () => {},
  signOutHR: () => {},
});

export function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(() => {
    try {
      const stored = localStorage.getItem("isSignedIn");
      return stored === "true";
    } catch (e) {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentUser");
      return stored || null;
    } catch (e) {
      return null;
    }
  });

  const [isHRSignedIn, setIsHRSignedIn] = useState(() => {
    try {
      const stored = localStorage.getItem("isHRSignedIn");
      return stored === "true";
    } catch (e) {
      return false;
    }
  });

  const [currentHRUser, setCurrentHRUser] = useState(() => {
    try {
      const stored = localStorage.getItem("currentHRUser");
      return stored || null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("isSignedIn", isSignedIn ? "true" : "false");
    } catch (e) {
      // ignore localStorage errors (e.g., private mode)
    }
  }, [isSignedIn]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem("currentUser", currentUser);
      } else {
        localStorage.removeItem("currentUser");
      }
    } catch (e) {
      // ignore localStorage errors (e.g., private mode)
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem("isHRSignedIn", isHRSignedIn ? "true" : "false");
    } catch (e) {
      // ignore localStorage errors (e.g., private mode)
    }
  }, [isHRSignedIn]);

  useEffect(() => {
    try {
      if (currentHRUser) {
        localStorage.setItem("currentHRUser", currentHRUser);
      } else {
        localStorage.removeItem("currentHRUser");
      }
    } catch (e) {
      // ignore localStorage errors (e.g., private mode)
    }
  }, [currentHRUser]);

  const signIn = (userName) => {
    setIsSignedIn(true);
    if (userName) setCurrentUser(userName);
  };
  const signOut = () => {
    setIsSignedIn(false);
    setCurrentUser(null);
  };

  const signInHR = (hrUserName) => {
    setIsHRSignedIn(true);
    if (hrUserName) setCurrentHRUser(hrUserName);
  };
  const signOutHR = () => {
    setIsHRSignedIn(false);
    setCurrentHRUser(null);
  };

  return (
    <AuthContext.Provider value={{ isSignedIn, currentUser, signIn, signOut, isHRSignedIn, currentHRUser, signInHR, signOutHR }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
