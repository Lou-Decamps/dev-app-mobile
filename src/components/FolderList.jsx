/**
 * @fileoverview List of folders with actions.
 */

/**
 * Displays a list of all folders with an edit button
 * and navigation to a folder's details.
 * @param {Object} props
 * @param {Object[]} props.folders - Array of folders to display
 * @param {Function} props.onFolderClick - Callback on click of a folder (opens the details)
 * @param {Function} props.onFolderEdit - Callback on click of the edit button
 */
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
                    onClick={() => onFolderClick(folder)}
                >
                    {folder.icon && (
                        <span className="folder__icon">{folder.icon}</span>
                    )}
                    <div
                        className="folder__color-dot"
                        style={{ backgroundColor: `var(--folder-color-${folder.color})` }}
                    />
                    <span className="folder__title">{folder.title}</span>
                    <button
                        type="button"
                        className="folder__edit-btn"
                        onClick={(e) => { e.stopPropagation(); onFolderEdit(folder); }}
                    >
                        Modifier
                    </button>
                </li>
            ))}
        </ul>
    );
}