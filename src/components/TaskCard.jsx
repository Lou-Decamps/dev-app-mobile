import { useState } from "react";

export default function TaskCard({
                                     task,
                                     isExpanded,
                                     onToggle,
                                     onUpdate,
                                     onAddFolder,
                                     folders,
                                 }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editDueDate, setEditDueDate] = useState(
        task.dueDate instanceof Date
            ? task.dueDate.toISOString().split("T")[0]
            : task.dueDate
    );

    const firstTwoFolders = task.folders ? task.folders.slice(0, 2) : [];
    const extraFolders = task.folders ? task.folders.length - 2 : 0;

    function formatDate(date) {
        if (!date) return "";
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString("fr-FR");
    }

    function handleSaveEdit() {
        if (editTitle.trim().length < 5) {
            alert("Le titre doit faire au moins 5 caractères !");
            return;
        }
        onUpdate({
            ...task,
            title: editTitle.trim(),
            description: editDescription.trim(),
            dueDate: new Date(editDueDate),
        });
        setIsEditing(false);
    }

    function handleCancelEdit() {
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditDueDate(
            task.dueDate instanceof Date
                ? task.dueDate.toISOString().split("T")[0]
                : task.dueDate
        );
        setIsEditing(false);
    }

    return (
        <li className={`task ${isExpanded ? "task--expanded" : ""}`}>

            <div className="task__main">

                <button
                    type="button"
                    className={`task__toggle ${isExpanded ? "task__toggle--open" : ""}`}
                    onClick={onToggle}
                >
                    ▶
                </button>

                {isEditing ? (
                    <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="task__edit-input task__edit-input--title"
                        onClick={(e) => e.stopPropagation()}
                    />
                ) : (
                    <span className="task__title">{task.title}</span>
                )}

                <span className="task__status">{task.status}</span>
            </div>

            {!isEditing && (
                <div className="task__meta">
                    <span className="task__date"> {formatDate(task.dueDate)}</span>
                    <div className="task__folders-preview">
                        {firstTwoFolders.map((f) => (
                            <span
                                key={f.id}
                                className="task__folder-tag"
                                style={{ borderColor: `var(--folder-color-${f.color})` }}
                            >
                                {f.title}
                            </span>
                        ))}
                        {extraFolders > 0 && (
                            <span className="task__folder-extra">+{extraFolders}</span>
                        )}
                    </div>
                </div>
            )}

            {isExpanded && (
                <div className="task__expanded-content">

                    {isEditing ? (
                        <div className="task__edit-form">
                            <label className="task__edit-label">
                                Description
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="task__edit-input task__edit-input--textarea"
                                />
                            </label>
                            <label className="task__edit-label">
                                Date d'échéance
                                <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                    className="task__edit-input"
                                />
                            </label>
                            <div className="task__edit-actions">
                                <button
                                    type="button"
                                    className="task__action-btn task__action-btn--cancel"
                                    onClick={handleCancelEdit}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="button"
                                    className="task__action-btn task__action-btn--save"
                                    onClick={handleSaveEdit}
                                >
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {task.folders && task.folders.length > 0 && (
                                <div className="task__folders-all">
                                    {task.folders.map((f) => (
                                        <span
                                            key={f.id}
                                            className="task__folder-tag"
                                            style={{ borderColor: `var(--folder-color-${f.color})` }}
                                        >
                                            {f.title}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {task.description && (
                                <p className="task__description">{task.description}</p>
                            )}
                            {!task.description && (
                                <p className="task__description task__description--empty">
                                    Aucune description.
                                </p>
                            )}

                            <div className="task__actions">
                                <button
                                    type="button"
                                    className="task__action-btn task__action-btn--folder"
                                    onClick={() => onAddFolder(task)}
                                >
                                    + Dossier
                                </button>
                                <button
                                    type="button"
                                    className="task__action-btn task__action-btn--edit"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Modifier
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </li>
    );
}