import { fetchApi } from "../utils/fetchApi.js";

const API_USERS_URL = "http://10.5.225.34:3045/api/users";

export const getAllUsers = async () => {
    return fetchApi(API_USERS_URL, {}, {
        500: "Error interno del servidor",
    }, "Error al obtener usuarios");
};
