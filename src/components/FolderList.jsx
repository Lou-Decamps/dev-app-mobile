export default function FolderList({ folders, onFolderClick, onFolderEdit }) {
    if (folders.length === 0) {
        return (
            <p className="task__empty">
                Aucun dossier. Clique sur + Dossier pour commencer !
            </p>
        );
    }

    return (
        <ul className="folder__list">
            {folders.map((folder) => (
                <li
                    key={folder.id}
                    className="folder folder--clickable"
                    onClick={() => onFolderClick(folder)}   // clic → page dédiée
                >
                    <div
                        className="folder__color-dot"
                        style={{ backgroundColor: `var(--folder-color-${folder.color})` }}
                    />
                    <span className="folder__title">{folder.title}</span>

                    {}
                    <button
                        type="button"
                        className="folder__edit-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            onFolderEdit(folder);
                        }}
                    >
                        ✎
                    </button>
                </li>
            ))}
        </ul>
    );
}