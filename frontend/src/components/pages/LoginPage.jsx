import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [mockMode, setMockMode] = useState(false);
    const [testUsers, setTestUsers] = useState([]);
    const [showTestUsers, setShowTestUsers] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Load test users on component mount
    useEffect(() => {
        const loadTestUsers = async () => {
            try {
                const response = await fetch('/api/mock/test-users');
                if (response.ok) {
                    const data = await response.json();
                    setTestUsers(data.test_users);
                }
            } catch (error) {
                // Ignore error if mock endpoints aren't available
            }
        };
        loadTestUsers();
    }, []);

    const tryMockLogin = async (formData, isAdminLogin) => {
    // Use new mock login endpoint for all demo logins
    const mockEndpoint = '/api/auth/mock-login';
        
        try {
            const response = await fetch(mockEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMockMode(true);
                onLogin(data.user);
                if (isAdminLogin || data.user.is_admin) {
                    window.location.href = '/admin/dashboard';
                } else {
                    navigate('/invitation');
                }
                return true;
            }
            return false;
        } catch (error) {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMockMode(false);

        // Always use mock login for development
        const isAdminLogin = window.location.pathname.includes('/admin');
        const mockSuccess = await tryMockLogin(formData, isAdminLogin);
        if (!mockSuccess) {
            setError('Mock login failed. Please try again or use demo login below.');
            setShowTestUsers(true);
        }
        setLoading(false);
    };

    const quickLogin = (user) => {
        setFormData({
            email: user.email,
            password: user.password
        });
        setShowTestUsers(false);
    };

    return (
        <div className="main-content" style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <div className="login-card" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2.5rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                maxWidth: '400px',
                width: '100%'
            }}>
                <h2 className="text-center mb-4">Log In</h2>
                
                {mockMode && (
                    <div className="alert alert-info" role="alert">
                        <i className="fas fa-info-circle me-2"></i>
                        Demo Mode: Using mock authentication for testing
                    </div>
                )}
                
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}

                {showTestUsers && testUsers.length > 0 && (
                    <div className="alert alert-secondary" role="alert">
                        <h6><i className="fas fa-users me-2"></i>Quick Demo Login:</h6>
                        {testUsers.slice(0, 3).map((user, index) => (
                            <button
                                key={index}
                                className="btn btn-sm btn-outline-secondary me-2 mb-1"
                                onClick={() => quickLogin(user)}
                                title={`${user.subscription_tier} ${user.is_admin ? 'admin' : 'user'}`}
                            >
                                {user.full_name} ({user.subscription_tier})
                                {user.is_admin && <i className="fas fa-shield ms-1"></i>}
                            </button>
                        ))}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address*</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            name="email" 
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="jane.doe@gmail.com" 
                            required 
                            style={{padding: '12px'}}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="password" className="form-label">Password*</label>
                        <input 
                            type="password" 
                            className="form-control" 
                            id="password" 
                            name="password" 
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password" 
                            required 
                            style={{padding: '12px'}}
                        />
                    </div>
                    
                    <div className="d-grid mb-4">
                        <button 
                            type="submit" 
                            className="btn btn-primary-custom"
                            disabled={loading}
                            style={{
                                backgroundColor: '#20c997',
                                borderColor: '#20c997',
                                color: 'white',
                                fontWeight: '500',
                                padding: '12px'
                            }}
                        >
                            {loading ? 'Signing in...' : 'Continue'}
                        </button>
                    </div>
                </form>
                
                <div className="text-center">
                    <div className="d-grid gap-1 mb-3">
                        <a href="/auth/google" className="social-btn" style={{
                            border: '1px solid #e0e6ed',
                            background: 'white',
                            color: '#495057',
                            padding: '12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.5rem',
                            transition: 'all 0.2s'
                        }}>
                            <i className="fab fa-google me-2" style={{color: '#db4437'}}></i>Continue with Google
                        </a>
                        <a href="/auth/microsoft" className="social-btn" style={{
                            border: '1px solid #e0e6ed',
                            background: 'white',
                            color: '#495057',
                            padding: '12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.5rem',
                            transition: 'all 0.2s'
                        }}>
                            <i className="fab fa-microsoft me-2" style={{color: '#0078d4'}}></i>Continue with Microsoft
                        </a>
                        <a href="/auth/apple" className="social-btn" style={{
                            border: '1px solid #e0e6ed',
                            background: 'white',
                            color: '#495057',
                            padding: '12px',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '0.5rem',
                            transition: 'all 0.2s'
                        }}>
                            <i className="fab fa-apple me-2" style={{color: '#000000'}}></i>Continue with Apple
                        </a>
                    </div>
                    
                    <p className="small text-muted">
                        Don't have account? <Link to="/signup" className="text-primary text-decoration-none">Sign Up</Link>
                    </p>
                    <p className="small text-muted mt-2">
                        <Link to="/admin/login" className="text-muted">
                            <i className="fas fa-user-shield me-1"></i>Admin Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;