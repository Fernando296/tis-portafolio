import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="app-footer__text">
        &copy; {new Date().getFullYear()} Generador de portafolios. Todos los
        derechos reservados.
      </div>

      <div className="app-footer__subtext">
        Construido con React y Laravel Vite
      </div>
    </footer>
  );
}