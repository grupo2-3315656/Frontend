// Re-export de las APIs. Ctrl+Enter acá = solo el puente, la real está en:
//   tasksApi      -> tasksApi.js (create, update=PATCH, delete, etc.)
//   assignmentsApi-> assignments.js (relaciones tarea-usuario)
//   usersApi      -> usersApi.js (usuarios)
export { assignmentsApi } from "./assignments.js";
export { tasksApi } from "./tasksApi.js";
export { usersApi } from "./usersApi.js";
