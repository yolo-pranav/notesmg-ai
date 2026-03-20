import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { FaTimes, FaArrowRight } from 'react-icons/fa';

function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
    const [isLogin, setIsLogin] = useState(initialMode === 'login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLogin(initialMode === 'login');
        setUsername('');
        setPassword('');
    }, [initialMode, isOpen]);

    if (!isOpen) return null;

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
            onClose();
        } catch (error) {
            console.error(error);
            const msg = error.response?.data || 'Something went wrong';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.95)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 9999
        }} onClick={onClose}>
            
            <div style={{
                width: '100%', maxWidth: '600px', padding: '3rem', position: 'relative',
                background: 'transparent', border: 'none', boxShadow: 'none'
            }} onClick={e => e.stopPropagation()}>
                
                <button onClick={onClose} style={{
                    position: 'absolute', top: '1rem', right: '1rem',
                    background: 'none', border: 'none', color: '#fff',
                    fontSize: '2.5rem', cursor: 'pointer', transition: 'transform 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }} onMouseOver={e => e.currentTarget.style.transform = 'rotate(90deg)'} onMouseOut={e => e.currentTarget.style.transform = 'rotate(0deg)'}>
                    <FaTimes />
                </button>

                <h2 style={{
                    fontSize: '3.5rem', fontWeight: 300, color: '#fff',
                    marginBottom: '4rem', letterSpacing: '-2px', lineHeight: 1.1
                }}>
                    {isLogin ? 'Welcome back.' : 'Start creating.'}
                </h2>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="USERNAME"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            style={{
                                width: '100%', background: 'transparent', border: 'none',
                                borderBottom: '2px solid #333', fontSize: '1.5rem',
                                color: '#fff', padding: '1rem 0', outline: 'none', transition: 'border-color 0.3s'
                            }}
                            onFocus={e => e.target.style.borderBottom = '2px solid #22d3ee'}
                            onBlur={e => e.target.style.borderBottom = '2px solid #333'}
                            required
                            autoFocus
                        />
                    </div>
                    
                    <div style={{ position: 'relative' }}>
                        <input
                            type="password"
                            placeholder="PASSWORD"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            style={{
                                width: '100%', background: 'transparent', border: 'none',
                                borderBottom: '2px solid #333', fontSize: '1.5rem',
                                color: '#fff', padding: '1rem 0', outline: 'none', transition: 'border-color 0.3s'
                            }}
                            onFocus={e => e.target.style.borderBottom = '2px solid #22d3ee'}
                            onBlur={e => e.target.style.borderBottom = '2px solid #333'}
                            required
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '3rem' }}>
                        <button type="button" onClick={() => setIsLogin(!isLogin)} style={{
                            background: 'none', border: 'none', color: '#a1a1aa', fontSize: '1.1rem',
                            cursor: 'pointer', textDecoration: 'underline', padding: 0
                        }}>
                            {isLogin ? 'Need an account?' : 'Already registered?'}
                        </button>

                        <button type="submit" disabled={isLoading} style={{
                            background: '#fff', color: '#000', border: 'none', borderRadius: '50px',
                            padding: '1rem 2.5rem', fontSize: '1.2rem', fontWeight: 800, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '12px', transition: 'transform 0.2s'
                        }} onMouseOver={e => !isLoading && (e.currentTarget.style.transform = 'translateY(-4px)')} 
                           onMouseOut={e => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}>
                            {isLoading ? 'WAIT...' : (isLogin ? 'ENTER' : 'JOIN')} <FaArrowRight />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AuthModal;