import { useState, useEffect } from "react";
import { loadFromBackup } from "../data/loadBackup";

const STORAGE_KEY_FOLDERS = "todoapp_folders";

function getInitialFolders() {
    const saved = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (saved) return JSON.parse(saved);
    const { folders } = loadFromBackup();
    return folders;
}

export function useFolders() {
    const [folders, setFolders] = useState(getInitialFolders);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    }, [folders]);

    function addFolder(newFolder) {
        setFolders((prev) => [...prev, newFolder]);
    }

    function updateFolder(updatedFolder) {
        setFolders((prev) => prev.map((f) =>
            f.id === updatedFolder.id ? updatedFolder : f
        ));
    }

    function deleteFolder(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?");
        if (!confirmed) return false;
        setFolders((prev) => prev.filter((f) => f.id !== id));
        return true;
    }

    return { folders, addFolder, updateFolder, deleteFolder };
}