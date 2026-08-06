// ===== VALIDACIÓN DE CAMPOS =====
// Devuelve true si el valor existe y no está vacío (después de quitar
// espacios). Se usa para validar título, descripción, estado, usuario, etc.
export const isValidInput = (value) => {
    return value != null && value.trim() !== "";
};
