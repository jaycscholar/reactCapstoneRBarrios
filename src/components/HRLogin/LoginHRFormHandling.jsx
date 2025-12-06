import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from 'react-router-dom';

function HRFormHandling() {
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    userName: false,
    password: false,
    auth: false,
  });

  const [authError, setAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: false, auth: false });
    setAuthError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let formValid = true;
    const errorsCopy = { ...errors };

    for (const field in formValues) {
      if (!formValues[field]) {
        formValid = false;
        errorsCopy[field] = true;
      }
    }
    setErrors(errorsCopy);

    if (formValid) {
      setLoading(true);
      try {
        // Validate against dummy HR credentials
        const dummyHRUser = { userName: "AdminHR", password: "hr123" };

        if (
          formValues.userName === dummyHRUser.userName &&
          formValues.password === dummyHRUser.password
        ) {
          console.log("HR Form submitted with values: ", formValues);
          console.log("HR Credentials verified successfully!");
          signInHR(formValues.userName);
        } else {
          errorsCopy.auth = true;
          setAuthError("Invalid HR username or password");
          setErrors(errorsCopy);
          console.log("HR Authentication failed: Invalid credentials");
        }
      } catch (err) {
        errorsCopy.auth = true;
        setAuthError("Error processing HR sign-in");
        setErrors(errorsCopy);
        console.error("HR Authentication error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const { isHRSignedIn, signInHR: authSignInHR, signOutHR } = useAuth();
  const signInHR = authSignInHR;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {isHRSignedIn ? (
          <>
            <div className="text-center">
              <div className="text-4xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">HR Login Successful!</h2>
              <p className="text-gray-600 mb-6">You are now logged in as HR.</p>
              <button
                type="button"
                onClick={signOutHR}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Sign Out
              </button>
            </div>

            <div className="text-center mt-4">
              <div className="text-4xl mb-4"> </div>
              <Link
                to="/HRDashboard"
                className="w-full inline-block text-center bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
              >
                Go to HR Dashboard
              </Link>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">HR Login</h2>

            {errors.auth && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-400">
                {authError}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="userName" className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formValues.userName}
                onChange={handleChange}
                placeholder="Enter HR username"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.userName && <div className="text-red-500 text-sm mt-1">Please enter your username</div>}
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="Enter HR password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">Please enter your password</div>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 ${
                loading ? 'bg-gray-400 text-gray-200 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 font-semibold mb-2">HR Test Credentials:</p>
              <p className="text-sm text-gray-700"><strong>Username:</strong> AdminHR</p>
              <p className="text-sm text-gray-700"><strong>Password:</strong> hr123</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default HRFormHandling;
