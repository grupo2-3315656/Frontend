import { usersApi } from "../api/usersApi.js";
import { assignmentsApi } from "../api/assignments.js";

export const searchUser = async (document) => {
    const user = await usersApi.getById(document);
    const tasks = await assignmentsApi.getByUserId(user.id);
    return { user, tasks };
};
