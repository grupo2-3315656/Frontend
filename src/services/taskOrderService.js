export const orderByDate = (tasks) => {
    return [...tasks].sort((a, b) => new Date(a.date) - new Date(b.date));
};

export const orderByName = (tasks) => {
    return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
};

export const sortByState = (tasks, targetStatus) => {
    return [...tasks].sort((a, b) => {
        if (a.status === targetStatus && b.status !== targetStatus) return -1;
        if (a.status !== targetStatus && b.status === targetStatus) return 1;
        return 0;
    });
};

export const sortTasks = (tasks, criteria) => {
    if (!criteria || criteria === "date") return orderByDate(tasks);
    if (criteria === "name") return orderByName(tasks);
    if (criteria === "pendiente" || criteria === "en-progreso" || criteria === "completada") return sortByState(tasks, criteria);
    return tasks;
};
