export const apiUrl = "http://localhost:3000/api";

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
export const tasksTable = document.getElementById("tasks-table");
export const taskCount = document.getElementById("task-count");
export const filterTitle = document.getElementById("filter-title");
export const filterStatus = document.getElementById("filter-status");
export const btnExport = document.getElementById("btn-export");

export const adminHeader = document.getElementById("admin-header");
export const adminPanel = document.getElementById("admin-panel");
export const adminArrow = document.getElementById("admin-arrow");
export const adminUserDoc = document.getElementById("admin-user-doc");
export const adminSearchError = document.getElementById("admin-search-error");
export const btnAdminSearch = document.getElementById("btn-admin-search");
export const adminUserId = document.getElementById("admin-user-id");
export const adminIdError = document.getElementById("admin-id-error");
export const adminUserName = document.getElementById("admin-user-name");
export const adminNameError = document.getElementById("admin-name-error");
export const adminUserEmail = document.getElementById("admin-user-email");
export const adminEmailError = document.getElementById("admin-email-error");
export const btnAdminCreate = document.getElementById("btn-admin-create");
export const adminUsersList = document.getElementById("admin-users-list");
