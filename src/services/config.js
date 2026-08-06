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

// ===== ESTADO DE EDICIÓN DE TAREA =====
// Variable que guarda el id de la tarea que se está editando.
// Si es null  => el formulario queda en modo "crear".
// Si tiene id => el formulario queda en modo "editar".
let editingTaskId = null;
export const getEditingTaskId = () => editingTaskId;
export const setEditingTaskId = (id) => {
    editingTaskId = id;
};

// ===== REFERENCIAS A ELEMENTOS DEL FORMULARIO DE TAREAS =====
// Cada export es una referencia directa a un elemento del HTML
// (obtenida con document.getElementById). Por ejemplo:
// taskForm es el <form id="task-form">, taskTitle el input
// del título, taskStatus el select del estado, tasksTable el
// contenedor donde se dibujan las tarjetas, etc.
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
export const userTasksSection = document.getElementById("user-tasks-section");
export const taskUsers = document.getElementById("task-users");
export const usersError = document.getElementById("users-error");
export const selectedUsersContainer = document.getElementById("selected-users");

// Navegación por tabs
export const navTabs = document.querySelectorAll(".nav__tab");
export const viewUsers = document.getElementById("view-users");
export const viewAdmin = document.getElementById("view-admin");
export const viewTasks = document.getElementById("view-tasks");

// Vista Usuarios
export const userForm = document.getElementById("user-form");
export const userFormName = document.getElementById("user-form-name");
export const userFormEmail = document.getElementById("user-form-email");
export const userFormNameError = document.getElementById("user-form-name-error");
export const userFormEmailError = document.getElementById("user-form-email-error");
export const usersTableContainer = document.getElementById("users-table");
export const userFormSubmitBtn = document.getElementById("user-form-submit");

// Vista Admin
export const adminTasksContainer = document.getElementById("admin-tasks-container");
export const adminTaskCount = document.getElementById("admin-task-count");
export const adminFilterStatus = document.getElementById("admin-filter-status");
export const adminFilterUser = document.getElementById("admin-filter-user");
