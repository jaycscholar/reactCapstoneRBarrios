import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {Link} from 'react-router-dom';

function BasicFormHandling() {
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

  const handleSubmit = async (event) => {
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
        // Fetch all employees from the JSON server
        const response = await fetch('http://localhost:3001/employees');
        const employees = await response.json();

        // Find employee matching the username
        const employee = employees.find(
          (emp) => emp.employeeUser === formValues.userName
        );

        if (employee && employee.employeePassword === formValues.password) {

          signIn(formValues.userName);
        } else {
          errorsCopy.auth = true;
          setAuthError("Invalid username or password");
          setErrors(errorsCopy);
          console.log("Authentication failed: Invalid credentials");
        }
      } catch (err) {
        errorsCopy.auth = true;
        setAuthError("Error connecting to server");
        setErrors(errorsCopy);
        console.error("Authentication error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const { isSignedIn, signIn: authSignIn, signOut } = useAuth();
  const signIn = authSignIn;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
        {isSignedIn ? (
          <> 
          <div className="text-center border-b pb-6 mb-6">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-4">Login Successful!</h2>
            <p className="text-gray-600 mb-6">You are now logged in as an employee.</p>
            <button 
              type="button" 
              onClick={signOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Sign Out
            </button>
          </div> 

                    <div className="text-center mt-6" >

                   

            <Link
              to="/userDashboard"
              className="w-full inline-block text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              Go to Employee Dashboard
            </Link>
          </div>
</>

        ) : (
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Employee Login</h2>
            
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
                placeholder="Enter your username"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
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
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <div className="text-red-500 text-sm mt-1">Please enter your password</div>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 ${
                loading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 font-semibold mb-2">Test Credentials:</p>
              <p className="text-sm text-gray-700"><strong>Username:</strong> MercyB47</p>
              <p className="text-sm text-gray-700"><strong>Password:</strong> cat123</p>
              <p className="text-xs text-gray-500 mt-2">Or use: JohnS23 / pass456 or SarahJ88 / secure789</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export default BasicFormHandling;
