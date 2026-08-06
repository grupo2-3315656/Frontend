// // =======================================================
// // BARREL FILE - EXPORTA TODOS LOS MÓDULOS
// // =======================================================
// Ojo: al hacer Ctrl+Enter sobre un import en app.js se llega primero a
// este archivo (y a los index.js de cada carpeta). Es un "re-export":
// aquí no hay lógica, solo pasamos lo que exportan otros archivos.
// Para encontrar la función real hay que seguir hasta:
//   services/config.js  -> apiUrl, taskForm, getEditingTaskId, etc.
//   services/index.js   -> loadAllTasks, updateTaskWithAssignments, etc.
//   ui/index.js         -> showMessage, clearTasks, setTextContent, etc.
//   utils/index.js      -> isValidInput, fetchApi, etc.
//   api/index.js        -> tasksApi, assignmentsApi, usersApi.

export * from "./services/config.js";
export * from "./services/index.js";
export * from "./ui/index.js";
export * from "./utils/index.js";
export * from "./api/index.js";
