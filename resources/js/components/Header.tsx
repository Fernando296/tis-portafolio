import React from 'react';

export default function Header() {
    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 2rem', backgroundColor: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
                IngSoftware
            </div>
            <nav>
                <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: '#555' }}>Inicio</a>
                <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: '#555' }}>Portafolio</a>
                <a href="#" style={{ margin: '0 15px', textDecoration: 'none', color: '#555' }}>Acerca de</a>
            </nav>
            <div>
                <a href="#" style={{ padding: '0.5rem 1rem', backgroundColor: '#0d6efd', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Contacto</a>
            </div>
        </header>
    );
}
