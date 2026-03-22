import { useState, useEffect } from "react";
import { loadFromBackup } from "../data/loadBackup";

const STORAGE_KEY = "todoapp_tasks";

function getInitialTasks() {
    const { tasks } = loadFromBackup();
    return tasks;
}

function parseTasks(raw) {
    return JSON.parse(raw).map((t) => ({
        ...t,
        creationDate: new Date(t.creationDate),
        dueDate: new Date(t.dueDate),
    }));
}

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

    function addTask(newTask) {
        setTasks((prev) => [...prev, newTask]);
    }

    function updateTask(updatedTask) {
        setTasks((prev) => prev.map((t) =>
            t.id === updatedTask.id ? updatedTask : t
        ));
    }

    function deleteTask(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if (!confirmed) return false;
        setTasks((prev) => prev.filter((t) => t.id !== id));
        return true;
    }

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