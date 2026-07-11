const STATUS_LABELS = {
    "pendiente": "Pendiente",
    "en-progreso": "En Progreso",
    "completada": "Completada",
};

export const getStatusLabel = (status) => STATUS_LABELS[status] || "Sin estado";
