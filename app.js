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
    renderUsersList,
    renderSingleUser,
    toggleAdminPanel,
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    adminUserId,
    adminIdError,
} from "./src/index.js";
toggleTaskForm(true);

let allTasks = [];

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
            setTextContent(
                taskForm.querySelector('button[type="submit"]'),
                "Guardar Tarea",
            );
            showMessage("Tarea actualizada correctamente");
        } else {
            const taskSaved = await createTask({
                userId: getCurrentUser().id,
                title,
                description,
                status,
            });

            allTasks.push(taskSaved);
            renderFilteredTasks(allTasks);
            taskForm.reset();
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

// ============================================
// ADMINISTRACIÓN DE USUARIOS
// ============================================

adminHeader.addEventListener("click", async () => {
    toggleAdminPanel(adminPanel, adminArrow);
    if (!adminPanel.classList.contains("hidden")) {
        try {
            const users = await getAllUsers();
            renderUsersList(users, adminUsersList);
        } catch (error) {
            showErrorMessage("Error al cargar usuarios: " + error.message);
        }
    }
});

btnAdminSearch.addEventListener("click", async () => {
    const docValue = adminUserDoc.value.trim();
    setTextContent(adminSearchError, "");

    if (!isValidInput(docValue)) {
        setTextContent(adminSearchError, "Debe ingresar un documento");
        showErrorMessage("Debe ingresar un documento");
        return;
    }

    try {
        const user = await getUserById(docValue);
        renderSingleUser(user, adminUsersList);
        showMessage("Usuario encontrado");
    } catch (error) {
        setTextContent(adminSearchError, error.message);
        showErrorMessage(error.message);
    }
});

btnAdminCreate.addEventListener("click", async () => {
    const id = adminUserId.value.trim();
    const name = adminUserName.value.trim();
    const email = adminUserEmail.value.trim();
    setTextContent(adminIdError, "");
    setTextContent(adminNameError, "");
    setTextContent(adminEmailError, "");

    if (!isValidInput(id)) {
        setTextContent(adminIdError, "Debe ingresar un documento");
        showErrorMessage("Debe ingresar un documento");
        return;
    }

    if (!isValidInput(name)) {
        setTextContent(adminNameError, "Debe ingresar un nombre");
        showErrorMessage("Debe ingresar un nombre");
        return;
    }

    if (!isValidInput(email)) {
        setTextContent(adminEmailError, "Debe ingresar un correo");
        showErrorMessage("Debe ingresar un correo");
        return;
    }

    try {
        await createUser({ id, name, email });
        showMessage("Usuario creado correctamente");
        adminUserId.value = "";
        adminUserName.value = "";
        adminUserEmail.value = "";
        const users = await getAllUsers();
        renderUsersList(users, adminUsersList);
    } catch (error) {
        showErrorMessage(error.message);
    }
});

adminUsersList.addEventListener("click", async (event) => {
    const btnUpdate = event.target.closest(".btn-admin-update");
    if (btnUpdate) {
        const id = btnUpdate.getAttribute("data-id");
        const currentName = btnUpdate.getAttribute("data-name");
        const currentEmail = btnUpdate.getAttribute("data-email");
        const newName = prompt("Nombre actual: " + currentName + "\nNuevo nombre:", currentName);
        if (newName === null) return;
        const newEmail = prompt("Correo actual: " + currentEmail + "\nNuevo correo:", currentEmail);
        if (newEmail === null) return;

        try {
            await updateUser(id, { name: newName, email: newEmail });
            showMessage("Usuario actualizado correctamente");
            const users = await getAllUsers();
            renderUsersList(users, adminUsersList);
        } catch (error) {
            showErrorMessage(error.message);
        }
        return;
    }

    const btnDelete = event.target.closest(".btn-admin-delete");
    if (btnDelete) {
        const id = btnDelete.getAttribute("data-id");
        if (!confirm("¿Está seguro de eliminar este usuario?")) return;

        try {
            await deleteUser(id);
            showMessage("Usuario eliminado correctamente");
            const users = await getAllUsers();
            renderUsersList(users, adminUsersList);
        } catch (error) {
            showErrorMessage(error.message);
        }
    }
});
