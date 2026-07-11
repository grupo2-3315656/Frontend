import {
    btnSearch,
    userDocInput,
    searchError,
    userInfoDisplay,
    taskForm,
    taskTitle,
    titleError,
    taskDesc,
    descError,
    taskStatus,
    statusError,
    tasksTable,
    filterTitle,
    filterStatus,
    btnExport,
    getCurrentUser,
    setCurrentUser,
    getEditingTaskId,
    setEditingTaskId,
    toggleTaskForm,
    clearTasks,
    showUserInfo,
    addTaskToTable,
    showMessage,
    showErrorMessage,
    showEmptyTasks,
    handleExportTasks,
    searchUser,
    createTask,
    updateTask,
    deleteTask,
    filterTasksList,
    renderFilteredTasks,
    isValidInput,
    getStatusLabel,
    setTextContent,
    setInnerHtml,
    handleError,
    tasksOrderBar,
    sortTasks,
    extractTasksFromDOM,
    loginEmail,
    loginError,
    btnLogin,
    loginSection,
    login,
    isAuthenticated,
    setAuthToken,
    setAuthUser,
    logout,
} from "./src/index.js";

function restoreSession() {
    const savedToken = localStorage.getItem("authToken");
    const savedUser = localStorage.getItem("authUser");
    if (savedToken && savedUser) {
        setAuthToken(savedToken);
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        loginSection.classList.add("hidden");
        showUserInfo(user);
        showMessage(`Bienvenido de nuevo, ${user.name}`);
        return true;
    }
    return false;
}

if (restoreSession()) {
    toggleTaskForm(false);
} else {
    document.querySelectorAll(".form-section:not(#login-section)").forEach((el) => el.classList.add("hidden"));
    document.querySelector(".messages-section").classList.add("hidden");
}

// ============================================
// EVENTO INICIAR SESIÓN
// ============================================
btnLogin.addEventListener("click", async () => {
    const email = loginEmail.value.trim();

    setTextContent(loginError, "");

    if (!email) {
        setTextContent(loginError, "Debe ingresar un correo electrónico");
        showErrorMessage("Debe ingresar un correo electrónico");
        return;
    }

    try {
        const user = await login(email);
        loginSection.classList.add("hidden");
        showUserInfo(user);
        toggleTaskForm(false);
        showMessage(`Bienvenido, ${user.name}`);
    } catch (error) {
        setTextContent(loginError, error.message);
        showErrorMessage(error.message);
    }
});
