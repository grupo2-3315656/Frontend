import {
    btnSearch,
    userDocInput,
    searchError,
    userInfoDisplay,
    userTasksSection,
    taskForm,
    taskTitle,
    titleError,
    taskDesc,
    descError,
    taskStatus,
    statusError,
    usersError,
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
    showMessage,
    showErrorMessage,
    showEmptyTasks,
    handleExportTasks,
    searchUser,
    createTask,
    createTaskWithAssignments,
    updateTask,
    updateTaskWithAssignments,
    deleteTask,
    renderFilteredTasks,
    loadAllTasks,
    isValidInput,
    setTextContent,
    setInnerHtml,
    sortTasks,
    extractTasksFromDOM,
    getSelectedUserIds,
    clearSelectedUsers,
    setSelectedUsers,
    assignmentsApi,
    navTabs,
    userForm,
    userFormName,
    userFormEmail,
    userFormNameError,
    userFormEmailError,
    userFormSubmitBtn,
    adminFilterStatus,
    adminFilterUser,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    switchView,
    loadUsers as loadUsersService,
    handleEditUser as handleEditUserService,
    handleDeleteUser as handleDeleteUserService,
    loadAdminTasks as loadAdminTasksService,
    renderFilteredAdminTasks as renderFilteredAdminTasksService,
} from "./src/index.js";

let allTasks = [];
let allUsers = [];
let editingUserId = null;
let adminAllTasks = [];

// ============================================
// NAVEGACIÓN POR TABS
// ============================================
const onLoadUsers = () => loadUsers();
const onLoadAdminTasks = async () => { adminAllTasks = await loadAdminTasks(); };
const onLoadAllTasks = async () => { allTasks = await loadAllTasks(); };

const onSwitchView = (viewId) => {
    switchView({ viewId, onLoadUsers, onLoadAdminTasks, onLoadAllTasks });
};

navTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        onSwitchView(tab.getAttribute("data-view"));
    });
});

// ============================================
// MÓDULO DE USUARIOS - CARGAR USUARIOS
// ============================================
const loadUsers = async () => {
    allUsers = await loadUsersService({
        getAllUsers,
        onEdit: handleEditUser,
        onDelete: handleDeleteUser,
    });
};

const handleEditUser = (user) => {
    editingUserId = handleEditUserService(user);
};

const handleDeleteUser = async (userId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;
    await handleDeleteUserService({
        userId,
        deleteUser,
        onDeleted: loadUsers,
    });
};

// ============================================
// MÓDULO DE USUARIOS - CREAR / ACTUALIZAR
// ============================================
userForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = userFormName.value.trim();
    const email = userFormEmail.value.trim();

    setTextContent(userFormNameError, "");
    setTextContent(userFormEmailError, "");

    if (!isValidInput(name)) {
        setTextContent(userFormNameError, "Debe ingresar un nombre");
        showErrorMessage("Debe ingresar un nombre");
        return;
    }

    if (!isValidInput(email)) {
        setTextContent(userFormEmailError, "Debe ingresar un email");
        showErrorMessage("Debe ingresar un email");
        return;
    }

    try {
        if (editingUserId) {
            await updateUser(editingUserId, { name, email });
            showMessage("Usuario actualizado correctamente");
            editingUserId = null;
            userFormName.value = "";
            userFormEmail.value = "";
            setTextContent(userFormSubmitBtn, "Guardar Usuario");
            setTextContent(
                document.getElementById("user-form-title"),
                "Registrar Nuevo Usuario",
            );
        } else {
            await createUser({ name, email });
            showMessage("Usuario registrado correctamente");
            userForm.reset();
        }
        loadUsers();
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// VISTA ADMIN - CARGAR TODAS LAS TAREAS
// ============================================
const loadAdminTasks = async () => {
    adminAllTasks = await loadAdminTasksService();
    return adminAllTasks;
};

const renderFilteredAdminTasks = () => {
    renderFilteredAdminTasksService(adminAllTasks);
};

adminFilterStatus.addEventListener("change", renderFilteredAdminTasks);
adminFilterUser.addEventListener("change", renderFilteredAdminTasks);

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
        userTasksSection.style.display = "";
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
        allTasks = await loadAllTasks();
        console.error(error);
    }
});

