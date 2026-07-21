import { tasksApi, assignmentsApi, usersApi } from "../api/index.js";

export const getAllTasksWithUsers = async () => {
    const [tasks, assignments, users] = await Promise.all([
        tasksApi.get(),
        assignmentsApi.get(),
        usersApi.get(),
    ]);

    const tasksArray = Array.isArray(tasks) ? tasks : [];
    const assignmentsArray = Array.isArray(assignments) ? assignments : [];
    const usersArray = Array.isArray(users) ? users : [];

    const usersMap = {};
    usersArray.forEach((u) => {
        usersMap[u.id] = u;
    });

    const tasksWithUsers = tasksArray.map((task) => {
        const taskAssignments = assignmentsArray.filter(
            (a) => a.taskId == task.id || a.task_id == task.id,
        );

        const assignedUsers = taskAssignments
            .map((a) => {
                const userId = a.userId || a.user_id;
                return usersMap[userId];
            })
            .filter(Boolean);

        return {
            ...task,
            assignedUsers,
        };
    });

    return tasksWithUsers;
};
