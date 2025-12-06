import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const EmployeeDashboard = () => {
  const { currentUser } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [timeRequestMode, setTimeRequestMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [timeRequestData, setTimeRequestData] = useState({
    startDate: '',
    endDate: '',
    note: '',
  });
  const [submitMessage, setSubmitMessage] = useState('');
  const [assignmentEditMode, setAssignmentEditMode] = useState(false);
  const [assignmentValue, setAssignmentValue] = useState('');
  const [passwordChangeMode, setPasswordChangeMode] = useState(false);
  const [passwordChangeData, setPasswordChangeData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/employees');
        const data = await response.json();

        // Find the employee that matches the current user
        const employeeData = data.find(
          (emp) => emp.employeeUser === currentUser
        );

        if (employeeData) {
          setEmployee(employeeData);
          setEditFormData(employeeData);
          setAssignmentValue(employeeData.currentAssignment || '');
        } else {
          setError('Employee data not found');
        }
      } catch (err) {
        setError(`Failed to load employee data: ${err.message}`);
        console.error('Error fetching employee data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchEmployeeData();
    }
  }, [currentUser]);

  // Handle edit form input change
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  // Handle time request form input change
  const handleTimeRequestChange = (e) => {
    const { name, value } = e.target;
    setTimeRequestData({
      ...timeRequestData,
      [name]: value,
    });
  };

  // Submit edited employee details
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setEmployee(editFormData);
        setEditMode(false);
        setSubmitMessage('✓ Profile updated successfully!');
        setTimeout(() => setSubmitMessage(''), 3000);
      } else {
        setSubmitMessage('✗ Failed to update profile');
      }
    } catch (err) {
      setSubmitMessage(`✗ Error: ${err.message}`);
    }
  };

  // Update only the current assignment from the Work Information card
  const handleAssignmentSave = async () => {
    try {
      const updatedEmployee = {
        ...employee,
        currentAssignment: assignmentValue,
      };

      const response = await fetch(`http://localhost:3001/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
        setEmployee(updatedEmployee);
        setEditFormData(updatedEmployee);
        setAssignmentEditMode(false);
        setSubmitMessage('✓ Current assignment updated');
        setTimeout(() => setSubmitMessage(''), 3000);
      } else {
        setSubmitMessage('✗ Failed to update assignment');
      }
    } catch (err) {
      setSubmitMessage(`✗ Error: ${err.message}`);
    }
  };

  const handleAssignmentCancel = () => {
    setAssignmentValue(employee.currentAssignment || '');
    setAssignmentEditMode(false);
  };

  // Handle password change form input change
  const handlePasswordChangeInput = (e) => {
    const { name, value } = e.target;
    setPasswordChangeData({
      ...passwordChangeData,
      [name]: value,
    });
  };

  // Submit password change
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();

    // Validate current password
    if (passwordChangeData.currentPassword !== employee.employeePassword) {
      setSubmitMessage('✗ Current password is incorrect');
      return;
    }

    // Validate new password matches confirmation
    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) {
      setSubmitMessage('✗ New passwords do not match');
      return;
    }

    // Validate new password is not empty
    if (!passwordChangeData.newPassword) {
      setSubmitMessage('✗ New password cannot be empty');
      return;
    }

    // Validate new password is different from current
    if (passwordChangeData.newPassword === employee.employeePassword) {
      setSubmitMessage('✗ New password must be different from current password');
      return;
    }

    try {
      const updatedEmployee = {
        ...employee,
        employeePassword: passwordChangeData.newPassword,
      };

      const response = await fetch(`http://localhost:3001/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
        setEmployee(updatedEmployee);
        setPasswordChangeMode(false);
        setPasswordChangeData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setSubmitMessage('✓ Password changed successfully!');
        setTimeout(() => setSubmitMessage(''), 3000);
      } else {
        setSubmitMessage('✗ Failed to change password');
      }
    } catch (err) {
      setSubmitMessage(`✗ Error: ${err.message}`);
    }
  };

  // Submit time request
  const handleTimeRequestSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = {
        ...employee,
        timeRequest: {
          startDate: timeRequestData.startDate,
          endDate: timeRequestData.endDate,
          approved: false, // New requests start as pending
          note: timeRequestData.note,
        },
      };

      const response = await fetch(`http://localhost:3001/employees/${employee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEmployee),
      });

      if (response.ok) {
        setEmployee(updatedEmployee);
        setTimeRequestMode(false);
        setTimeRequestData({ startDate: '', endDate: '', note: '' });
        setSubmitMessage('✓ Time request submitted successfully!');
        setTimeout(() => setSubmitMessage(''), 3000);
      } else {
        setSubmitMessage('✗ Failed to submit time request');
      }
    } catch (err) {
      setSubmitMessage(`✗ Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading employee data...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600">{error}</div>;
  }

  if (!employee) {
    return <div className="p-8 text-center text-gray-600">No employee data found</div>;
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Success/Error Message */}
        {submitMessage && (
          <div className={`mb-6 p-4 rounded-lg ${submitMessage.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitMessage}
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {employee.employeeName}!</h1>
          <p className="text-gray-600">{employee.position}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          {!editMode ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Personal Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Employee ID</p>
                  <p className="text-gray-800 font-semibold">#{employee.id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Username</p>
                  <p className="text-gray-800 font-semibold">{employee.employeeUser}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Address</p>
                  <p className="text-gray-800 font-semibold">{employee.address}</p>
                </div>
              </div>
              <button
                onClick={() => setEditMode(true)}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Personal Information</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Name</label>
                  <input
                    type="text"
                    name="employeeName"
                    value={editFormData.employeeName || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={editFormData.address || ''}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Work Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Work Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">Position</p>
                <p className="text-gray-800 font-semibold">{employee.position}</p>
              </div>
              <div className="pt-3 border-t">
                <p className="text-gray-600 text-sm">Current Assignment</p>
                {!assignmentEditMode ? (
                  <>
                    <p className="text-gray-800 font-semibold">{employee.currentAssignment}</p>
                    <button
                      onClick={() => {
                        setAssignmentValue(employee.currentAssignment || '');
                        setAssignmentEditMode(true);
                      }}
                      className="mt-2 inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition"
                    >
                      Edit Current Assignment
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={assignmentValue}
                      onChange={(e) => setAssignmentValue(e.target.value)}
                      placeholder="e.g., Backend API Development"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAssignmentSave}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleAssignmentCancel}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Time Request Information */}
          {!timeRequestMode ? (
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Time Request</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-gray-600 text-sm">Start Date</p>
                  <p className="text-gray-800 font-semibold">{employee.timeRequest.startDate}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">End Date</p>
                  <p className="text-gray-800 font-semibold">{employee.timeRequest.endDate}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className={`font-semibold ${employee.timeRequest.approved ? 'text-green-600' : 'text-yellow-600'}`}>
                    {employee.timeRequest.approved ? '✓ Approved' : employee.timeRequest.reviewed ? '❌ Rejected' : '⏳ Pending'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Note</p>
                  <p className="text-gray-800 font-semibold text-sm">{employee.timeRequest.note}</p>
                </div>
              </div>
              <button
                onClick={() => setTimeRequestMode(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                New Time Request
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Submit New Time Request</h2>
              <form onSubmit={handleTimeRequestSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">Start Date</label>
                    <input
                      type="date"
                      name="startDate"
                      value={timeRequestData.startDate}
                      onChange={handleTimeRequestChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-1">End Date</label>
                    <input
                      type="date"
                      name="endDate"
                      value={timeRequestData.endDate}
                      onChange={handleTimeRequestChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Request Note</label>
                  <textarea
                    name="note"
                    value={timeRequestData.note}
                    onChange={handleTimeRequestChange}
                    placeholder="Add any additional information about your time request..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Submit Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeRequestMode(false)}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Change Password */}
          {!passwordChangeMode ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Account Security</h2>
              <p className="text-gray-600 text-sm mb-4">Change your password to keep your account secure.</p>
              <button
                onClick={() => setPasswordChangeMode(true)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Change Password
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordChangeData.currentPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordChangeData.newPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordChangeData.confirmPassword}
                    onChange={handlePasswordChangeInput}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Update Password
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordChangeMode(false);
                      setPasswordChangeData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                      });
                    }}
                    className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;