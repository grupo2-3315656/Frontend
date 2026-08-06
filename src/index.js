// // =======================================================
// // BARREL FILE - EXPORTA TODOS LOS MÓDULOS
// // =======================================================
// Al hacer Ctrl+Enter sobre un import en app.js se llega primero
// a este archivo. Cada export re-exporta desde otro archivo real:
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