// ============================================
// EVENTO CREAR O ACTUALIZAR TAREA
// ============================================
// ===== BLOQUE 1: ESCUCHAR EL EVENTO SUBMIT =====
// taskForm es el formulario de tareas (referenciado en config.js).
// addEventListener("submit", ...) hace que el formulario "escuche"
// el evento submit: cada vez que se pulsa el botón de enviar,
// se ejecuta esta función (async para poder usar await).
taskForm.addEventListener("submit", async (event) => {
    // ===== BLOQUE 2: EVITAR RECARGA DE PÁGINA =====
    // preventDefault() anula el comportamiento por defecto del navegador,
    // que sería recargar la página al hacer submit; así el evento lo
    // manejamos nosotros con JavaScript sin recargar.
    event.preventDefault();

    // ===== BLOQUE 3: OBTENER VALORES DEL FORMULARIO =====
    // Leemos el valor de cada campo del formulario y con .trim()
    // quitamos los espacios en blanco de los extremos.
    const title = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    const status = taskStatus.value;
    // getEditingTaskId() devuelve el id de la tarea en edición:
    // si es null  => estamos creando una tarea nueva.
    // si tiene id => estamos actualizando una tarea existente.
    const editingId = getEditingTaskId();
    // getSelectedUserIds() lee del estado interno (userSelectUI.js)
    // los usuarios que se marcaron para asignar a la tarea.
    const selectedUserIds = getSelectedUserIds();

    // ===== BLOQUE 4: LIMPIAR MENSAJES DE ERROR =====
    // Limpia los textos de error de la validación anterior
    // para que no queden mensajes acumulados en pantalla.
    setTextContent(titleError, "");
    setTextContent(descError, "");
    setTextContent(statusError, "");
    setTextContent(usersError, "");

    // ===== BLOQUE 5: VALIDACIÓN DE CAMPOS =====
    // isValidInput() devuelve true solo si el valor no está vacío.
    // Si falta un dato: muestra el error debajo del input,
    // lanza una notificación (toast) y se detiene con return.
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

    // ===== BLOQUE 6: VALIDAR USUARIOS ASIGNADOS =====
    // Verifica que haya al menos un usuario asignado a la tarea.
    if (!selectedUserIds.length) {
        setTextContent(usersError, "Debe seleccionar al menos un usuario");
        showErrorMessage("Debe seleccionar al menos un usuario");
        return;
    }

    // ===== BLOQUE 7: PETICIÓN (MODO EDICIÓN O CREACIÓN) =====
    // Dentro del try se revisa si es modo edición o modo creación.
    try {
        // ---- MODO EDICIÓN ----
        // Si editingId tiene un valor, la tarea ya existe y se actualiza.
        // Se le pasa el ID (primer parámetro) y el resto de los datos
        // (segundo parámetro): title, description, status y userIds.
        if (editingId) {
            await updateTaskWithAssignments(editingId, {
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            // ---- CUANDO TERMINA LA PETICIÓN ----
            // 1) Se limpia el id de edición para salir del modo edición.
            setEditingTaskId(null);
            // 2) Se resetea el formulario para dejar los inputs limpios.
            taskForm.reset();
            // 3) Se limpian los chips de usuarios asignados.
            clearSelectedUsers();
            // 4) Se restaura el texto del botón a "Guardar Tarea".
            setTextContent(
                taskForm.querySelector('button[type="submit"]'),
                "Guardar Tarea",
            );
            // 5) Se muestra una notificación de éxito.
            showMessage("Tarea actualizada correctamente");
            // 6) Se vuelven a cargar las tareas para refrescar la tabla.
            allTasks = await loadAllTasks();
        } else {
            // ---- MODO CREACIÓN ----
            // Si no hay id en edición, se crea una tarea nueva
            // con los datos del formulario y los usuarios asignados.
            await createTaskWithAssignments({
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            // Se limpia el formulario, los usuarios asignados,
            // se notifica el éxito y se recargan las tareas.
            taskForm.reset();
            clearSelectedUsers();
            showMessage("Tarea registrada correctamente");
            allTasks = await loadAllTasks();
        }
    } catch (error) {
        // ===== BLOQUE 8: MANEJO DE ERRORES =====
        // Si la petición falla, se muestra el mensaje de error
        // del servidor mediante una notificación.
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO EDITAR TAREA
// ============================================
tasksTable.addEventListener("click", async (event) => {
    const btnUpdate = event.target.closest(".btnUpdate");
    if (!btnUpdate) return;

    event.preventDefault();

    const taskId = btnUpdate.getAttribute("data-id");
    const currentCard = btnUpdate.closest(".message-card");
    if (!currentCard) return;

    const currentTitleText = setTextContent(
        currentCard.querySelector(".message-card__username"),
    ).trim();
    const currentDescText = setTextContent(
        currentCard.querySelector(".message-card__content"),
    ).trim();

    taskTitle.value = currentTitleText;
    taskDesc.value = currentDescText;
    taskStatus.value = "";

    setEditingTaskId(taskId);

    try {
        const users = await assignmentsApi.getByTaskId(taskId);
        setSelectedUsers(users);
    } catch {}

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

    if (!confirm("¿Estás seguro de que deseas eliminar esta tarea?")) return;

    try {
        await deleteTask(taskId);
        showMessage("Tarea eliminada correctamente");
        allTasks = await loadAllTasks();
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// EVENTO COMPLETAR TAREA
// ============================================
tasksTable.addEventListener("click", async (event) => {
    const btnComplete = event.target.closest(".btnComplete");
    if (!btnComplete) return;

    event.preventDefault();
    const taskId = btnComplete.getAttribute("data-id");

    try {
        await updateTask(taskId, { status: "completada" });
        showMessage("Tarea marcada como completada");
        allTasks = await loadAllTasks();
    } catch (error) {
        showErrorMessage(error.message);
    }
});

// ============================================
// FILTROS EN TIEMPO REAL
// ============================================
filterTitle.addEventListener("input", () => renderFilteredTasks(allTasks));
filterStatus.addEventListener("change", () => renderFilteredTasks(allTasks));

// ============================================
// EVENTO ORDENAR TAREAS
// ============================================
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
// CARGAR VISTA INICIAL
// ============================================
loadUsers();
