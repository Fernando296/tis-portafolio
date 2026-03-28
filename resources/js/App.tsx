import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import RestaContra from './components/RestaContra';
import Layout from './components/Layout';

type User = {
    id: number;
    name: string;
    email: string;
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showRestaContra, setShowRestaContra] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogin = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        setIsLoggedIn(false);
    };

    return (
        <Layout>
            {isLoggedIn ? (
                <div>
                    <h1>Bienvenido, {user?.name} Lolita!</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : showRestaContra ? (
                <div>
                    <button 
                        onClick={() => setShowRestaContra(false)}
                        style={{ marginBottom: '1rem', padding: '0.5rem', cursor: 'pointer', background: '#e0e0e0', border: 'none', borderRadius: '4px' }}
                    >
                        ← Volver al Login
                    </button>
                    <RestaContra onSuccess={() => setShowRestaContra(false)} />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Login onLogin={handleLogin} />
                    <button 
                        onClick={() => setShowRestaContra(true)}
                        style={{ 
                            marginTop: '1.5rem', 
                            padding: '0.5rem 1rem', 
                            cursor: 'pointer', 
                            background: '#59BEC0', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            fontWeight: 'bold'
                        }}
                    >
                        Probar Vista "Recuperar Contraseña"
                    </button>
                </div>
            )}
        </Layout>
    );
}