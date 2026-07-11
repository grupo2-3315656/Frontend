import { fetchApi } from "../utils/fetchApi.js";

const API_USERS_URL = "http://localhost:3045/api/users";

export const deleteUserById = async (id) => {
    return fetchApi(`${API_USERS_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    }, {
        404: "Usuario no encontrado",
        500: "Error interno del servidor",
    }, "Error al eliminar usuario");
};
