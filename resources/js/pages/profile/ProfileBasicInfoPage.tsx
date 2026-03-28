import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { getProfile, updateProfile, type ProfileForm } from "../../services/profileServices";

type FormErrors = Partial<Record<keyof ProfileForm, string>>;

const EMPTY_FORM: ProfileForm = {
  nombre: "",
  apellido: "",
  profesion: "",
  biografia: "",
};

function validateField(field: keyof ProfileForm, value: string): string {
  const v = value.trim();
  if (!v) return "Campo obligatorio";
  if (field === "biografia" && v.length < 10) return "Mínimo 10 caracteres";
  if (v.length < 2) return "Muy corto";
  return "";
}

function inputClass(hasError: boolean): string {
  return [
    "mt-2 w-full rounded-md px-4 py-3 text-sm text-slate-800 bg-[#f3f3f3] outline-none transition",
    hasError
      ? "border border-red-400 focus:ring-2 focus:ring-red-200"
      : "border border-transparent focus:ring-2 focus:ring-cyan-200",
  ].join(" ");
}

export default function ProfileBasicInfoPage() {
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then(setForm)
      .catch(() => setServerError("No se pudo cargar el perfil"));
  }, []);

  const handleChange =
    (field: keyof ProfileForm) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((p) => ({ ...p, [field]: value }));
      setErrors((p) => ({ ...p, [field]: validateField(field, value) || undefined }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateProfile(form);
      setShowSuccessModal(true);
    } catch {
      setServerError("Error al guardar perfil");
    } finally {
      setSaving(false);
    }
  };

  //  MODAL DE ÉXITO CON REDIRECCIÓN AUTOMÁTICA
  const SuccessModal = () => {
    if (!showSuccessModal) return null;

    const handleRedirect = () => {
      window.location.href = "/";
    };

    return (
      <div
        onClick={handleRedirect}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 cursor-pointer"
      >
        <div className="w-full max-w-[420px] rounded-3xl bg-[#e9f1f2] px-6 py-10 sm:px-10 sm:py-12 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-emerald-200">
            <svg
              className="h-10 w-10 sm:h-12 sm:w-12 text-emerald-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          <h2 className="text-base sm:text-xl font-semibold text-slate-700">
            Perfil registrado correctamente
          </h2>

        </div>
      </div>
    );
  };

  return (
    <>
      <SuccessModal />

      <section className="min-h-screen bg-[#ededed] flex items-center justify-center p-4">
        <div className="w-full max-w-4xl rounded-2xl bg-[#6763cc] p-8 sm:p-12 shadow-2xl border-4 border-cyan-400">

          <h1 className="text-center text-white text-xl sm:text-2xl font-extrabold uppercase tracking-wide">
            Informacion Basica
          </h1>

          <p className="text-center text-white/80 mt-3 mb-8 text-sm sm:text-base">
            Completa tu perfil para mostrar quién eres en tu portafolio.
          </p>

          {serverError && (
            <p className="text-red-200 text-center mb-4">{serverError}</p>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">

            <div>
              <label className="text-white">Nombre</label>
              <input
                value={form.nombre}
                onChange={handleChange("nombre")}
                placeholder="Ej. Maria Fernanda"
                className={inputClass(false)}
              />
            </div>

            <div>
              <label className="text-white">Apellido</label>
              <input
                value={form.apellido}
                onChange={handleChange("apellido")}
                placeholder="Ej. Rodriguez"
                className={inputClass(false)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-white">Profesion</label>
              <input
                value={form.profesion}
                onChange={handleChange("profesion")}
                placeholder="Ej. Ingeniero de sistemas"
                className={inputClass(false)}
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-white">Biografia</label>
              <textarea
                rows={5}
                value={form.biografia}
                onChange={handleChange("biografia")}
                placeholder="Cuentanos brevemente quien eres..."
                className={inputClass(false)}
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                disabled={saving}
                className="bg-[#59d0d5] px-8 py-3 rounded-xl font-bold text-white w-full sm:w-auto"
              >
                {saving ? "Guardando..." : "Guardar perfil"}
              </button>
            </div>

          </form>
        </div>
      </section>
    </>
  );
}