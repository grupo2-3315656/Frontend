export const apiUrl = "http://localhost:3044/users";
export const apiTasks = "http://localhost:3044/tasks";
export const apiAuth = "http://10.5.225.34:3045/api/auth/login";

let currentUser = null;
let totalTasks = 0;

export const getCurrentUser = () => currentUser;
export const setCurrentUser = (user) => {
    currentUser = user;
};

let authToken = null;
let authUser = null;

export const getAuthToken = () => authToken;
export const setAuthToken = (token) => {
    authToken = token;
};

export const getAuthUser = () => authUser;
export const setAuthUser = (user) => {
    authUser = user;
};

export const isAuthenticated = () => !!authToken;

let isAdmin = false;

export const getIsAdmin = () => isAdmin;
export const setIsAdmin = (value) => {
    isAdmin = value;
};

export const logout = () => {
    authToken = null;
    authUser = null;
    currentUser = null;
    isAdmin = false;
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
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

export const loginEmail = document.getElementById("login-email");
export const loginPassword = document.getElementById("login-password");
export const loginError = document.getElementById("login-error");
export const btnLogin = document.getElementById("btn-login");
export const loginSection = document.getElementById("login-section");

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
