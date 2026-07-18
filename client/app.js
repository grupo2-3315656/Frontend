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
    taskUsers,
    usersError,
    tasksTable,
    userTasksContainer,
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
    renderUserTasks,
    showMessage,
    showErrorMessage,
    showEmptyTasks,
    handleExportTasks,
    searchUser,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getUserTasksList,
    renderFilteredTasks,
    isValidInput,
    setTextContent,
    setInnerHtml,
    apiUrl,
    sortTasks,
    extractTasksFromDOM,
} from "./src/index.js";
toggleTaskForm(true);

let allTasks = [];

const loadUsers = async () => {
    try {
        const res = await fetch(apiUrl);
        const users = await res.json();
        taskUsers.innerHTML = users.map(u =>
            `<option value="${u.id}">${u.name}</option>`
        ).join("");
    } catch {
        taskUsers.innerHTML = "<option value=\"\">Error al cargar usuarios</option>";
    }
};
loadUsers();

// ============================================
// EVENTO BUSCAR USUARIO
// ============================================
btnSearch.addEventListener("click", async () => {
    const documentValue = userDocInput.value.trim();

    setTextContent(searchError, "");

    if (!isValidInput(documentValue)) {
        setTextContent(searchError, "Debe ingresar un documento");
        showErrorMessage("Debe ingresar un documento");
        return;
    }

    try {
        clearTasks();
        const { user, tasks } = await searchUser(documentValue);
        setCurrentUser(user);
        showUserInfo(user);
        toggleTaskForm(false);

        const userTasks = await getUserTasksList(user.id);
        renderUserTasks(userTasks, userTasksContainer);

        showMessage("Usuario encontrado correctamente");

        allTasks = tasks;
        if (allTasks.length > 0) {
            renderFilteredTasks(allTasks);
        } else {
            clearTasks();
            showEmptyTasks();
        }
    } catch (error) {
        toggleTaskForm(true);
        setInnerHtml(
            userInfoDisplay,
            `
            <div class="message-card__content">❌ ${error.message}</div>
        `,
        );
        showErrorMessage(error.message);
        clearTasks();
        showEmptyTasks();
        console.error(error);
    }
});

// ============================================
// EVENTO CREAR O ACTUALIZAR TAREA
// ============================================
taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    const status = taskStatus.value;
    const editingId = getEditingTaskId();

    setTextContent(titleError, "");
    setTextContent(descError, "");
    setTextContent(statusError, "");
    setTextContent(usersError, "");

    if (!isValidInput(title)) {
        setTextContent(titleError, "Debe ingresar un título");
        showErrorMessage("Debe ingresar un título");
        return;
    }

    if (!isValidInput(description)) {
        setTextContent(descError, "Debe ingresar una descripción");
        showErrorMessage("Debe ingresar una descripción");
        return;
    }

    if (!isValidInput(status)) {
        setTextContent(statusError, "Debe seleccionar un estado");
        showErrorMessage("Debe seleccionar un estado");
        return;
    }

    const selectedUserIds = Array.from(taskUsers.selectedOptions).map(o => o.value);

    if (!selectedUserIds.length) {
        setTextContent(usersError, "Debe seleccionar al menos un usuario");
        showErrorMessage("Debe seleccionar al menos un usuario");
        return;
    }

    try {
        if (editingId) {
            const taskEdit = await updateTask(editingId, {
                title,
                description,
                status,
            });

            const index = allTasks.findIndex((t) => t.id == taskEdit.id);
            if (index !== -1) {
                allTasks[index] = taskEdit;
            }
            renderFilteredTasks(allTasks);

            setEditingTaskId(null);
            taskForm.reset();
            Array.from(taskUsers.options).forEach(o => o.selected = false);
            setTextContent(
                taskForm.querySelector('button[type="submit"]'),
                "Guardar Tarea",
            );
            showMessage("Tarea actualizada correctamente");
        } else {
            const taskSaved = await createTask({
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            allTasks.push(taskSaved);
            renderFilteredTasks(allTasks);
            taskForm.reset();
            Array.from(taskUsers.options).forEach(o => o.selected = false);
            showMessage("Tarea registrada correctamente");
        }
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO EDITAR TAREA
// ============================================
tasksTable.addEventListener("click", (event) => {
    const btnUpdate = event.target.closest(".btnUpdate");
    if (!btnUpdate) return;

    event.preventDefault();

    const taskId = btnUpdate.getAttribute("data-id");
    const currentCard = btnUpdate.closest(".message-card");
    if (!currentCard) return;

    const currentTitleText = setTextContent(
        currentCard.querySelector(".message-card__title"),
    )
        .replace("Tarea: ", "")
        .trim();
    const currentDescText = setTextContent(
        currentCard.querySelector(".message-card__content"),
    ).trim();

    taskTitle.value = currentTitleText;
    taskDesc.value = currentDescText;
    taskStatus.value = "";

    setEditingTaskId(taskId);

    const submitBtn = taskForm.querySelector('button[type="submit"]');
    setTextContent(submitBtn, "Actualizar Tarea");

    taskForm.scrollIntoView({ behavior: "smooth", block: "center" });
    taskTitle.focus();
});

// ============================================
// EVENTO ELIMINAR TAREA
// ============================================
tasksTable.addEventListener("click", async (event) => {
    const btnDelete = event.target.closest(".btnDelete");
    if (!btnDelete) return;

    event.preventDefault();
    const taskId = btnDelete.getAttribute("data-id");

    try {
        await deleteTask(taskId);
        allTasks = allTasks.filter((t) => t.id != taskId);
        renderFilteredTasks(allTasks);
        showMessage("Tarea eliminada correctamente");
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO CAMBIAR ESTADO DESDE TARJETA
// ============================================
tasksTable.addEventListener("click", async (event) => {
    const btnStatus = event.target.closest(".btn-status");
    if (!btnStatus) return;

    const taskId = btnStatus.getAttribute("data-id");
    const newStatus = btnStatus.getAttribute("data-status");
    const card = btnStatus.closest(".message-card");

    try {
        const updated = await updateTaskStatus(taskId, newStatus);
        const index = allTasks.findIndex((t) => t.id == updated.id);
        if (index !== -1) {
            allTasks[index] = updated;
        }
        renderFilteredTasks(allTasks);
        showMessage("Estado actualizado correctamente");
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ==========================================
// FILTROS EN TIEMPO REAL
// ==========================================
filterTitle.addEventListener("input", () => renderFilteredTasks(allTasks));
filterStatus.addEventListener("change", () => renderFilteredTasks(allTasks));

// ==========================================
// EVENTO ORDENAR TAREAS
// ==========================================
document.addEventListener("change", (event) => {
    const orderSelect = event.target.closest("#status-order");
    if (!orderSelect) return;

    const criteria = orderSelect.value || "date";

    const tasks = extractTasksFromDOM();
    if (!tasks.length) return;

    const sorted = sortTasks(tasks, criteria);

    sorted.forEach((task) => {
        tasksTable.appendChild(task.element);
    });
});

// ============================================
// EVENTO EXPORTAR TAREAS
// ============================================
btnExport.addEventListener("click", handleExportTasks);
