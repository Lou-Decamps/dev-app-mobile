import backupData from "./backup.json";

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