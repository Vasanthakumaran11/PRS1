import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Navbar = () => {
    const { customer, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-blue-600">PRS</Link>
            {customer && (
                <div className="flex items-center gap-4">
                    <span className="text-gray-700 font-medium">Welcome, {customer.name}</span>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition"
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
