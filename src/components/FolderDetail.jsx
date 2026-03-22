export default function FolderDetail({ folder, tasks, onBack, onTaskClick }) {
    const folderTasks = tasks.filter((t) =>
        t.folders && t.folders.some((f) => f.id === folder.id)
    );

    return (
        <main className="app__content">
            <div className="folder-detail__header">
                <button
                    type="button"
                    className="folder-detail__back"
                    onClick={onBack}
                >
                    ← Retour
                </button>
                <div className="folder-detail__title-row">
                    {folder.icon && (
                        <span className="folder-detail__icon">{folder.icon}</span>
                    )}
                    <div
                        className="folder__color-dot"
                        style={{ backgroundColor: `var(--folder-color-${folder.color})` }}
                    />
                    <h2 className="folder-detail__title">{folder.title}</h2>
                </div>

                {folder.description && (
                    <p className="folder-detail__description">{folder.description}</p>
                )}

                <span className="folder-detail__count">
                    {folderTasks.length} tâche(s)
                </span>
            </div>

            {folderTasks.length === 0 ? (
                <p className="task__empty">Aucune tâche dans ce dossier.</p>
            ) : (
                <ul className="task__list">
                    {folderTasks.map((t) => (
                        <li
                            key={t.id}
                            className="task task--clickable"
                            onClick={() => onTaskClick(t)}
                        >
                            <span className="task__title">{t.title}</span>
                            <span className="task__status">{t.status}</span>
                        </li>
                    ))}
                </ul>
            )}
        </main>
    );
}