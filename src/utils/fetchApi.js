export const fetchApi = async (url, options = {}) => {
    let response;
    try {
        response = await fetch(url, options);
    } catch {
        throw new Error("Servicio no disponible");
    }

    if (response.ok) {
        const data = await response.json();
        return data;
    }

    let message = `Error (Código: ${response.status})`;
    try {
        const body = await response.json();
        if (body?.error) message = body.error;
    } catch {}

    const error = new Error(message);
    error.status = response.status;
    throw error;
};
