import React, { useState } from 'react';
import axios from 'axios';

interface RestaContraProps {
    onSuccess?: () => void;
}

export default function RestaContra({ onSuccess }: RestaContraProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) {
            setError('Por favor introduce tu correo electrónico');
            return;
        }
        try {
            // Ejemplo de llamada a la API
            await axios.post('/api/password/email', { email });
            // Avanzamos al paso 2
            setStep(2);
        } catch (err) {
            // En caso de que falle la petición
            // Descomentar para manejo real: setError('Error al procesar la solicitud');
            // Para el propósito de prueba y mostrar la vista 2 en el diseño:
            setStep(2);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        try {
            await axios.post('/api/password/reset', { email, password, password_confirmation: confirmPassword });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError('Error al cambiar la contraseña');
        }
    };

    // Estilos reutilizables (basados en Login.tsx)
    const labelStyle = {
        color: 'white',
        fontSize: '0.9rem',
        display: 'block',
        marginBottom: '0.4rem'
    };

    const errorSmallStyle = {
        color: '#FF0000', 
        fontSize: '0.75rem', 
        marginTop: '0.2rem',
        display: 'block'
    };

    const buttonStyle = {
        width: '100%', 
        padding: '0.7rem', 
        background: '#59BEC0', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        fontWeight: 'bold',
        cursor: 'pointer',
        marginTop: '1.5rem',
        fontSize: '1rem'
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2.5rem', backgroundColor: '#6865CD', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            {step === 1 ? (
                <>
                    <h2 style={{ color: 'white', textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem', textTransform: 'uppercase' }}>
                        Recupera tu cuenta
                    </h2>
                    
                    <form onSubmit={handleEmailSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{...labelStyle, marginBottom: '0.8rem'}}>Introduce tu correo electronico</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.com"
                                required
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }}
                            />
                            {error && <span style={errorSmallStyle}>{error}</span>}
                        </div>
                        
                        <button type="submit" style={buttonStyle}>
                            Continuar
                        </button>
                    </form>
                </>
            ) : (
                <>
                    <h2 style={{ color: 'white', textAlign: 'center', fontSize: '1.1rem', marginBottom: '2rem', textTransform: 'uppercase' }}>
                        Restablecer Contraseña
                    </h2>
                    
                    <form onSubmit={handlePasswordSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Nueva contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="**********"
                                required
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Confirmar contraseña</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="**********"
                                required
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }}
                            />
                            {error && <span style={errorSmallStyle}>{error}</span>}
                        </div>
                        
                        <button type="submit" style={{...buttonStyle, marginTop: '1rem', width: 'auto', float: 'right', padding: '0.7rem 1.2rem'}}>
                            Confirmar cambio
                        </button>
                        <div style={{ clear: 'both' }}></div>
                    </form>
                </>
            )}
        </div>
    );
}
