import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

let url = `${apiUrl}/users`;

export const usersApi = {
    get: async () => {
        return await fetchApi(url);
    },
    getById: async (id) => {
        return await fetchApi(`${url}/${id}`);
    },
    create: async (userData) => {
        return await fetchApi(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
    },
    update: async (id, userData) => {
        return await fetchApi(`${url}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });
    },
    delete: async (id) => {
        return await fetchApi(`${url}/${id}`, {
            method: "DELETE",
        });
    },
};
