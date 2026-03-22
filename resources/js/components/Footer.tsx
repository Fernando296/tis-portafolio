import React from 'react';

export default function Footer() {
    return (
        <footer style={{ textAlign: 'center', padding: '1.5rem', backgroundColor: '#212529', color: '#f8f9fa', marginTop: 'auto' }}>
            <div style={{ marginBottom: '0.5rem' }}>
                &copy; {new Date().getFullYear()} Ingeniería de Software. Todos los derechos reservados.
            </div>
            <div style={{ fontSize: '0.875rem', color: '#adb5bd' }}>
                Construido con React y Laravel Vite
            </div>
        </footer>
    );
}
