import { tasksApi } from "../api/tasksApi.js";

export const createTask = async (taskData) => {
    return await tasksApi.create(taskData);
};

export const updateTask = async (taskId, taskData) => {
    return await tasksApi.update(taskId, taskData);
};

export const deleteTask = async (taskId) => {
    return await tasksApi.delete(taskId);
};
