import { tasksApi, assignmentsApi, usersApi } from "../api/index.js";
import {
    adminTaskCount,
    adminFilterUser,
    adminFilterStatus,
    adminTasksContainer,
} from "./config.js";
import { filterAdminTasks } from "./filterService.js";
import { renderAdminTasks } from "../ui/adminTasksTable.js";
import { showErrorMessage } from "../ui/notifications.js";

// ===== OBTENER TAREAS CON SUS USUARIOS =====
// Hace las 3 peticiones en paralelo (Promise.all): tareas,
// asignaciones y usuarios, y une cada tarea con los usuarios
// asignados para poder mostrarlos en la tabla.
export const getAllTasksWithUsers = async () => {
    const [tasks, assignments, users] = await Promise.all([
        tasksApi.get(),
        assignmentsApi.get(),
        usersApi.get(),
    ]);

    const tasksArray = Array.isArray(tasks) ? tasks : [];
    const assignmentsArray = Array.isArray(assignments) ? assignments : [];
    const usersArray = Array.isArray(users) ? users : [];

    // Mapa de usuarios por id para buscarlos rápidamente.
    const usersMap = {};
    usersArray.forEach((u) => {
        usersMap[u.id] = u;
    });

    // A cada tarea le agrega la propiedad assignedUsers
    // con los usuarios que le fueron asignados.
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

export const loadAdminTasks = async () => {
    try {
        const tasks = await getAllTasksWithUsers();
        const tasksArray = Array.isArray(tasks) ? tasks : [];
        adminTaskCount.textContent = `${tasksArray.length} Tareas`;

        const usersSet = {};
        tasksArray.forEach((task) => {
            (task.assignedUsers || []).forEach((u) => {
                usersSet[u.id] = u;
            });
        });
        const uniqueUsers = Object.values(usersSet);

        adminFilterUser.innerHTML =
            '<option value="todos">Todos los usuarios</option>';
        uniqueUsers.forEach((u) => {
            const opt = document.createElement("option");
            opt.value = u.id;
            opt.textContent = u.name;
            adminFilterUser.appendChild(opt);
        });

        renderAdminTasks(tasksArray, adminTasksContainer);
        return tasksArray;
    } catch (error) {
        showErrorMessage(error.message);
        return [];
    }
};

export const renderFilteredAdminTasks = (adminAllTasks) => {
    const statusVal = adminFilterStatus.value;
    const userVal = adminFilterUser.value;
    const filtered = filterAdminTasks(adminAllTasks, statusVal, userVal);
    adminTaskCount.textContent = `${filtered.length} Tareas`;
    renderAdminTasks(filtered, adminTasksContainer);
};
