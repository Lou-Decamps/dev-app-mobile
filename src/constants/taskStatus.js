/**
 * @fileoverview Constants for the possible statuses of a task.
 */

/**
 * Enumeration of the possible statuses of a task.
 * These values ​​correspond to the data in the backup.json file.
 * @readonly
 * @enum {string}
 */
export const TaskStatus = {
    TO_DO: "Nouveau",
    IN_PROGRESS: "En attente",
    PAUSED: "En pause",
    FINISHED: "Réussi",
    ABANDONED: "Abandonné",
};

/**
 * List of statuses considered "completed".
 * Used for the default filter (hiding completed tasks).
 * @type {string[]}
 */
export const COMPLETED_STATUS = [TaskStatus.FINISHED, TaskStatus.ABANDONED];