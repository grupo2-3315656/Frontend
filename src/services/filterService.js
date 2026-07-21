import { filterStatus, filterTitle } from "./config.js";

// ============================================
//  LÓGICA DE FILTRADO EN TIEMPO REAL 
// ============================================
export const filterTasksList = (localTasks) => {
    const selectedStatus = filterStatus.value;
    const searchText = filterTitle.value.toLowerCase().trim();

    return localTasks.filter((task) => {
        const matchesStatus = selectedStatus === "todos" || task.status === selectedStatus;
        const matchesTitle = task.title.toLowerCase().includes(searchText);
        return matchesStatus && matchesTitle;
    });
};

export const filterAdminTasks = (tasks, statusFilter, userFilter) => {
    return tasks.filter((task) => {
        const matchesStatus = statusFilter === "todos" || task.status === statusFilter;

        let matchesUser = true;
        if (userFilter !== "todos") {
            matchesUser = (task.assignedUsers || []).some(
                (u) => u.id == userFilter,
            );
        }

        return matchesStatus && matchesUser;
    });
};