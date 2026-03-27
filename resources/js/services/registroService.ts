export interface RegistroFormData {
  nombre: string;
  correo: string;
  password: string;
  confirmarPassword: string;
}

export interface RegistroErrors {
  nombre: string;
  correo: string;
  password: string;
  confirmarPassword: string;
}

export const initialRegistroFormData: RegistroFormData = {
  nombre: "",
  correo: "",
  password: "",
  confirmarPassword: "",
};

export const initialRegistroErrors: RegistroErrors = {
  nombre: "",
  correo: "",
  password: "",
  confirmarPassword: "",
};

export function validateNombre(nombre: string): string {
  const value = nombre.trim();

  if (!value) {
    return "Este campo es obligatorio";
  }

  if (value.length < 3 || value.length > 40) {
    return "Fuera del límite";
  }

  const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  if (!nombreRegex.test(value)) {
    return "Solo se permiten letras";
  }

  return "";
}

export function validateCorreo(correo: string): string {
  const value = correo.trim();

  if (!value) {
    return "Este campo es obligatorio";
  }

  const emailRegex = 
    /^[A-Za-z0-9._%+-]+@(gmail\.com|hotmail\.com|yahoo\.com|outlook\.com|umss\.edu\.bo|umss\.edu|est\.umss\.edu|ucb\.edu\.bo|univalle\.edu|harvard\.edu|mit\.edu|empresa\.com\.bo|miempresa\.net)$/i;
  if (!emailRegex.test(value)) {
    return "Correo electrónico no válido";
  }

  return "";
}

export function validatePassword(password: string): string {
  const value = password;

  if (!value) {
    return "Este campo es obligatorio";
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/;
  if (!passwordRegex.test(value)) {
    return "La contraseña debe tener 8 caracteres";
  }

  return "";
}

export function validateConfirmarPassword(
  password: string,
  confirmarPassword: string
): string {
  if (!confirmarPassword) {
    return "Este campo es obligatorio";
  }

  if (password !== confirmarPassword) {
    return "Las contraseñas no coinciden";
  }

  return "";
}

export function validateRegistroForm(data: RegistroFormData): RegistroErrors {
  return {
    nombre: validateNombre(data.nombre),
    correo: validateCorreo(data.correo),
    password: validatePassword(data.password),
    confirmarPassword: validateConfirmarPassword(
      data.password,
      data.confirmarPassword
    ),
  };
}

export function hasErrors(errors: RegistroErrors): boolean {
  return Object.values(errors).some((error) => error.trim() !== "");
}

export function isRegistroFormComplete(data: RegistroFormData): boolean {
  return Object.values(data).every((value) => value.trim() !== "");
}

export interface RegistroApiResponse {
  message: string;
  redirect?: string;
  usuario?: {
    id_usuario: number;
    nombre: string;
    email: string;
    slug: string;
  };
}

export interface LaravelValidationError {
  message?: string;
  errors?: Record<string, string[]>;
}

export async function registrarUsuario(
  formData: RegistroFormData
): Promise<RegistroApiResponse> {
  const payload = {
    nombre: formData.nombre.trim(),
    email: formData.correo.trim(),
    password: formData.password,
    password_confirmation: formData.confirmarPassword,
  };

  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw data as LaravelValidationError;
  }

  return data as RegistroApiResponse;
}

/* =========================
   FUNCIONES NUEVAS
========================= */

export function mapLaravelErrorsToRegistroErrors(
  error: LaravelValidationError
): RegistroErrors {
  return {
    nombre: error.errors?.nombre?.[0] ?? "",
    correo: error.errors?.email?.[0] ?? "",
    password: error.errors?.password?.[0] ?? "",
    confirmarPassword: error.errors?.password_confirmation?.[0] ?? "",
  };
}

export function isCorreoDuplicadoError(
  error: LaravelValidationError
): boolean {
  const emailError = error.errors?.email?.[0]?.toLowerCase() ?? "";
  const message = error.message?.toLowerCase() ?? "";

  return (
    emailError.includes("already been taken") ||
    emailError.includes("ya ha sido registrado") ||
    emailError.includes("ya existe") ||
    emailError.includes("duplicado") ||
    message.includes("already been taken") ||
    message.includes("ya ha sido registrado") ||
    message.includes("ya existe") ||
    message.includes("duplicado")
  );
}

export function getRegistroErrorMessage(
  error: LaravelValidationError
): string {
  if (isCorreoDuplicadoError(error)) {
    return "Ya existe una cuenta registrada a este correo electrónico.";
  }

  return (
    error.message ||
    "Ocurrió un error al registrar la cuenta. Intenta nuevamente."
  );
}