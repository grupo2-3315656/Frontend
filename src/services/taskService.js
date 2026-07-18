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

export const updateTaskWithAssignments = async (taskId, taskData) => {
    const { userIds, ...taskPayload } = taskData;

    const allAssignments = await assignmentsApi.get();
    const currentAssignments = allAssignments.filter(a => a.taskId === taskId);
    const currentUserIds = currentAssignments.map(a => a.userId);

    const toAdd = userIds.filter(id => !currentUserIds.includes(id));
    const toRemove = currentAssignments.filter(a => !userIds.includes(a.userId));

    for (const userId of toAdd) {
        await assignmentsApi.create({ taskId, userId });
    }

    for (const assignment of toRemove) {
        await assignmentsApi.delete(assignment.id);
    }

    return await tasksApi.update(taskId, taskPayload);
};

export const deleteTask = async (taskId) => {
    return await tasksApi.delete(taskId);
};
