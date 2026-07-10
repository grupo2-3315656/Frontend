export const renderAdminTable = (users) => {
    const tbody = document.getElementById("admin-table-body");
    tbody.innerHTML = "";

    users.forEach((user) => {
        const tr = document.createElement("tr");
        tr.dataset.id = user.id;

        const statusClass = user.status === "activo" ? "status-badge--activo" : "status-badge--inactivo";
        const statusText = user.status === "activo" ? "Activo" : "Inactivo";

        tr.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="admin-actions">
                <button type="button" class="btn btn--sm btn--edit" data-id="${user.id}">Editar</button>
                <button type="button" class="btn btn--sm btn--delete" data-id="${user.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
};
