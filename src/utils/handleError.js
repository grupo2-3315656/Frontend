import { showErrorMessage } from "../ui/notifications.js";

export const handleError = (error) => {
    const type = classifyError(error);
    console.error(`[${type}]`, error);
    showErrorMessage(error.message);
};

const classifyError = (error) => {
    if (error.status) return error.status;
    if (error.message === "Servicio no disponible") return "NETWORK";
    return "UNKNOWN";
};
