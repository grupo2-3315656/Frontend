const TYPE = {
    SUCCESS: "success",
    ERROR: "error",
    INFO: "info",
};

const ICON = {
    [TYPE.SUCCESS]: "✅",
    [TYPE.ERROR]: "❌",
    [TYPE.INFO]: "ℹ️",
};

const getContainer = (container) => {
    if (!container) {
        container = document.getElementById("notifications-container");
        if (!container) {
            container = document.createElement("div");
            container.id = "notifications-container";
            document.body.appendChild(container);
        }
    }
    return container;
};

const notify = (message, type = TYPE.INFO, duration = 1000) => {
    const toast = document.createElement("div");
    toast.className = `notification notification--${type}`;
    toast.setAttribute("role", "alert");

    toast.innerHTML = `
        <span class="notification__icon">${ICON[type]}</span>
        <span class="notification__message">${message}</span>
    `;

    getContainer().appendChild(toast);

    setTimeout(() => dismiss(toast), duration);

    return toast;
};

const dismiss = (toast) => {
    if (!toast || toast.classList.contains("notification--dismissing")) return;
    toast.classList.add("notification--dismissing");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
};

// ===== NOTIFICACIONES (TOASTS) =====
// Muestran un mensaje flotante que desaparece solo después de 1 segundo.
// - showMessage       -> notificación de éxito (✅).
// - showErrorMessage  -> notificación de error (❌).
// - showInfoMessage   -> notificación informativa (ℹ️).
export const showMessage = (message) => notify(message, TYPE.SUCCESS);
export const showErrorMessage = (message) => notify(message, TYPE.ERROR);
export const showInfoMessage = (message) => notify(message, TYPE.INFO);
