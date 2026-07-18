import { tasksApi } from "../api/tasksApi.js";
import { assignmentsApi } from "../api/assignments.js";

export const createTask = async (taskData) => {
    return await tasksApi.create(taskData);
};

export const createTaskWithAssignments = async (taskData) => {
    const { userIds, ...taskPayload } = taskData;
    const task = await tasksApi.create(taskPayload);

    for (const userId of userIds) {
        await assignmentsApi.create({ taskId: task.id, userId });
    }

    return task;
};

export const updateTask = async (taskId, taskData) => {
    return await tasksApi.update(taskId, taskData);
};

export const deleteTask = async (taskId) => {
    return await tasksApi.delete(taskId);
};
