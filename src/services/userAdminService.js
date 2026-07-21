import { usersApi } from "../api/index.js";

export const getAllUsers = async () => {
    return await usersApi.get();
};

export const createUser = async (userData) => {
    const newUser = {
        ...userData,
        date: new Date().toISOString(),
    };
    return await usersApi.create(newUser);
};

export const updateUser = async (id, userData) => {
    return await usersApi.update(id, userData);
};

export const deleteUser = async (id) => {
    return await usersApi.delete(id);
};
