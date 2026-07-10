export const renderUserMultiSelect = (users) => {
    const container = document.getElementById("user-multiselect-container");
    if (!container) return;

    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "multiselect-header";

    const title = document.createElement("h3");
    title.className = "card__title";
    title.textContent = "Seleccionar Usuarios";
    header.appendChild(title);

    const selectAllLabel = document.createElement("label");
    selectAllLabel.className = "multiselect-select-all";
    const selectAllCheck = document.createElement("input");
    selectAllCheck.type = "checkbox";
    selectAllCheck.id = "multiselect-select-all";
    selectAllLabel.appendChild(selectAllCheck);
    selectAllLabel.appendChild(document.createTextNode(" Seleccionar Todos"));
    header.appendChild(selectAllLabel);

    const counter = document.createElement("span");
    counter.id = "multiselect-counter";
    counter.className = "multiselect-counter";
    header.appendChild(counter);

    container.appendChild(header);

    const errorMsg = document.createElement("p");
    errorMsg.id = "multiselect-error";
    errorMsg.className = "form__error";
    errorMsg.style.display = "none";
    container.appendChild(errorMsg);

    const list = document.createElement("div");
    list.className = "multiselect-list";

    users.forEach((user) => {
        const item = document.createElement("label");
        item.className = "multiselect-item";

        const check = document.createElement("input");
        check.type = "checkbox";
        check.className = "user-check";
        check.value = user.id;

        const nameSpan = document.createElement("span");
        nameSpan.textContent = `${user.name} (${user.email})`;

        item.appendChild(check);
        item.appendChild(nameSpan);
        list.appendChild(item);
    });

    container.appendChild(list);

    const validateBtn = document.createElement("button");
    validateBtn.type = "button";
    validateBtn.className = "btn btn--primary";
    validateBtn.id = "btn-validate-selection";
    validateBtn.textContent = "Confirmar Selección";
    container.appendChild(validateBtn);
};
