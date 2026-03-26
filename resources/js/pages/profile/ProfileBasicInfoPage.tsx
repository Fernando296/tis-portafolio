import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  type ProfileForm,
} from "../../services/profileServices";

type FormErrors = Partial<Record<keyof ProfileForm, string>>;

const EMPTY_FORM: ProfileForm = {
  nombre: "",
  apellido: "",
  profesion: "",
  biografia: "",
};

const NAME_REGEX = /^[\p{L}\s'-]+$/u;

function validateField(field: keyof ProfileForm, value: string): string {
  const trimmed = value.trim();

  switch (field) {
    case "nombre":
      if (!trimmed) return "El nombre es obligatorio";
      if (trimmed.length < 2) return "Debe tener al menos 2 caracteres";
      if (trimmed.length > 100) return "No puede superar 100 caracteres";
      if (!NAME_REGEX.test(trimmed)) {
        return "Solo puede contener letras, espacios, apóstrofes y guiones";
      }
      return "";

    case "apellido":
      if (!trimmed) return "El apellido es obligatorio";
      if (trimmed.length < 2) return "Debe tener al menos 2 caracteres";
      if (trimmed.length > 100) return "No puede superar 100 caracteres";
      if (!NAME_REGEX.test(trimmed)) {
        return "Solo puede contener letras, espacios, apóstrofes y guiones";
      }
      return "";

    case "profesion":
      if (!trimmed) return "La profesión es obligatoria";
      if (trimmed.length < 2) return "Debe tener al menos 2 caracteres";
      if (trimmed.length > 80) return "No puede superar 80 caracteres";
      return "";

    case "biografia":
      if (!trimmed) return "La biografía es obligatoria";
      if (trimmed.length < 10) return "Debe tener al menos 10 caracteres";
      if (trimmed.length > 500) return "No puede superar 500 caracteres";
      return "";

    default:
      return "";
  }
}

function validateForm(values: ProfileForm): FormErrors {
  return {
    nombre: validateField("nombre", values.nombre) || undefined,
    apellido: validateField("apellido", values.apellido) || undefined,
    profesion: validateField("profesion", values.profesion) || undefined,
    biografia: validateField("biografia", values.biografia) || undefined,
  };
}

function inputClass(hasError: boolean): string {
  return [
    "mt-2 w-full rounded-md border px-4 py-3 text-sm sm:text-[15px] text-slate-800",
    "bg-[#f3f3f3] outline-none transition",
    "min-h-[48px]",
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-200"
      : "border-transparent focus:border-cyan-300 focus:ring-2 focus:ring-cyan-200",
  ].join(" ");
}

export default function ProfileBasicInfoPage() {
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      try {
        setLoading(true);
        setServerError("");

        const profile = await getProfile();

        if (!mounted) return;

        setForm(profile);
      } catch (error) {
        if (!mounted) return;

        const message =
          typeof error === "object" &&
          error !== null &&
          "message" in error &&
          typeof error.message === "string"
            ? error.message
            : "No se pudo cargar la información del perfil.";

        setServerError(message);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  const handleChange =
    (field: keyof ProfileForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: validateField(field, value) || undefined,
      }));

      setSuccessMessage("");
      setServerError("");
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const payload: ProfileForm = {
      nombre: form.nombre.trim(),
      apellido: form.apellido.trim(),
      profesion: form.profesion.trim(),
      biografia: form.biografia.trim(),
    };

    const validationErrors = validateForm(payload);
    setErrors(validationErrors);
    setSuccessMessage("");
    setServerError("");

    const hasErrors = Object.values(validationErrors).some(Boolean);
    if (hasErrors) return;

    try {
      setSaving(true);

      const response = await updateProfile(payload);

      setForm(payload);
      setSuccessMessage(response.message || "Perfil guardado correctamente");
    } catch (error) {
      if (typeof error === "object" && error !== null) {
        const apiErrors =
          "errors" in error && typeof error.errors === "object" && error.errors
            ? (error.errors as Record<string, string[]>)
            : {};

        const backendErrors: FormErrors = {};

        if (apiErrors.nombre?.[0]) backendErrors.nombre = apiErrors.nombre[0];
        if (apiErrors.apellido?.[0]) backendErrors.apellido = apiErrors.apellido[0];
        if (apiErrors.profesion?.[0]) backendErrors.profesion = apiErrors.profesion[0];
        if (apiErrors.biografia?.[0]) backendErrors.biografia = apiErrors.biografia[0];

        setErrors((prev) => ({
          ...prev,
          ...backendErrors,
        }));

        if ("message" in error && typeof error.message === "string") {
          setServerError(error.message);
        } else {
          setServerError("No se pudo guardar el perfil.");
        }
      } else {
        setServerError("No se pudo guardar el perfil.");
      }
    } finally {
      setSaving(false);
    }
  };

