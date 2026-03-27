/**
 * Custom @fileoverview hook for full folder management.
 * Encapsulates CRUD operations and localStorage persistence.
 */

import { useState, useEffect } from "react";
import { loadFromBackup } from "../data/loadBackup";

const STORAGE_KEY_FOLDERS = "todoapp_folders";

/**
 * Loads the initial folders from localStorage or the JSON backup.
 * @returns {import('../data/loadBackup').Folder[]}
 */
function getInitialFolders() {
    const saved = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (saved) return JSON.parse(saved);
    const { folders } = loadFromBackup();
    return folders;
}

/**
 * Folder management hook.
 * Provides CRUD operations and automatic persistence in localStorage.
 * @returns {Object} Folder management state and functions
 * @returns {import('../data/loadBackup').Folder[]} .folders - The folder array
 * @returns {Function} .addFolder - Adds a new folder
 * @returns {Function} .updateFolder - Updates an existing folder
 * @returns {Function} .deleteFolder - Deletes a folder (with confirmation)
 */
export function useFolders() {
    const [folders, setFolders] = useState(getInitialFolders);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    }, [folders]);

    /** @param {import('../data/loadBackup').Folder} newFolder */
    function addFolder(newFolder) {
        setFolders((prev) => [...prev, newFolder]);
    }

    /** @param {import('../data/loadBackup').Folder} updatedFolder */
    function updateFolder(updatedFolder) {
        setFolders((prev) => prev.map((f) =>
            f.id === updatedFolder.id ? updatedFolder : f
        ));
    }

    /**
     * @param {number} id - The identifier of the folder to delete
     * @returns {boolean} true if deleted, false if canceled
     */
    function deleteFolder(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?");
        if (!confirmed) return false;
        setFolders((prev) => prev.filter((f) => f.id !== id));
        return true;
    }

    return { folders, addFolder, updateFolder, deleteFolder };
}