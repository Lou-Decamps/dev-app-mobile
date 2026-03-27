/**
 * @fileoverview Custom hook for complete task management.
 * Encapsulates CRUD operations, localStorage persistence, and restore logic.
 */
import { useState, useEffect } from "react";
import { loadFromBackup } from "../data/loadBackup";

const STORAGE_KEY = "todoapp_tasks";

/**
 * Loads the initial tasks from the JSON backup.
 * @returns {import('../data/loadBackup').Task[]}
 */
function getInitialTasks() {
    const { tasks } = loadFromBackup();
    return tasks;
}

/**
 * Parses and reconstructs Date objects from a saved JSON string.
 * @param {string} raw - The raw JSON string from localStorage
 * @returns {import('../data/loadBackup').Task[]}
 */
function parseTasks(raw) {
    return JSON.parse(raw).map((t) => ({
        ...t,
        creationDate: new Date(t.creationDate),
        dueDate: new Date(t.dueDate),
    }));
}

/**
 * Task management hook.
 * Provides all CRUD operations as well as backup logic
 * and restore from localStorage. *
 * @returns {Object} Task management state and functions
 * @returns {import('../data/loadBackup').Task[]} .tasks - The task array
 * @returns {Function} .addTask - Adds a new task
 * @returns {Function} .updateTask - Updates an existing task
 * @returns {Function} .deleteTask - Deletes a task (with confirmation)
 * @returns {Function} .addFolderToTask - Links a folder to a task
 * @returns {boolean} .showRestoreBanner - Displays the restore banner
 * @returns {Function} .handleRestoreYes - Restores from localStorage
 * @returns {Function} .handleRestoreNo - Restores from the backup without restoring
 * @returns {Function} .resetToBackup - Resets all tasks
 */
export function useTasks() {
    const [tasks, setTasks] = useState(getInitialTasks);
    const [showRestoreBanner, setShowRestoreBanner] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setShowRestoreBanner(true);
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    /** @param {import('../data/loadBackup').Task} newTask */
    function addTask(newTask) {
        setTasks((prev) => [...prev, newTask]);
    }
    /** @param {import('../data/loadBackup').Task} updatedTask */
    function updateTask(updatedTask) {
        setTasks((prev) => prev.map((t) =>
            t.id === updatedTask.id ? updatedTask : t
        ));
    }

    /**
     * @param {number} id - The ID of the task to delete
     * @returns {boolean} true if deleted, false if canceled
     */
    function deleteTask(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if (!confirmed) return false;
        setTasks((prev) => prev.filter((t) => t.id !== id));
        return true;
    }

    /**
     * @param {import('../data/loadBackup').Task} task - The target task
     * @param {import('../data/loadBackup').Folder} folder - The folder to link
     */
    function addFolderToTask(task, folder) {
        const alreadyLinked = task.folders?.some((f) => f.id === folder.id);
        if (alreadyLinked) {
            alert("Ce dossier est déjà lié à cette tâche !");
            return;
        }
        updateTask({ ...task, folders: [...(task.folders || []), folder] });
    }

    function handleRestoreYes() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setTasks(parseTasks(saved));
        setShowRestoreBanner(false);
    }

    function handleRestoreNo() {
        const confirmed = window.confirm("Êtes-vous sûr(e) ? Toutes vos modifications seront perdues.");
        if (!confirmed) return;
        localStorage.removeItem(STORAGE_KEY);
        setShowRestoreBanner(false);
    }

    function resetToBackup() {
        const confirmed = window.confirm("Êtes-vous sûr(e) ? Toutes vos modifications seront perdues.");
        if (!confirmed) return;
        localStorage.removeItem(STORAGE_KEY);
        const { tasks: backupTasks } = loadFromBackup();
        setTasks(backupTasks);
    }

    return {
        tasks,
        addTask,
        updateTask,
        deleteTask,
        addFolderToTask,
        showRestoreBanner,
        handleRestoreYes,
        handleRestoreNo,
        resetToBackup,
    };
}