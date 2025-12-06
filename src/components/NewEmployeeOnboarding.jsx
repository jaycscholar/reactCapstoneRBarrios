import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const NewEmployeeOnboarding = () => {
  const { currentUser } = useAuth();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3001/employees');
        const data = await response.json();

        const employeeData = data.find(
          (emp) => emp.employeeUser === currentUser
        );

        if (employeeData) {
          setEmployee(employeeData);
          setEditFormData(employeeData);
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

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value,
    });
  };

  const handleCompleteOnboarding = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = {
        ...employee,
        employeePassword: editFormData.employeePassword,
        employeeName: editFormData.employeeName,
        address: editFormData.address,
        position: editFormData.position || employee.position,
        currentAssignment: editFormData.currentAssignment || '',
        newEmployeeFlag: false,
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
        setSubmitMessage('✓ Profile setup completed!');
        setTimeout(() => {
          window.location.reload(); // Reload to show regular dashboard
        }, 1500);
      } else {
        setSubmitMessage('✗ Failed to complete setup');
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
    <div className="p-8 bg-gradient-to-br from-orange-50 to-orange-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        {submitMessage && (
          <div className={`mb-6 p-4 rounded-lg ${submitMessage.includes('✓') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {submitMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🌿</div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to LeafCorp Services!</h1>
            <p className="text-gray-600">Please complete your employee profile to get started</p>
          </div>

          <form onSubmit={handleCompleteOnboarding} className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 font-semibold text-sm">🌱 New Employee Onboarding</p>
              <p className="text-green-700 text-xs mt-1">Fill in your details below. HR will review and approve your profile.</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                name="employeeUser"
                value={editFormData.employeeUser || ''}
                readOnly
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">Your username can only be changed by HR</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password *</label>
              <input
                type="password"
                name="employeePassword"
                value={editFormData.employeePassword || ''}
                onChange={handleEditChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-gray-500 text-xs mt-1">You can change this password if needed</p>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name *</label>
              <input
                type="text"
                name="employeeName"
                value={editFormData.employeeName || ''}
                onChange={handleEditChange}
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Position *</label>
              <input
                type="text"
                name="position"
                value={editFormData.position || employee.position}
                onChange={handleEditChange}
                placeholder="e.g., Software Developer"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={editFormData.address || ''}
                onChange={handleEditChange}
                placeholder="Enter your address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">Active Plant Project (Optional)</label>
              <input
                type="text"
                name="currentAssignment"
                value={editFormData.currentAssignment || ''}
                onChange={handleEditChange}
                placeholder="e.g., Succulent Hydration Project"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 text-lg"
            >
              Complete Employee Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewEmployeeOnboarding;
