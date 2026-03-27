/**
 * @fileoverview Loading and transforming data from the JSON backup file.
 */
import backupData from "./backup.json";

/**
 * @typedef {Object} Task
 * @property {number} id - Unique task identifier
 * @property {string} title - Task title (minimum 5 characters)
 * @property {string} description - Optional description
 * @property {Date} creationDate - Creation date (automatic)
 * @property {Date} dueDate - Due date (required)
 * @property {string} status - Status among the values ​​of TaskStatus
 * @property {Object[]} teammates - List of teammates
 * @property {Folder[]} folders - Folders linked to this task
 */

/**
 * @typedef {Object} Folder
 * @property {number} id - Unique folder identifier
 * @property {string} title - Folder name (minimum 3 characters)
 * @property {string} description - Optional description
 * @property {string} color - Color from the values ​​of FOLDER_COLORS
 * @property {string} icon - Emoji icon (can be empty)
 */

/**
 * Loads and transforms the data from the backup.json file.
 * Resolves task↔folder relationships and converts string dates into Date objects.
 * @returns {{ tasks: Task[], folders: Folder[] }} Ready-to-use tasks and folders
 * @example
 * const { tasks, folders } = loadFromBackup();
 * console.log(tasks[0].dueDate instanceof Date); // → true
 */
export function loadFromBackup() {
    const { taches, dossiers, relations } = backupData;

    const tasks = taches.map((t) => {
        const taskFolderIds = relations
            .filter((r) => r.tache === t.id)
            .map((r) => r.dossier);

        const taskFolders = dossiers.filter((d) =>
            taskFolderIds.includes(d.id)
        );

        return {
            id: t.id,
            title: t.title,
            description: t.description || "",
            creationDate: new Date(t.date_creation),
            dueDate: new Date(t.date_echeance),
            status: t.etat,
            teammates: t.equipiers || [],
            folders: taskFolders,
        };
    });

    return { tasks, folders: dossiers };
}