import { getAllUsers } from "../api/getUsers.js";

export const loadUsers = async () => {
    return getAllUsers();
};
