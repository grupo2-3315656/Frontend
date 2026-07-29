import { navTabs } from "./config.js";

export const switchView = async ({ viewId, onLoadUsers, onLoadAdminTasks, onLoadAllTasks }) => {
    document.querySelectorAll(".view").forEach((v) => {
        v.style.display = "none";
    });
    navTabs.forEach((tab) => {
        tab.classList.remove("nav__tab--active");
    });

    const targetView = document.getElementById(viewId);
    if (targetView) {
        targetView.style.display = "";
    }

    const activeTab = document.querySelector(`[data-view="${viewId}"]`);
    if (activeTab) {
        activeTab.classList.add("nav__tab--active");
    }

    if (viewId === "view-users") {
        await onLoadUsers();
    } else if (viewId === "view-admin") {
        await onLoadAdminTasks();
    } else if (viewId === "view-tasks") {
        await onLoadAllTasks();
    }
};
