import { apiUrl } from "../services/config.js";
import { fetchApi } from "../utils/fetchApi.js";

let url = `${apiUrl}/assignments`;
let urlTasks = `${apiUrl}/tasks`;
let urlUsers = `${apiUrl}/users`;

export const assignmentsApi = {
    get: async () => {
        return await fetchApi(url);
    },
    getById: async (id) => {
        return await fetchApi(`${url}/${id}`);
    },
    getByTaskId: async (id) => {
        return await fetchApi(`${urlTasks}/${id}/users`);
    },
    getByUserId: async (id) => {
        return await fetchApi(`${urlUsers}/${id}/tasks`);
    },
    create: async (assignmentData) => {
        return await fetchApi(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignmentData),
        });
    },
    delete: async (id) => {
        return await fetchApi(`${url}/${id}`, {
            method: "DELETE",
        });
    },
};
