// ===== CAPA HTTP (fetchApi) =====
// Función genérica que usan todas las APIs para hacer peticiones
// al backend. Recibe la URL y las opciones (method, headers, body).
export const fetchApi = async (url, options = {}) => {
    let response;

    try {
        // Intenta conectarse con el servidor con fetch.
        response = await fetch(url, options);
    } catch {
        // Si el servidor no responde (red caída / API apagada),
        // lanza un error genérico.
        throw new Error("Servicio no disponible");
    }

    // Si la respuesta es satisfactoria (2xx), devuelve los datos en JSON.
    if (response.ok) {
        const data = await response.json();
        return data;
    }

    // Si el servidor devolvió un error (ej: 404, 500):
    // intenta leer el mensaje de error del cuerpo de la respuesta.
    let message = `Error (Código: ${response.status})`;
    try {
        const body = await response.json();
        if (body?.error) message = body.error;
    } catch {}

    // Crea el error, le guarda el status HTTP y lo lanza
    // para que el catch del flujo lo muestre en pantalla.
    const error = new Error(message);
    error.status = response.status;
    throw error;
};
