import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Layout from './components/Layout';

type User = {
    id: number;
    name: string;
    email: string;
};

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);

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
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </Layout>
    );
}