// ===== UTILIDAD DE TEXTO =====
// Doble función: si se pasa value, lo escribe como texto del elemento
// (element.textContent = value). Si NO se pasa, devuelve el texto actual
// del elemento (se usa para leer el título/descripción al editar).
export const setTextContent = (element, value) => {
    if (value === undefined) {
        return element.textContent;
    }
    element.textContent = value;
};
