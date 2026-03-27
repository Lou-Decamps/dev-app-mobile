/**
 * @fileoverview Constants for task filters and sorting options.
 */

/**
 * Display filters available for the task list.
 * @readonly
 * @enum {string}
 */
export const FILTERS = {
    ACTIVE: "active",
    ALL: "all",
};

/**
 * Sorting options available for the task list.
 * @readonly
 * @enum {string}
 */
export const SORT_OPTIONS = {
    DUE_DATE:      "dueDate",
    CREATION_DATE: "creationDate",
    NAME:          "name",
};