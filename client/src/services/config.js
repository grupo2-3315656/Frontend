export const apiUrl = "http://localhost:3044/users";
export const apiTasks = "http://localhost:3044/tasks";

let currentUser = null;
let totalTasks = 0;

export const getCurrentUser = () => currentUser;
export const setCurrentUser = (user) => {
    currentUser = user;
};

export const getTotalTasks = () => totalTasks;
export const setTotalTasks = (count) => {
    totalTasks = count;
};

export const incrementTotalTasks = () => {
    totalTasks++;
};

export const resetTasks = () => {
    totalTasks = 0;
};

let editingTaskId = null;
export const getEditingTaskId = () => editingTaskId;
export const setEditingTaskId = (id) => {
    editingTaskId = id;
};

export const userDocInput = document.getElementById("user-doc");
export const btnSearch = document.getElementById("btn-search");
export const searchError = document.getElementById("search-error");
export const userInfoDisplay = document.getElementById("user-info-display");
export const taskForm = document.getElementById("task-form");
export const taskTitle = document.getElementById("task-title");
export const titleError = document.getElementById("title-error");
export const taskDesc = document.getElementById("task-desc");
export const descError = document.getElementById("desc-error");
export const taskStatus = document.getElementById("task-status");
export const statusError = document.getElementById("status-error");
export const taskUsers = document.getElementById("task-users");
export const usersError = document.getElementById("users-error");
export const tasksTable = document.getElementById("tasks-table");
export const taskCount = document.getElementById("task-count");
export const filterTitle = document.getElementById("filter-title");
export const filterStatus = document.getElementById("filter-status");
export const btnExport = document.getElementById("btn-export");
