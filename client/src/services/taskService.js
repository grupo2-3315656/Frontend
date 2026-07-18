import { createTask as apiCreateTask } from "../api/createTask.js";
import { updateTask as apiUpdateTask } from "../api/updateTask.js";
import { deleteTask as apiDeleteTask } from "../api/deleteTask.js";
import { getUserTasksList as apiGetUserTasksList } from "../api/getUserTasksList.js";
import { updateTaskStatus as apiUpdateTaskStatus } from "../api/updateTaskStatus.js";

export const createTask = async (taskData) => {
    return await apiCreateTask(taskData);
};

export const updateTask = async (taskId, taskData) => {
    return await apiUpdateTask(taskId, taskData);
};

export const deleteTask = async (taskId) => {
    return await apiDeleteTask(taskId);
};

export const getUserTasksList = async (userId) => {
    return await apiGetUserTasksList(userId);
};

export const updateTaskStatus = async (taskId, status) => {
    return await apiUpdateTaskStatus(taskId, status);
};
