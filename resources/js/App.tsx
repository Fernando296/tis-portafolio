import { useState, useEffect } from 'react';
import axios from './lib/axios';
import Login from './components/Login';
import RestaContra from './components/RestaContra';
import Layout from './components/Layout';

type User = {
    id_usuario: number;
    nombre: string;
    apellido?: string | null;
    email: string;
    slug?: string;
    rol?: string;
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showRestaContra, setShowRestaContra] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem('token');

        if (!token) return;

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        axios.get('/api/user')
            .then((response) => {
                setUser(response.data);
                setIsLoggedIn(true);
            })
            .catch(() => {
                localStorage.removeItem('token');
                delete axios.defaults.headers.common['Authorization'];
                setUser(null);
                setIsLoggedIn(false);
            });
    }, []);

    const handleLogin = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);
        setIsLoggedIn(true);
    };

    const handleLogout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
        } finally {
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            setIsLoggedIn(false);
        }
    };
    return (
        <Layout>
            {isLoggedIn ? (
                <div>
                    <h1>Bienvenido, {user?.nombre}!</h1>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {showRestaContra ? (
                        <RestaContra onSuccess={() => setShowRestaContra(false)} onCancel={() => setShowRestaContra(false)} />
                    ) : (
                        <Login onLogin={handleLogin} onForgotPassword={() => setShowRestaContra(true)} />
                    )}
                </div>
            )}
        </Layout>
    );
}
