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
// taskForm es el formulario de tareas (traído desde config.js).
// Con addEventListener le pedimos que "escuche" el evento submit:
// cada vez que se le da clic al botón de enviar, se dispara esta
// función. Es async porque por dentro va a hacer peticiones (await).
taskForm.addEventListener("submit", async (event) => {
    // Lo primero es frenar el comportamiento por defecto del navegador,
    // que sería recargar la página completa al hacer submit. Con
    // preventDefault evitamos eso y manejamos todo desde JavaScript.
    event.preventDefault();

    // Acá leemos lo que escribió el usuario en el formulario:
    // título, descripción y estado. El .trim() quita los espacios
    // en blanco de los extremos para no guardar basura.
    const title = taskTitle.value.trim();
    const description = taskDesc.value.trim();
    const status = taskStatus.value;

    // getEditingTaskId() nos dice si estamos editando o creando:
    // - si devuelve null  => el formulario está en modo crear.
    // - si devuelve un id => ya existe una tarea y la estamos actualizando.
    const editingId = getEditingTaskId();

    // Acá tomamos los usuarios que se marcaron para asignar la tarea.
    // getSelectedUserIds() lee el estado interno (userSelectUI.js)
    // de los chips de usuarios seleccionados y solo devuelve sus ids.
    const selectedUserIds = getSelectedUserIds();

    // Limpiamos los mensajes de error de una validación anterior,
    // para que no queden avisos viejos en pantalla mientras se envía.
    setTextContent(titleError, "");
    setTextContent(descError, "");
    setTextContent(statusError, "");
    setTextContent(usersError, "");

    // Vamos validando campo por campo con isValidInput(), que
    // devuelve true solo si el valor llegó sin estar vacío.
    // Si falta el dato, mostramos el error debajo del input,
    // lanzamos una notificación y cortamos con return (no sigue).
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

    // Hay que revisar también que se haya elegido mínimo un usuario,
    // porque una tarea sin nadie asignado no se puede guardar.
    if (!selectedUserIds.length) {
        setTextContent(usersError, "Debe seleccionar al menos un usuario");
        showErrorMessage("Debe seleccionar al menos un usuario");
        return;
    }

    // Todo validado, ahora sí intentamos hacer la petición.
    // El try nos permite capturar cualquier error que salte acá dentro.
    try {
        // ¿Estamos editando? Si editingId trae un valor, la tarea
        // ya existía y lo que sigue es actualizarla. Le pasamos el id
        // en el primer parámetro y el resto de datos en el segundo.
        if (editingId) {
            await updateTaskWithAssignments(editingId, {
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            // Ya terminó la petición. Ahora volvemos el formulario
            // a su estado inicial para que no siga "pegado" en modo edición:
            // 1) Limpiamos el id de edición para cerrar el modo editar.
            setEditingTaskId(null);
            // 2) Reseteamos el formulario y quedan los inputs vacíos.
            taskForm.reset();
            // 3) Quitamos los chips de usuarios que estaban marcados.
            clearSelectedUsers();
            // 4) El botón vuelve a decir "Guardar Tarea".
            setTextContent(
                taskForm.querySelector('button[type="submit"]'),
                "Guardar Tarea",
            );
            // 5) Avisamos con una notificación de éxito...
            showMessage("Tarea actualizada correctamente");
            // 6) ...y recargamos las tareas para ver el cambio en la tabla.
            allTasks = await loadAllTasks();
        } else {
            // Si editingId está vacío, no hay tarea vieja: es una tarea
            // nueva, entonces entramos en modo creación y la mandamos
            // junto con los usuarios a los que se va a asignar.
            await createTaskWithAssignments({
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            // Igual que en actualizar, limpiamos el formulario y los
            // usuarios marcados, avisamos el éxito y recargamos la tabla.
            taskForm.reset();
            clearSelectedUsers();
            showMessage("Tarea registrada correctamente");
            allTasks = await loadAllTasks();
        }
    } catch (error) {
        // Si algo salió mal, mostramos un toast con el mensaje de error
        // que regresó el servidor y no se rompe la aplicación.
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
