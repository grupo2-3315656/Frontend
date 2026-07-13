import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

let url = `${apiUrl}/tasks`;

export const tasksApi = {
    get: async () => {
        return await fetchApi(url);
    },
    getById: async (id) => {
        return await fetchApi(`${url}/${id}`);
    },
    create: async (taskData) => {
        return await fetchApi(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
    },
    update: async (id, taskData) => {
        return await fetchApi(`${url}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(taskData),
        });
    },
    delete: async (id) => {
        return await fetchApi(`${url}/${id}`, {
            method: "DELETE",
        });
    },
};
