import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import "../../../css/app.css";

import RegistroResultadoCard from "../../components/Mensajes/RegistroResultadoCard";

import {
  RegistroFormData,
  RegistroErrors,
  initialRegistroFormData,
  initialRegistroErrors,
  validateNombre,
  validateCorreo,
  validatePassword,
  validateConfirmarPassword,
  validateRegistroForm,
  hasErrors,
  isRegistroFormComplete,
  registrarUsuario,
  LaravelValidationError,
  mapLaravelErrorsToRegistroErrors,
  isCorreoDuplicadoError,
  getRegistroErrorMessage,
} from "../../services/registroService";

function RegistroCuentaPage() {
  const [formData, setFormData] =
    useState<RegistroFormData>(initialRegistroFormData);
  const [errors, setErrors] = useState<RegistroErrors>(initialRegistroErrors);
  const [touched, setTouched] = useState<Record<string, boolean>>({
    nombre: false,
    correo: false,
    password: false,
    confirmarPassword: false,
  });
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<null | {
    tipo: "success" | "error";
    mensaje: string;
  }>(null);
  const [redirectAfterSuccess, setRedirectAfterSuccess] = useState("/");

  useEffect(() => {
    if (!resultado) return;

    const timer = setTimeout(() => {
      if (resultado.tipo === "success") {
        window.location.href = redirectAfterSuccess || "/";
      } else {
        setResultado(null);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [resultado, redirectAfterSuccess]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(updatedFormData);

    if (touched[name]) {
      if (name === "nombre") {
        setErrors((prev) => ({
          ...prev,
          nombre: validateNombre(value),
        }));
      }

      if (name === "correo") {
        setErrors((prev) => ({
          ...prev,
          correo: validateCorreo(value),
        }));
      }

      if (name === "password") {
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(value),
          confirmarPassword: touched.confirmarPassword
            ? validateConfirmarPassword(value, updatedFormData.confirmarPassword)
            : prev.confirmarPassword,
        }));
      }

      if (name === "confirmarPassword") {
        setErrors((prev) => ({
          ...prev,
          confirmarPassword: validateConfirmarPassword(
            updatedFormData.password,
            value
          ),
        }));
      }
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    if (name === "nombre") {
      setErrors((prev) => ({
        ...prev,
        nombre: validateNombre(value),
      }));
    }

    if (name === "correo") {
      setErrors((prev) => ({
        ...prev,
        correo: validateCorreo(value),
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmarPassword: touched.confirmarPassword
          ? validateConfirmarPassword(value, formData.confirmarPassword)
          : prev.confirmarPassword,
      }));
    }

    if (name === "confirmarPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmarPassword: validateConfirmarPassword(formData.password, value),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateRegistroForm(formData);

    setErrors(validationErrors);
    setTouched({
      nombre: true,
      correo: true,
      password: true,
      confirmarPassword: true,
    });

    if (hasErrors(validationErrors)) {
      return;
    }

    try {
      setLoading(true);

      const result = await registrarUsuario(formData);

      setRedirectAfterSuccess(result.redirect || "/");
      setResultado({
        tipo: "success",
        mensaje: result.message || "Cuenta registrada.",
      });

      setFormData(initialRegistroFormData);
      setErrors(initialRegistroErrors);
      setTouched({
        nombre: false,
        correo: false,
        password: false,
        confirmarPassword: false,
      });
    } catch (error) {
      const backendError = error as LaravelValidationError;

      if (isCorreoDuplicadoError(backendError)) {
        setResultado({
          tipo: "error",
          mensaje: getRegistroErrorMessage(backendError),
        });
        return;
      }

      const backendMappedErrors = mapLaravelErrorsToRegistroErrors(backendError);

      setErrors({
        ...backendMappedErrors,
        password:
          backendMappedErrors.password === "Las contraseñas no coinciden"
            ? ""
            : backendMappedErrors.password,
        confirmarPassword:
          backendMappedErrors.confirmarPassword ||
          (backendMappedErrors.password === "Las contraseñas no coinciden"
            ? backendMappedErrors.password
            : ""),
      });

      setTouched({
        nombre: true,
        correo: true,
        password: true,
        confirmarPassword: true,
      });

      if (!backendError.errors) {
        setResultado({
          tipo: "error",
          mensaje: getRegistroErrorMessage(backendError),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const isButtonDisabled = useMemo(() => {
    const formComplete = isRegistroFormComplete(formData);
    const validationErrors = validateRegistroForm(formData);

    return loading || !formComplete || hasErrors(validationErrors);
  }, [formData, loading]);

  const inputBaseClass =
    "h-10 w-full rounded-md px-3 text-sm text-slate-700 outline-none placeholder:text-[#9a9a9a] transition";

  const getInputClass = (field: keyof RegistroErrors) => {
    const hasFieldError = touched[field] && errors[field];

    return hasFieldError
      ? `${inputBaseClass} border border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200`
      : `${inputBaseClass} border border-transparent bg-[#f3f3f3] focus:ring-2 focus:ring-cyan-200`;
  };

  return (
    <section className="min-h-screen bg-white px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center justify-center">
        <div className="relative w-full max-w-[420px] rounded-[20px] bg-[#6763cc] px-7 py-8 shadow-[0_6px_18px_rgba(0,0,0,0.18)] sm:px-8 sm:py-9">
          {resultado && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[20px] bg-white/20 backdrop-blur-[1px]">
              <RegistroResultadoCard
                tipo={resultado.tipo}
                mensaje={resultado.mensaje}
                onVolver={() => setResultado(null)}
              />
            </div>
          )}

          <h1 className="mb-6 text-center text-base font-extrabold uppercase tracking-wide text-white sm:text-lg">
            Registro
          </h1>

          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-[320px] flex-col gap-3 sm:max-w-[340px]"
          >
            <div>
              <input
                id="nombre"
                name="nombre"
                type="text"
                placeholder="Nombre(s) completo"
                value={formData.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("nombre")}
              />
              {touched.nombre && errors.nombre && (
                <p className="mt-1 pl-1 text-[11px] leading-[1.2] text-[#ffd6d6]">
                  {errors.nombre}
                </p>
              )}
            </div>

            <div>
              <input
                id="correo"
                name="correo"
                type="email"
                placeholder="Correo electrónico"
                value={formData.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("correo")}
              />
              {touched.correo && errors.correo && (
                <p className="mt-1 pl-1 text-[11px] leading-[1.2] text-[#ffd6d6]">
                  {errors.correo}
                </p>
              )}
            </div>

            <div>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("password")}
              />
              {touched.password && errors.password && (
                <p className="mt-1 pl-1 text-[11px] leading-[1.2] text-[#ffd6d6]">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <input
                id="confirmarPassword"
                name="confirmarPassword"
                type="password"
                placeholder="Confirmar contraseña"
                value={formData.confirmarPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputClass("confirmarPassword")}
              />
              {touched.confirmarPassword && errors.confirmarPassword && (
                <p className="mt-1 pl-1 text-[11px] leading-[1.2] text-[#ffd6d6]">
                  {errors.confirmarPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`mt-3 h-10 w-full rounded-md text-sm font-extrabold uppercase tracking-wide transition ${
                isButtonDisabled
                  ? "cursor-not-allowed bg-[#bfc2f3] text-white/80"
                  : "bg-[#61d4d6] text-white hover:brightness-105"
              }`}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] text-[#1f1f1f] sm:text-sm">
            ¿Ya tienes cuenta?{" "}
            <a
              href="/login"
              className="font-medium text-[#8adcf0] transition hover:underline"
            >
              Iniciar sesión
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

const root = document.getElementById("app");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <RegistroCuentaPage />
    </React.StrictMode>
  );
}

export default RegistroCuentaPage;