import React, { useState, useEffect } from 'react';

const HomePage = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:3001/employees');
                const data = await response.json();
                
                // Filter for the LeafCorp gardeners (IDs 7-12)
                const gardeners = data.filter(emp => 
                    ['7', '8', '9', '10', '11', '12'].includes(emp.id)
                );
                
                // Map to the format needed for the home page
                const formattedEmployees = gardeners.map(emp => ({
                    id: emp.id,
                    name: emp.employeeName,
                    position: emp.position,
                    bio: emp.bio,
                    image: emp.image
                }));
                
                setEmployees(formattedEmployees);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">🌿 LeafCorp Services </h1>
                    <p className="text-2xl mb-6">Professional Plant Sitting While You're Away</p>
                    <p className="text-lg opacity-90">Your plants deserve the best. We provide expert care, watering, pruning, and maintenance.</p>
                </div>
            </div>

            {/* Team Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">🌞 Meet Our Plant Sitting Especialists</h2>
                    <p className="text-gray-600 text-lg">Dedicated professionals who love plants as much as you do</p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Loading our expert team...</p>
                    </div>
                ) : employees.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Our team information will be available soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {employees.map((employee) => (
                            <div key={employee.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 border-t-4 border-green-500">
                                <div className="text-center mb-4">
                                    <img 
                                        src={employee.image} 
                                        alt={employee.name} 
                                        className="w-24 h-24 rounded-full object-cover mx-auto mb-3"
                                    />
                                    <h3 className="text-xl font-bold text-gray-800">{employee.name}</h3>
                                    <p className="text-green-600 font-semibold text-sm mt-1">{employee.position}</p>
                                </div>
                                <p className="text-gray-600 text-sm text-center">{employee.bio}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Services Section */}
            <div className="bg-forest-50 py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Services</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-3">💧</div>
                            <h3 className="font-bold text-lg mb-2">Hydration Management</h3>
                            <p className="text-gray-600 text-sm">Customized watering schedules for every plant type</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-3">✂️</div>
                            <h3 className="font-bold text-lg mb-2">Pruning & Trimming</h3>
                            <p className="text-gray-600 text-sm">Professional grooming to keep plants healthy and beautiful</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-md text-center">
                            <div className="text-4xl mb-3">🐛</div>
                            <h3 className="font-bold text-lg mb-2">Pest Control</h3>
                            <p className="text-gray-600 text-sm">Organic solutions to protect your precious plants</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
                        <div className="text-gray-600">Plants Cared For</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
                        <div className="text-gray-600">Happy Clients</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">15</div>
                        <div className="text-gray-600">Years Experience</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold text-green-600 mb-2">99%</div>
                        <div className="text-gray-600">Plant Survival Rate</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-forest-800 text-white py-8 px-6 text-center">
                <p className="mb-2">🌿 LeafCorp Services - Where Every Leaf Matters 🌿</p>
                <p className="text-sm opacity-80">Contact us: info@leafcorpservices.com | (555) LEAF-CARE</p>
            </div>
        </div>
    );
}

export default HomePage;