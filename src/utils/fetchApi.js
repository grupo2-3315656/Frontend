// Esta es la "mensajera" del proyecto: todas las APIs la usan para
// hablar con el backend. Recibe la URL a la que llamar y las opciones
// (método, headers, body), hace el fetch y devuelve los datos, o
// lanza un error si algo sale mal.
export const fetchApi = async (url, options = {}) => {
    let response;

    try {
        // Intentamos conectarnos con el servidor.
        response = await fetch(url, options);
    } catch {
        // Si el servidor no responde (API apagada, red caída),
        // tiramos un error genérico para avisar al usuario.
        throw new Error("Servicio no disponible");
    }

    // Respuesta sin problemas (2xx): devolvemos los datos en JSON.
    if (response.ok) {
        const data = await response.json();
        return data;
    }

    // Si llegó acá es que el servidor respondió con un error
    // (ej: 404, 500). Intentamos leer el mensaje del cuerpo...
    let message = `Error (Código: ${response.status})`;
    try {
        const body = await response.json();
        if (body?.error) message = body.error;
    } catch {}

    // ...lo convertimos en un Error (con su status HTTP) y lo lanzamos,
    // para que el catch del flujo lo muestre en pantalla.
    const error = new Error(message);
    error.status = response.status;
    throw error;
};
