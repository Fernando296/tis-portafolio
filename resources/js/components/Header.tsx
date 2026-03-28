import React, { useEffect, useRef, useState } from "react";
import "./Header.css";

type HeaderProps = {
  estaAutenticado?: boolean;
  nombreUsuario?: string;
};

export default function Header({
  estaAutenticado = false,
  nombreUsuario = "Usuario",
}: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const inicial = nombreUsuario.charAt(0).toUpperCase();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header__logo">Generador de portafolios</div>

      

      {!estaAutenticado ? (
        <div className="header__actions">
          <a href="/Registrarse" className="header__register">
            Registrarse
          </a>
        </div>
      ) : (
        <div className="header__user-menu" ref={menuRef}>
          <button
            className="header__user-button"
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            <span className="header__user-name">{nombreUsuario}</span>
            <div className="header__avatar">{inicial}</div>
          </button>

          <div
            className={`header__dropdown ${
              menuAbierto ? "header__dropdown--open" : ""
            }`}
          >
            <button
              className="header__dropdown-item"
              onClick={() => {
                setMenuAbierto(false);
                window.location.href = "/perfil";
              }}
            >
              Registra Informacion basica
            </button>

            <button
              className="header__dropdown-item header__dropdown-item--danger"
              onClick={() => {
                setMenuAbierto(false);
                window.location.href = "/";
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}