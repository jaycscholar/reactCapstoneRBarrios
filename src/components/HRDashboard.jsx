import React, { useState, useEffect } from 'react';

const HRDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [newUserName, setNewUserName] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [addLoading, setAddLoading] = useState(false);
    const [addError, setAddError] = useState('');
    const [noteEdits, setNoteEdits] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [passwordVisibility, setPasswordVisibility] = useState({});

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3001/employees');
            const data = await response.json();
            setEmployees(data);
        } catch (err) {
            setError(`Failed to load employees: ${err.message}`);
            console.error('Error fetching employees:', err);
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = (id) => {
        setPasswordVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleEditStart = (employee) => {
        setEditingId(employee.id);
        setEditFormData({ ...employee });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setEditFormData({
                ...editFormData,
                [parent]: {
                    ...editFormData[parent],
                    [child]: value,
                },
            });
        } else {
            setEditFormData({
                ...editFormData,
                [name]: value,
            });
        }
    };

    const handleSaveEmployee = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData),
            });

            if (response.ok) {
                setEmployees(employees.map(emp => emp.id === id ? editFormData : emp));
                setEditingId(null);
                setSuccessMessage('Employee updated successfully!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error updating employee:', err);
        }
    };

    const handleApproveTimeRequest = async (id, approved) => {
        try {
            const employee = employees.find(emp => emp.id === id);
            const noteValue = noteEdits[id] !== undefined ? noteEdits[id] : (employee?.timeRequest?.note || '');
            const updatedEmployee = {
                ...employee,
                timeRequest: {
                    ...employee.timeRequest,
                    approved: approved,
                    reviewed: true,
                    note: noteValue,
                },
            };

            const response = await fetch(`http://localhost:3001/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmployee),
            });

            if (response.ok) {
                setEmployees(employees.map(emp => emp.id === id ? updatedEmployee : emp));
                setNoteEdits(prev => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });
                setSuccessMessage(`Time request ${approved ? 'approved' : 'rejected'}!`);
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error updating time request:', err);
        }
    };

    const handleDeleteEmployee = async (id) => {
        const ok = window.confirm('Delete this employee? This action cannot be undone.');
        if (!ok) return;
        try {
            const response = await fetch(`http://localhost:3001/employees/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                setEmployees(employees.filter(emp => emp.id != id));
                setSuccessMessage('Employee deleted');
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                console.error('Failed to delete employee, status:', response.status);
            }
        } catch (err) {
            console.error('Error deleting employee:', err);
        }
    };

    const handleApproveNewHire = async (id) => {
        try {
            const employee = employees.find(emp => emp.id === id);
            const updatedEmployee = {
                ...employee,
                newEmployeeFlag: false,
            };

            const response = await fetch(`http://localhost:3001/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmployee),
            });

            if (response.ok) {
                setEmployees(employees.map(emp => emp.id === id ? updatedEmployee : emp));
                setSuccessMessage('New hire approved!');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (err) {
            console.error('Error approving new hire:', err);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-600">Loading employees...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }

    const filteredEmployees = employees.filter((emp) => {
        const term = searchTerm.toLowerCase();
        if (!term) return true;
        return (
            (emp.employeeName && emp.employeeName.toLowerCase().includes(term)) ||
            (emp.employeeUser && emp.employeeUser.toLowerCase().includes(term)) ||
            (emp.timeRequest && emp.timeRequest.note && emp.timeRequest.note.toLowerCase().includes(term)) ||
            (emp.currentAssignment && emp.currentAssignment.toLowerCase().includes(term))
        );
    });

    return (
        <div className="p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">HR Portal</h1>
                    <p className="text-gray-600">Manage employees and approve Time Off</p>
                    <p className="text-sm text-green-600 font-semibold mt-1">LeafCorp Services</p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg border border-green-400">
                        ✓ {successMessage}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6 bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">🔍 Search employee</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name, username, plant project, or note"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div className="text-sm text-gray-600">Showing {filteredEmployees.length} of {employees.length}</div>
                </div>

                {/* Add Employee Card */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">🌱 Add New Employee</h3>
                        {addError && <div className="mb-3 p-2 bg-red-100 text-red-700 rounded">{addError}</div>}
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                            <input
                                type="text"
                                placeholder="Username"
                                value={newUserName}
                                onChange={(e) => setNewUserName(e.target.value)}
                                className="col-span-1 md:col-span-1 px-3 py-2 border rounded-lg"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="col-span-1 md:col-span-1 px-3 py-2 border rounded-lg"
                            />
                            <div className="col-span-1 md:col-span-1 flex items-center">
                                <button
                                    onClick={async () => {
                                        setAddError('');
                                        if (!newUserName || !newPassword) {
                                            setAddError('Please provide both username and password');
                                            return;
                                        }
                                        setAddLoading(true);
                                        try {
                                            const newEmployee = {
                                                employeeName: '',
                                                employeeUser: newUserName,
                                                employeePassword: newPassword,
                                                address: '',
                                                position: '',
                                                currentAssignment: '',
                                                timeRequest: { startDate: '', endDate: '', approved: false, reviewed: false, note: '' },
                                                newEmployeeFlag: true
                                            };
                                            const resp = await fetch('http://localhost:3001/employees', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify(newEmployee),
                                            });
                                            if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
                                            const created = await resp.json();
                                            setEmployees(prev => [created, ...prev]);
                                            setNewUserName('');
                                            setNewPassword('');
                                            setSuccessMessage('New employee added! Give them their username and password so they can input their information.');
                                            setTimeout(() => setSuccessMessage(''), 5000);
                                        } catch (err) {
                                            console.error('Error adding employee:', err);
                                            setAddError('Failed to add employee');
                                        } finally {
                                            setAddLoading(false);
                                        }
                                    }}
                                    disabled={addLoading}
                                    className={`w-full ${addLoading ? 'bg-gray-300 text-gray-600' : 'bg-green-600 hover:bg-green-700 text-white'} font-semibold py-2 px-3 rounded-lg transition`}
                                >
                                    {addLoading ? 'Adding...' : 'Add Employee'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employee Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEmployees.map((employee) => (
                        <div key={employee.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                            {/* Card Header */}
                            <div className={`bg-gradient-to-r p-4 ${employee.newEmployeeFlag ? 'from-orange-500 to-orange-600' : 'from-blue-600 to-blue-700'}`}>
                                <h2 className="text-xl font-bold text-white">{employee.employeeName}</h2>
                                <p className={`text-sm ${employee.newEmployeeFlag ? 'text-orange-100' : 'text-blue-100'}`}>{employee.position}</p>
                                {employee.newEmployeeFlag && (
                                    <span className="inline-block mt-2 bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded">NEW HIRE</span>
                                )}

 <div className="flex gap-2 mt-3">
                                            <button
                                                onClick={() => handleEditStart(employee)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-4 rounded-lg transition"
                                            >
                                                Edit Details
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEmployee(employee.id)}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-4 rounded-lg transition"
                                            >
                                                Delete
                                            </button>
                                        </div>


                            </div>


                            {/* Card Content */}
                            <div className="p-6">
                                {editingId === employee.id ? (
                                    /* Edit Form */
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                                            <input
                                                type="text"
                                                name="employeeName"
                                                value={editFormData.employeeName || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                                            <input
                                                type="text"
                                                name="employeeUser"
                                                value={editFormData.employeeUser || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                                            <input
                                                type="text"
                                                name="employeePassword"
                                                value={editFormData.employeePassword || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Position</label>
                                            <input
                                                type="text"
                                                name="position"
                                                value={editFormData.position || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={editFormData.address || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Active Plant Project</label>
                                            <input
                                                type="text"
                                                name="currentAssignment"
                                                value={editFormData.currentAssignment || ''}
                                                onChange={handleEditChange}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                        <div className="flex gap-2 pt-2">
                                            <button
                                                onClick={() => handleSaveEmployee(employee.id)}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    /* View Mode */
                                    <>
                                        <div className="space-y-2 mb-4">
                                            <div>
                                                <p className="text-gray-600 text-xs">Employee ID</p>
                                                <p className="text-gray-800 font-semibold text-sm">#{employee.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-xs">Username</p>
                                                <p className="text-gray-800 font-semibold text-sm">{employee.employeeUser}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-xs">Password</p>
                                                <div className="">
                                                    <p className="text-gray-800 font-semibold text-sm">
                                                        {passwordVisibility[employee.id] ? (employee.employeePassword || '—') : '••••••'}
                                                    </p>
                                                    <button
                                                        onClick={() => togglePasswordVisibility(employee.id)}
                                                        className="text-blue-600 hover:text-blue-700 text-xs font-semibold"
                                                        type="button"
                                                    >
                                                        {passwordVisibility[employee.id] ? 'Hide' : 'Show'}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-xs">Address</p>
                                                <p className="text-gray-800 font-semibold text-sm">{employee.address}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 text-xs">Plant Project</p>
                                                <p className="text-gray-800 font-semibold text-sm">{employee.currentAssignment}</p>
                                            </div>
                                        </div>

                                        {/* Time Request Section */}
                                        <div className="border-t pt-4 mb-4">
                                            <p className="font-semibold text-gray-800 text-sm mb-2">🌞 Time Off</p>
                                            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
                                                <div>
                                                    <p className="text-gray-600 text-xs">Period</p>
                                                    <p className="text-gray-800 font-semibold">
                                                        {employee.timeRequest.startDate} to {employee.timeRequest.endDate}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 text-xs">Note</p>
                                                    <textarea
                                                        className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                                                        rows={2}
                                                        value={noteEdits[employee.id] !== undefined ? noteEdits[employee.id] : (employee.timeRequest.note || '')}
                                                        onChange={(e) => setNoteEdits(prev => ({ ...prev, [employee.id]: e.target.value }))}
                                                        placeholder="Add or update note"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-gray-600 text-xs">Status</p>
                                                    <p className={`font-semibold text-xs ${
                                                             employee.timeRequest.approved ? 'text-green-600' : (employee.timeRequest.reviewed ? 'text-red-600' : 'text-yellow-600')
                                                    }`}>
                                                             {employee.timeRequest.approved ? '✓ Approved' : (employee.timeRequest.reviewed ? '✗ Rejected' : '⏳ Pending')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => handleApproveTimeRequest(employee.id, true)}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition text-xs"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleApproveTimeRequest(employee.id, false)}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded-lg transition text-xs"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>

                                        {/* New Hire Approval Section */}
                                        {employee.newEmployeeFlag && (
                                            <div className="border-t pt-4 mt-4">
                                                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200 mb-3">
                                                    <p className="text-orange-800 font-semibold text-sm mb-1">🌱 Pending New Employee Approval</p>
                                                    <p className="text-orange-700 text-xs">Have employee login to their profile and update personal details, or review employee information here and approve to complete onboarding.</p>
                                                </div>
                                                <button
                                                    onClick={() => handleApproveNewHire(employee.id)}
                                                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm"
                                                >
                                                    ✓ Approve New Employee
                                                </button>
                                            </div>
                                        )}
                                       
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HRDashboard;


