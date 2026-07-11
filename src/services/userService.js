import { getUserByDocument } from "../api/getUser.js";
import { getUserTasks } from "../api/getUserTasks.js";

export const searchUser = async (document) => {
    const user = await getUserByDocument(document);
    const tasks = await getUserTasks(user.id);
    return { user, tasks };
};
