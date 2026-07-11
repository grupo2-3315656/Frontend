export const setTextContent = (element, value) => {
    if (value === undefined) {
        return element.textContent;
    }
    element.textContent = value;
};
