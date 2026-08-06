// ===== BARREL UI =====
// Ctrl+Enter aquí -> archivo real:
//   showMessage / showErrorMessage / showInfoMessage -> notifications.js
//   getSelectedUserIds / clearSelectedUsers / setSelectedUsers -> userSelectUI.js
//   setTextContent -> setTextContent.js | setInnerHtml -> setInnerHtml.js
//   toggleTaskForm -> toggleTaskForm.js | clearTasks -> clearTasks.js
//   showEmptyTasks -> showEmptyTasks.js | addTaskToTable -> addTaskToTable.js
//   showUserInfo -> showUserInfo.js | handleExportTasks -> exportTasksUI.js
export { extractTasksFromDOM } from "./extractTasksFromDOM.js";
export { tasksOrderBar } from "./taskOrderBar.js";
export { toggleTaskForm } from "./toggleTaskForm.js";
export { clearTasks } from "./clearTasks.js";
export { showUserInfo } from "./showUserInfo.js";
export { addTaskToTable } from "./addTaskToTable.js";
export { showMessage, showErrorMessage, showInfoMessage } from "./notifications.js";
export { showEmptyTasks } from "./showEmptyTasks.js";
export { setInnerHtml } from "./setInnerHtml.js";
export { setTextContent } from "./setTextContent.js";
export { handleExportTasks } from "./exportTasksUI.js";
export { getSelectedUserIds, clearSelectedUsers, setSelectedUsers } from "./userSelectUI.js";
export { renderUsersTable } from "./usersTable.js";
export { renderAdminTasks } from "./adminTasksTable.js";
