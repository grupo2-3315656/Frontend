import { getAllUsers } from "../api/getUsers.js";
import { deleteUserById } from "../api/deleteUser.js";

export const loadUsers = async () => {
    return getAllUsers();
};

export const deleteUser = async (id) => {
    return deleteUserById(id);
};
