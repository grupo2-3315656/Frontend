// Devuelve true solo si el valor no está vacío (después de quitarle
// los espacios). Se usa para validar título, descripción, estado,
// documento del usuario, etc.
export const isValidInput = (value) => {
    return value != null && value.trim() !== "";
};
