import React, { useState } from 'react';
import { registerUser } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            await registerUser({ name, email, password });
            setSuccess('Registration successful. Redirecting to login...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Create Account</h2>
                
                {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                {success && <p className="text-green-500 text-sm mb-4 text-center font-medium">{success}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Name</label>
                        <input 
                            required 
                            minLength={2}
                            type="text" 
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Email</label>
                        <input 
                            required 
                            type="email" 
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Password</label>
                        <input 
                            required 
                            minLength={6}
                            type="password" 
                            className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        disabled={loading}
                        type="submit" 
                        className="w-full bg-blue-600 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Register'}
                    </button>
                </form>
                
                <p className="mt-4 text-center text-gray-600">
                    Already have an account? <Link to="/" className="text-blue-600 font-semibold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
