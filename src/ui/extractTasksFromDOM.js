export const extractTasksFromDOM = () => {
    const cards = document.querySelectorAll("#tasks-table > .message-card");
    return Array.from(cards).map((card) => ({
        id: card.id,
        title: card.querySelector(".message-card__title").textContent,
        description: card.querySelector(".message-card__content").textContent,
        status: card.querySelector(".task-badge").className.match(/task-badge--(\S+)/)[1],
        date: card.dataset.date || "",
        element: card,
    }));
};
