/**
 * @fileoverview Utility functions for filtering and sorting tasks.
 * These functions are pure — they do not depend on any React state.
 */

/**
 * Checks if a task has not expired for more than a week.
 * @param {Object} task - The task to check
 * @param {Date|string} task.dueDate - The task's due date
 * @returns {boolean} true if the task is still viewable, false otherwise
 */
export function isNotExpired(task) {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - (24 * 60 * 60 * 1000) * 7);
    return new Date(task.dueDate) > oneWeekAgo;
}

/**

 * Filter, filter by folder, and sort a task list
 * according to the provided criteria.
 *
 * @param {Object[]} tasks - The complete array of tasks
 * @param {Object} options - The filtering and sorting criteria
 * @param {string} options.activeFilter - The active filter ("active" or "all")
 * @param {string[]} options.selectedStatuses - The selected statuses ([] = none)
 * @param {number[]} options.selectedFolderIds - The filtered folder IDs ([] = none)
 * @param {string} options.sortBy - The sorting criterion
 * @param {Object} options.FILTERS - The FILTERS constants
 * @param {Object} options.SORT_OPTIONS - The SORT_OPTIONS constants
 * @param {string[]} options.COMPLETED_STATUS - The statuses considered completed
 * @returns {Object[]} The filtered and sorted array of tasks
 */
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