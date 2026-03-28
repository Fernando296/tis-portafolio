import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import logo from "../assets/Registro/logo_Codegos.png";
type User = {
  id_usuario?: number;
  nombre?: string;
  apellido?: string | null;
  email?: string;
  slug?: string;
  rol?: string;
};

type HeaderProps = {
  estaAutenticado?: boolean;
  nombreUsuario?: string;
};

export default function Header({
  estaAutenticado,
  nombreUsuario,
}: HeaderProps) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [autenticadoLocal, setAutenticadoLocal] = useState(false);
  const [usuarioLocal, setUsuarioLocal] = useState<User | null>(null);
  const [tokenActual, setTokenActual] = useState<string | null>(
    localStorage.getItem("token")
  );

  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      setTokenActual((prev) => (prev !== token ? token : prev));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!tokenActual) {
      setAutenticadoLocal(false);
      setUsuarioLocal(null);
      return;
    }

    fetch("/api/user", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${tokenActual}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "include",
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("No autenticado");
        }

        const data = await response.json();
        setUsuarioLocal(data);
        setAutenticadoLocal(true);
      })
      .catch(() => {
        setAutenticadoLocal(false);
        setUsuarioLocal(null);
      });
  }, [tokenActual]);

  const autenticadoFinal =
    typeof estaAutenticado === "boolean" ? estaAutenticado : autenticadoLocal;

  const nombreFinal =
    nombreUsuario ||
    usuarioLocal?.nombre ||
    usuarioLocal?.email ||
    "Usuario";

  const inicial = nombreFinal.charAt(0).toUpperCase();

  const handleLogout = async () => {
    setMenuAbierto(false);

    try {
      await fetch("/api/logout", {
        method: "POST",
        headers: {
          Accept: "application/json",
          ...(tokenActual ? { Authorization: `Bearer ${tokenActual}` } : {}),
          "X-Requested-With": "XMLHttpRequest",
        },
        credentials: "include",
      });
    } catch (error) {
    } finally {
      localStorage.removeItem("token");
      setTokenActual(null);
      setAutenticadoLocal(false);
      setUsuarioLocal(null);
      window.location.href = "/";
    }
  };

  return (
    <header className="header">
      <div className="header__logo">
        <img src={logo} alt="logo" className="header__logo-img" />
        <span>Generador de portafolios</span>
      </div>
      {!autenticadoFinal ? (
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
            <span className="header__user-name">{nombreFinal}</span>
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
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}