// Re-export de todos los services. Si Ctrl+Enter te trae hasta aquí,
// buscá dónde vive cada función:
//   taskService.js     -> createTask, createTaskWithAssignments, updateTask, updateTaskWithAssignments, deleteTask
//   renderService.js   -> renderFilteredTasks, loadAllTasks
//   adminService.js    -> getAllTasksWithUsers, loadAdminTasks, renderFilteredAdminTasks
//   userService.js     -> searchUser, loadUsers, handleEditUser, handleDeleteUser
//   filterService.js   -> filterTasksList, filterAdminTasks
//   taskOrderService.js-> sortTasks
//   viewService.js     -> switchView
export { searchUser, loadUsers, handleEditUser, handleDeleteUser } from "./userService.js";
export { createTask, createTaskWithAssignments, updateTask, updateTaskWithAssignments, deleteTask } from "./taskService.js";
export { filterTasksList, filterAdminTasks } from "./filterService.js";
export { sortTasks } from "./taskOrderService.js";
export { renderFilteredTasks, loadAllTasks } from "./renderService.js";
export { getAllUsers, createUser, updateUser, deleteUser } from "./userAdminService.js";
export { getAllTasksWithUsers, loadAdminTasks, renderFilteredAdminTasks } from "./adminService.js";
export { switchView } from "./viewService.js";
export * from "./config.js";
