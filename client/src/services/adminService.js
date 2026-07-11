import { getAllUsers } from "../api/getUsers.js";
import { deleteUserById } from "../api/deleteUser.js";
import { updateUserById } from "../api/updateUser.js";

export const loadUsers = async () => {
    return getAllUsers();
};

export const deleteUser = async (id) => {
    return deleteUserById(id);
};

export const updateUser = async (id, data) => {
    return updateUserById(id, data);
};
