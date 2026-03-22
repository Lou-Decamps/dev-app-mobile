export function isNotExpired(task) {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - (24 * 60 * 60 * 1000) * 7);
    return new Date(task.dueDate) > oneWeekAgo;
}
export function getDisplayedTasks(tasks, {
    activeFilter,
    selectedStatuses,
    selectedFolderIds,
    sortBy,
    FILTERS,
    SORT_OPTIONS,
    COMPLETED_STATUS,
}) {
    let result = [...tasks];

    if (selectedStatuses.length > 0) {
        result = result.filter((t) => selectedStatuses.includes(t.status));
    } else if (activeFilter === FILTERS.ACTIVE) {
        result = result.filter((t) => !COMPLETED_STATUS.includes(t.status));
    }

    if (selectedFolderIds.length > 0) {
        result = result.filter((t) =>
            t.folders && t.folders.some((f) => selectedFolderIds.includes(f.id))
        );
    }

    result.sort((a, b) => {
        if (sortBy === SORT_OPTIONS.NAME) return a.title.localeCompare(b.title);
        if (sortBy === SORT_OPTIONS.CREATION_DATE) return new Date(a.creationDate) - new Date(b.creationDate);
        return new Date(a.dueDate) - new Date(b.dueDate);
    });

    result = result.filter(isNotExpired);

    return result;
}