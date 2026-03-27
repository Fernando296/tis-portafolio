import React, { useState } from 'react';
import axios from 'axios';

interface LoginProps {
    onLogin: (token: string, user: any) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', { email, password });
            const { token, user } = response.data;
            onLogin(token, user);
            setError('');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    //mis estilos reutilizables
    const labelStyle = {
        color: 'white',
        fontSize: '0.85rem',
        display: 'block',
        marginBottom: '0.2rem'
    };

    const errorSmallStyle = {
        color: '#FF0000', 
        fontSize: '0.75rem', 
        marginTop: '0.2rem',
        display: 'block'
    };

    const forgotPasswordStyle = {
        color: 'white',
        fontSize: '0.75rem',
        cursor: 'pointer',
        marginTop: '0.5rem',
        marginBottom: '1rem'
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem', backgroundColor: '#6865CD', borderRadius: '8px' }}>
            <h2 style={{ color: 'white' }}>Login</h2>
            
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={labelStyle}>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: 'none' }}
                    />
                    {/* Error debajo de Email */}
                    {error && <span style={errorSmallStyle}>{error}</span>}
                </div>
                
                <div style={{ marginBottom: '0.5rem' }}>
                    <label style={labelStyle}>Contraseña:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: 'none' }}
                    />
                    {error && <span style={errorSmallStyle}>{error}</span>}
                </div>

                <p style={forgotPasswordStyle}>
                    ¿olvidaste tu contraseña?
                </p>
                
                <button 
                    type="submit" 
                    style={{ 
                        width: '100%', 
                        padding: '0.7rem', 
                        background: '#59BEC0', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                >
                    Iniciar Sesión
                </button>
            </form>
        </div>
    );
}