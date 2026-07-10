let selectedUserIds = [];

export const getSelectedUserIds = () => [...selectedUserIds];

export const setSelectedUserIds = (ids) => {
    selectedUserIds = [...ids];
};

export const toggleUserSelection = (id) => {
    const index = selectedUserIds.indexOf(id);
    if (index === -1) {
        selectedUserIds.push(id);
    } else {
        selectedUserIds.splice(index, 1);
    }
};

export const selectAllUsers = (ids) => {
    selectedUserIds = [...ids];
};

export const clearUserSelection = () => {
    selectedUserIds = [];
};

export const validateUserSelection = () => {
    return selectedUserIds.length > 0;
};
