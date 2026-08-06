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
// taskForm es el formulario de tareas (la referencia al <form> viene de
// config.js). Con addEventListener le agregamos un "listener" (un oyente)
// del evento submit: cada vez que se pulsa el botón de enviar, se dispara
// esta función. Es async porque por dentro va a esperar peticiones con
// await, y recibe "event", que trae la información del envío.
taskForm.addEventListener("submit", async (event) => {
    // event.preventDefault() le dice al navegador: "no hagas lo que harías
    // por defecto", que sería recargar la página completa al hacer submit.
    // Así el envío lo controlamos nosotros desde JavaScript sin recargar.
    event.preventDefault();

    // taskTitle.value toma lo que el usuario escribió en el input del
    // título. El .trim() le quita los espacios de los lados y el resultado
    // se guarda en la variable "title" para validarlo y mandarlo después.
    const title = taskTitle.value.trim();
    // Igual que el título: taskDesc.value lee el textarea de la descripción,
    // .trim() lo limpia y queda guardado en "description".
    const description = taskDesc.value.trim();
    // taskStatus.value lee la opción que se eligió en el select del estado
    // (pendiente / en progreso / completada) y queda en "status".
    const status = taskStatus.value;

    // getEditingTaskId() devuelve lo que esté guardado en la memoria del
    // proyecto (config.js). Si devuelve null, el formulario está en modo
    // crear; si devuelve un id, ese es el de la tarea a actualizar.
    const editingId = getEditingTaskId();

    // getSelectedUserIds() lee el estado interno de los usuarios marcados
    // (userSelectUI.js) y devuelve solo sus ids en un arreglo. Se usan
    // después para asignarle la tarea a esos usuarios.
    const selectedUserIds = getSelectedUserIds();

    // setTextContent(elemento, "") escribe un texto en el elemento: acá lo
    // dejamos vacío, o sea se borran los mensajes de error que hayan quedado
    // de una validación anterior (título, descripción, estado y usuarios).
    setTextContent(titleError, "");
    setTextContent(descError, "");
    setTextContent(statusError, "");
    setTextContent(usersError, "");

    // if (!isValidInput(title)) es "si el título NO es válido". isValidInput()
    // devuelve true solo cuando el valor no está vacío; el "!" invierte esa
    // respuesta, así que la condición se cumple cuando el título está vacío.
    // De cumplirse: se escribe el aviso debajo del input (setTextContent),
    // se lanza un toast de error (showErrorMessage) y el return corta la
    // función acá: nada de lo que sigue se ejecuta.
    if (!isValidInput(title)) {
        // setTextContent escribe el mensaje dentro del elemento titleError,
        // que es el <p> rojo que está debajo del input del título.
        setTextContent(titleError, "Debe ingresar un título");
        // showErrorMessage manda una notificación (toast rojo) arriba.
        showErrorMessage("Debe ingresar un título");
        // return detiene todo el flujo: no pasa a la validación que sigue.
        return;
    }

    // Lo mismo para la descripción: si está vacía, avisa y corta el flujo.
    if (!isValidInput(description)) {
        setTextContent(descError, "Debe ingresar una descripción");
        showErrorMessage("Debe ingresar una descripción");
        return;
    }

    // Y lo mismo para el estado: el select tiene que traer una opción elegida.
    if (!isValidInput(status)) {
        setTextContent(statusError, "Debe seleccionar un estado");
        showErrorMessage("Debe seleccionar un estado");
        return;
    }

    // if (!selectedUserIds.length) revisa si el arreglo de ids está vacío.
    // .length es la cantidad de elementos (0 si no se eligió nadie) y el "!"
    // lo invierte, entonces entra cuando NO hay usuarios seleccionados:
    // avisa que mínimo debe elegir uno y corta la función.
    if (!selectedUserIds.length) {
        setTextContent(usersError, "Debe seleccionar al menos un usuario");
        showErrorMessage("Debe seleccionar al menos un usuario");
        return;
    }

    // Todo pasó la validación. Dentro del try se intenta la petición y, si
    // algo sale mal, el error queda capturado en el catch de abajo.
    try {
        // if (editingId) pregunta "¿hay una tarea en edición?". Si editingId
        // trae un id, el formulario está en modo editar y entramos acá.
        if (editingId) {
            // await updateTaskWithAssignments(editingId, {...}) llama a la
            // función que actualiza la tarea. El primer parámetro es el id
            // de la tarea que se va a modificar; el segundo es un objeto con
            // los datos: userIds (los usuarios a asignar), title, description
            // y status. El await espera la respuesta del backend.
            await updateTaskWithAssignments(editingId, {
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            // Ya respondió el backend. Ahora se hace la limpieza para que el
            // formulario no quede "pegado" en modo edición:
            // setEditingTaskId(null) borra el id guardado: el formulario
            // vuelve a quedar en modo crear para el próximo registro.
            setEditingTaskId(null);
            // taskForm.reset() resetea el formulario: borra todo lo que
            // había en los inputs y los deja como nuevos.
            taskForm.reset();
            // clearSelectedUsers() vacía los chips de usuarios marcados y
            // deja la selección de usuarios en cero.
            clearSelectedUsers();
            // setTextContent(...) cambia el texto del botón de enviar:
            // estaba en "Actualizar Tarea" y vuelve a "Guardar Tarea".
            setTextContent(
                taskForm.querySelector('button[type="submit"]'),
                "Guardar Tarea",
            );
            // showMessage muestra una notificación de éxito (toast verde).
            showMessage("Tarea actualizada correctamente");
            // allTasks = await loadAllTasks() vuelve a pedir todas las tareas
            // al backend (ya con el cambio aplicado) y se pinta la tabla de
            // nuevo para que se vea la tarea actualizada.
            allTasks = await loadAllTasks();
        } else {
            // else: si editingId no trae ningún id, no hay tarea en edición,
            // entonces es una tarea nueva y entramos en modo creación.
            // createTaskWithAssignments({...}) manda a guardar la tarea nueva
            // con el objeto de datos: userIds son los ids de los usuarios a
            // los que se le asigna y van title, description y status.
            await createTaskWithAssignments({
                userIds: selectedUserIds,
                title,
                description,
                status,
            });

            // Igual que en actualizar: se resetea el formulario, se limpian
            // los usuarios asignados, se avisa el éxito y se recarga la tabla.
            taskForm.reset();
            clearSelectedUsers();
            showMessage("Tarea registrada correctamente");
            allTasks = await loadAllTasks();
        }
    } catch (error) {
        // catch (error) captura el error si algo falló dentro del try.
        // error.message es el mensaje que vino del backend y showErrorMessage
        // lo muestra como toast de error para que el usuario sepa qué pasó.
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
