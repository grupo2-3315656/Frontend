import { apiAuth } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

export const loginUser = async (email) => {
    return fetchApi(apiAuth, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    }, {
        400: "Datos de inicio de sesión inválidos",
        401: "Credenciales inválidas",
        500: "Error interno del servidor",
    }, "Error al iniciar sesión");
};