if (loading) {
  return (
    <section className="min-h-screen bg-[#ededed] px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-xl bg-[#6763cc] px-4 py-5 text-sm text-white shadow-[0_4px_12px_rgba(0,0,0,0.22)] sm:px-6 sm:py-6 sm:text-base md:px-8 lg:px-10">
          Cargando perfil...
        </div>
      </div>
    </section>
  );
}

return (
  <section className="min-h-screen bg-[#ededed] px-3 py-6 sm:px-4 sm:py-8 md:px-6 md:py-10">
    <div className="mx-auto max-w-5xl">
      <div className="rounded-xl bg-[#6763cc] px-4 py-5 shadow-[0_4px_12px_rgba(0,0,0,0.22)] sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10">
        <h1 className="mb-5 text-center text-lg font-extrabold uppercase tracking-wide text-white sm:mb-6 sm:text-xl md:text-2xl">
          Información básica del perfil
        </h1>

        {successMessage && (
          <div className="mb-5 rounded-md bg-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        )}

        {serverError && (
          <div className="mb-5 rounded-md bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto grid max-w-4xl grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2"
        >
          <p className="text-sm font-medium text-white sm:text-[15px] md:col-span-2">
            Completa tu perfil para mostrar quién eres en tu portafolio.
          </p>

          <div className="w-full">
            <label htmlFor="nombre" className="text-sm font-medium text-white sm:text-[15px]">
              Nombre
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              value={form.nombre}
              onChange={handleChange("nombre")}
              className={inputClass(Boolean(errors.nombre))}
              placeholder="Ej. María Fernanda"
            />
            <p className="mt-1 min-h-[20px] text-xs text-red-100">{errors.nombre ?? " "}</p>
          </div>

          <div className="w-full">
            <label htmlFor="apellido" className="text-sm font-medium text-white sm:text-[15px]">
              Apellido
            </label>
            <input
              id="apellido"
              name="apellido"
              type="text"
              value={form.apellido}
              onChange={handleChange("apellido")}
              className={inputClass(Boolean(errors.apellido))}
              placeholder="Ej. Rodríguez López"
            />
            <p className="mt-1 min-h-[20px] text-xs text-red-100">{errors.apellido ?? " "}</p>
          </div>

          <div className="w-full md:col-span-2">
            <label htmlFor="profesion" className="text-sm font-medium text-white sm:text-[15px]">
              Profesión
            </label>
            <input
              id="profesion"
              name="profesion"
              type="text"
              value={form.profesion}
              onChange={handleChange("profesion")}
              className={inputClass(Boolean(errors.profesion))}
              placeholder="Ej. Ingeniera de Software"
            />
            <p className="mt-1 min-h-[20px] text-xs text-red-100">{errors.profesion ?? " "}</p>
          </div>

          <div className="w-full md:col-span-2">
            <label htmlFor="biografia" className="text-sm font-medium text-white sm:text-[15px]">
              Biografía
            </label>
            <textarea
              id="biografia"
              name="biografia"
              rows={5}
              value={form.biografia}
              onChange={handleChange("biografia")}
              className={`${inputClass(Boolean(errors.biografia))} min-h-[140px] resize-y`}
              placeholder="Cuéntanos brevemente quién eres, tu experiencia y tus intereses."
            />
            <p className="mt-1 min-h-[20px] text-xs text-red-100">{errors.biografia ?? " "}</p>
          </div>

          <div className="flex w-full md:col-span-2 md:justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-md bg-[#59d0d5] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:text-base"
            >
              {saving ? "Guardando..." : "Guardar perfil"}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
);
}