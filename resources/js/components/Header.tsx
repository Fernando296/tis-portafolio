import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="fb-header">
      <div className="fb-header__container">
        <div className="fb-header__logo">Generador de portafolios</div>

        <div className="fb-header__actions">

          <button className="fb-header__button">Iniciar sesión</button>

          <button className="fb-header__button">Crear cuenta</button>

        </div>
      </div>
    </header>
  );
}