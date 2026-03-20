import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axiosConfig';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', { username, password });
            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            // Backend might return "Username already exists"
            setError(err.response?.data || 'Registration failed');
        }
    };

    return (
        <div style={styles.container}>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleRegister} style={styles.form}>
                <input
                    type="text"
                    placeholder="Choose a Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Choose a Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                <button type="submit" style={styles.button}>Register</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    );
}

const styles = {
    container: { maxWidth: '300px', margin: '50px auto', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: '10px' },
    input: { padding: '10px', fontSize: '16px' },
    button: { padding: '10px', fontSize: '16px', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }
};

export default Register;