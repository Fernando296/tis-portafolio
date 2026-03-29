import React, { useState } from 'react';
import axios from 'axios';

interface RestaContraProps {
    onSuccess?: () => void;
}

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#555'}}>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color: '#555'}}>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
);

export default function RestaContra({ onSuccess }: RestaContraProps) {
    const [step, setStep] = useState<1 | 2>(1);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email) {
            setError('Por favor introduce tu correo electrónico');
            return;
        }
        try {
            await axios.post('/api/password/email', { email });
            // Avanzamos al paso 2
            setStep(2);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al procesar la solicitud');
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!code) {
            setError('Por favor introduce el código de verificación enviado a tu correo');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        
        try {
            await axios.post('/api/password/reset', { email, code, password, password_confirmation: confirmPassword });
            if (onSuccess) onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al cambiar la contraseña');
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
                        <p style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>Hemos enviado un código a tu correo.</p>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={labelStyle}>Código de Verificación</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="123456"
                                required
                                style={{ width: '100%', padding: '0.7rem', borderRadius: '5px', border: 'none', boxSizing: 'border-box', letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <label style={labelStyle}>Nueva contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="**********"
                                    required
                                    style={{ width: '100%', padding: '0.7rem', paddingRight: '2.5rem', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                >
                                    {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                                </button>
                            </div>
                        </div>
                        
                        <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
                            <label style={labelStyle}>Confirmar contraseña</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="**********"
                                    required
                                    style={{ width: '100%', padding: '0.7rem', paddingRight: '2.5rem', borderRadius: '5px', border: 'none', boxSizing: 'border-box' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                                >
                                    {showConfirmPassword ? <EyeIcon /> : <EyeOffIcon />}
                                </button>
                            </div>
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
