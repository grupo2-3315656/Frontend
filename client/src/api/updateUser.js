import { fetchApi } from "../utils/fetchApi.js";

const API_USERS_URL = "http://localhost:3045/api/users";

export const updateUserById = async (id, data) => {
    return fetchApi(`${API_USERS_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    }, {
        404: "Usuario no encontrado",
        500: "Error interno del servidor",
    }, "Error al actualizar usuario");
};
