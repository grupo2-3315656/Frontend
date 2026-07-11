export const handleApiError = async (response, defaultMessage, statusMap = {}) => {
    if (response.ok) return await response.json();

    let errorText = statusMap[response.status] || defaultMessage;
    const error = new Error(`${errorText} (Código: ${response.status})`);
    error.status = response.status;
    throw error;
};
