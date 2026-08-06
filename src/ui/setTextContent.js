// Pequeña ayuda de texto con doble uso:
// - si le pasan un value, lo escribe dentro del elemento.
// - si no le pasan nada, devuelve el texto actual del elemento
//   (sirve para leer el título/descripción al momento de editar).
export const setTextContent = (element, value) => {
    if (value === undefined) {
        return element.textContent;
    }
    element.textContent = value;
};
