import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {Link} from 'react-router-dom';

function BasicFormHandling() {
  const [isNewEmployee, setIsNewEmployee] = useState(false);
  const [formValues, setFormValues] = useState({
    userName: "",
    password: "",
    
  });
  const [newEmployeeForm, setNewEmployeeForm] = useState({
    employeeName: "",
    userName: "",
    employeePassword: "",
    address: "",
    position: "",
    currentAssignment: "",
  });

  const [errors, setErrors] = useState({
    userName: false,
    password: false,
    auth: false,
  });

  const [newEmployeeErrors, setNewEmployeeErrors] = useState({});
  const [authError, setAuthError] = useState("");
  const [newEmployeeError, setNewEmployeeError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
    setErrors({ ...errors, [name]: false, auth: false });
    setAuthError("");
  };

  const handleNewEmployeeChange = (event) => {
    const { name, value } = event.target;
    setNewEmployeeForm({ ...newEmployeeForm, [name]: value });
    setNewEmployeeErrors({ ...newEmployeeErrors, [name]: false });
    setNewEmployeeError("");
  };

  const handleNewEmployeeSubmit = async (event) => {
    event.preventDefault();
    let formValid = true;
    const errorsCopy = {};

    // Validate required fields
    const requiredFields = ['employeeName', 'userName', 'employeePassword', 'position', 'address'];
    for (const field of requiredFields) {
      if (!newEmployeeForm[field]) {
        formValid = false;
        errorsCopy[field] = true;
      }
    }

    setNewEmployeeErrors(errorsCopy);

    if (formValid) {
      setSubmitLoading(true);
      try {
        // Check if username already exists
        const response = await fetch('http://localhost:3001/employees');
        const employees = await response.json();
        const userExists = employees.find(emp => emp.userName === newEmployeeForm.userName);

        if (userExists) {
          setNewEmployeeError("Username already exists");
          setSubmitLoading(false);
          return;
        }

        // Create new employee record
        const newEmployee = {
          employeeName: newEmployeeForm.employeeName,
          employeeUser: newEmployeeForm.userName,
          employeePassword: newEmployeeForm.employeePassword,
          address: newEmployeeForm.address,
          position: newEmployeeForm.position,
          currentAssignment: newEmployeeForm.currentAssignment || "",
          timeRequest: { startDate: '', endDate: '', approved: false, reviewed: false, note: '' },
          newEmployeeFlag: true, // Flag to indicate new employee profile not yet complete
        };

        const createResponse = await fetch('http://localhost:3001/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newEmployee),
        });

        if (createResponse.ok) {
          console.log("New employee created successfully!");
          signIn(newEmployeeForm.userName);
        } else {
          setNewEmployeeError("Failed to create employee profile");
        }
      } catch (err) {
        setNewEmployeeError("Error creating employee profile");
        console.error("Error:", err);
      } finally {
        setSubmitLoading(false);
      }
    }
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
          console.log("Form submitted with values: ", formValues);
          console.log("Credentials verified successfully!");
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

        ) : isNewEmployee ? (
          <form onSubmit={handleNewEmployeeSubmit}>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">New Employee Setup</h2>
            <p className="text-gray-600 text-center mb-6 text-sm">Complete your profile information</p>
            
            {newEmployeeError && (
              <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-400">
                {newEmployeeError}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="employeeName" className="block text-gray-700 font-semibold mb-2">Full Name</label>
              <input
                type="text"
                id="employeeName"
                name="employeeName"
                value={newEmployeeForm.employeeName}
                onChange={handleNewEmployeeChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  newEmployeeErrors.employeeName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {newEmployeeErrors.employeeName && <div className="text-red-500 text-sm mt-1">Please enter your full name</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="userName" className="block text-gray-700 font-semibold mb-2">Username</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={newEmployeeForm.userName}
                onChange={handleNewEmployeeChange}
                placeholder="Create a username"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  newEmployeeErrors.userName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {newEmployeeErrors.userName && <div className="text-red-500 text-sm mt-1">Please enter a username</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="employeePassword" className="block text-gray-700 font-semibold mb-2">Password</label>
              <input
                type="password"
                id="employeePassword"
                name="employeePassword"
                value={newEmployeeForm.employeePassword}
                onChange={handleNewEmployeeChange}
                placeholder="Create a password"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  newEmployeeErrors.employeePassword ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {newEmployeeErrors.employeePassword && <div className="text-red-500 text-sm mt-1">Please enter a password</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="position" className="block text-gray-700 font-semibold mb-2">Position</label>
              <input
                type="text"
                id="position"
                name="position"
                value={newEmployeeForm.position}
                onChange={handleNewEmployeeChange}
                placeholder="e.g., Software Developer"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  newEmployeeErrors.position ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {newEmployeeErrors.position && <div className="text-red-500 text-sm mt-1">Please enter your position</div>}
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={newEmployeeForm.address}
                onChange={handleNewEmployeeChange}
                placeholder="Enter your address"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  newEmployeeErrors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {newEmployeeErrors.address && <div className="text-red-500 text-sm mt-1">Please enter your address</div>}
            </div>

            <div className="mb-6">
              <label htmlFor="currentAssignment" className="block text-gray-700 font-semibold mb-2">Current Assignment (Optional)</label>
              <input
                type="text"
                id="currentAssignment"
                name="currentAssignment"
                value={newEmployeeForm.currentAssignment}
                onChange={handleNewEmployeeChange}
                placeholder="e.g., Project X Backend"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={submitLoading}
              className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 mb-3 ${
                submitLoading 
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {submitLoading ? 'Creating Profile...' : 'Create Profile'}
            </button>

            <button 
              type="button"
              onClick={() => setIsNewEmployee(false)}
              className="w-full font-semibold py-3 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 transition duration-200"
            >
              Back to Login
            </button>
          </form>
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

            <div className="mt-4 pt-4 border-t border-gray-300">
              <button
                type="button"
                onClick={() => setIsNewEmployee(true)}
                className="w-full font-semibold py-3 px-4 rounded-lg bg-green-600 hover:bg-green-700 text-white transition duration-200"
              >
                New Employee? Create Profile
              </button>
            </div>

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
