import { usersApi } from "../api/usersApi.js";

export const getAllUsers = async () => {
    return await usersApi.get();
};

export const getUserById = async (id) => {
    return await usersApi.getById(id);
};

export const createUser = async (userData) => {
    return await usersApi.create(userData);
};

export const updateUser = async (id, userData) => {
    return await usersApi.update(id, userData);
};

export const deleteUser = async (id) => {
    return await usersApi.delete(id);
};
