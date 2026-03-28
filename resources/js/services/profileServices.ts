export type ProfileForm = {
  nombre: string;
  apellido: string;
  profesion: string;
  biografia: string;
};

export type ApiProfileResponse = {
  data?: Partial<ProfileForm> | null;
  message?: string;
  errors?: Record<string, string[]>;
};

const PROFILE_ENDPOINT = "/api/profile/basic-info";

/*  FUNCIÓN CLAVE: obtiene el token guardado del login */
function authHeaders() {
  const token = localStorage.getItem("token");

  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`, // ← aquí se envía el token
  };
}

function normalizeProfile(data?: Partial<ProfileForm> | null): ProfileForm {
  return {
    nombre: data?.nombre?.trim() ?? "",
    apellido: data?.apellido?.trim() ?? "",
    profesion: data?.profesion?.trim() ?? "",
    biografia: data?.biografia?.trim() ?? "",
  };
}

async function parseJsonSafe(response: Response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

/*  OBTENER PERFIL (GET) */
export async function getProfile(): Promise<ProfileForm> {
  const response = await fetch(PROFILE_ENDPOINT, {
    method: "GET",
    headers: authHeaders(), // ← ahora envía el token automáticamente
  });

  const payload = (await parseJsonSafe(response)) as ApiProfileResponse;

  if (!response.ok) {
    throw {
      message: payload?.message || "No se pudo cargar la información del perfil.",
      errors: payload?.errors || {},
      status: response.status,
    };
  }

  return normalizeProfile(payload.data);
}

/*  GUARDAR PERFIL (PUT) */
export async function updateProfile(profile: ProfileForm): Promise<ApiProfileResponse> {
  const response = await fetch(PROFILE_ENDPOINT, {
    method: "PUT",
    headers: authHeaders(), // ← token incluido aquí también
    body: JSON.stringify(profile),
  });

  const payload = (await parseJsonSafe(response)) as ApiProfileResponse;

  if (!response.ok) {
    throw {
      message: payload?.message || "No se pudo guardar el perfil.",
      errors: payload?.errors || {},
      status: response.status,
    };
  }

  return payload;
}