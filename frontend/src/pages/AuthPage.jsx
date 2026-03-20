import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast, { Toaster } from 'react-hot-toast';
import { FaUser, FaLock, FaArrowLeft } from 'react-icons/fa';
import '../App.css';
import './AuthPage.css';

function AuthPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Parse query param to set initial mode (e.g. ?mode=register)
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        if (queryParams.get('mode') === 'register') {
            setIsLogin(false);
        }
    }, [location]);

    const handleToggle = () => {
        setIsLogin(!isLogin);
        setUsername('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        setIsLoading(true);

        try {
            await api.post(endpoint, { username, password });

            if (isLogin) {
                toast.success('Welcome back! 👋');
                navigate('/dashboard');
            } else {
                toast.success('Account created! Logging you in...');
                await api.post('/auth/login', { username, password });
                navigate('/dashboard');
            }
        } catch (error) {
            console.error(error);
            const msg = error.response?.data || 'Something went wrong';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page-wrapper">
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: '#171717',
                    color: '#fff',
                    borderRadius: '0px',
                    border: '2px solid #27272a',
                    boxShadow: '4px 4px 0 #27272a'
                }
            }} />

            <button className="back-btn" onClick={() => navigate('/')}>
                <FaArrowLeft /> Back to Home
            </button>

            <div className="auth-split-container">
                {/* LEFT SIDE: TOGGLE OPTION */}
                <div className="auth-left">
                    <div className={`toggle-content ${isLogin ? 'active' : 'inactive'}`}>
                        <h2>New to Notesmg AI?</h2>
                        <p>Sign up now to organize your thoughts with enterprise-grade security and AI search.</p>
                        <button className="btn btn-outline toggle-btn" onClick={handleToggle}>
                            CREATE ACCOUNT
                        </button>
                    </div>

                    <div className={`toggle-content ${!isLogin ? 'active' : 'inactive'}`}>
                        <h2>Already have an account?</h2>
                        <p>Welcome back! Sign in to access your secure dashboard and continue writing.</p>
                        <button className="btn btn-outline toggle-btn" onClick={handleToggle}>
                            SIGN IN INSTEAD
                        </button>
                    </div>
                </div>

                {/* RIGHT SIDE: FORM */}
                <div className="auth-right">
                    <div className="form-wrapper">
                        <h2 className="form-title">
                            {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                        </h2>
                        <form onSubmit={handleSubmit} className="auth-form">
                            <div className="input-group">
                                <FaUser className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="USERNAME"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    className="form-input"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="input-group">
                                <FaLock className="input-icon" />
                                <input
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary submit-btn" disabled={isLoading}>
                                {isLoading ? 'PROCESSING...' : (isLogin ? 'LOGIN' : 'SIGN UP')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthPage;
