import { showErrorMessage } from "../ui/notifications.js";

export const handleError = (error) => {
    showErrorMessage(error.message);
    console.error(error);
};
