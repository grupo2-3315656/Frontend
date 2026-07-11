import { filterStatus, filterTitle } from "./config.js";

// ============================================
//  LÓGICA DE FILTRADO EN TIEMPO REAL 
// ============================================
export const filterTasksList = (localTasks) => {
    const selectedStatus = filterStatus.value;
    const searchText = filterTitle.value.toLowerCase().trim();

    // Return only the filtered array
    return localTasks.filter((task) => {
        const matchesStatus = selectedStatus === "todos" || task.status === selectedStatus;
        const matchesTitle = task.title.toLowerCase().includes(searchText);
        return matchesStatus && matchesTitle;
    });
};