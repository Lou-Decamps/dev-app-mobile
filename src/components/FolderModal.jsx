import { useState } from "react";
import { FOLDER_COLORS } from "../constants/folderColors";

export default function FolderModal({
                                        onClose, onAdd, onUpdate, onDelete,
                                        folderToEdit,
                                        selectMode,
                                        folders,
                                        onSelectFolder,
                                    }) {
    const isEditMode = !selectMode && folderToEdit != null;

    const [name, setName] = useState(isEditMode ? folderToEdit.title : "");
    const [color, setColor] = useState(
        isEditMode ? folderToEdit.color : FOLDER_COLORS.BLUE.value
    );

    function handleSubmit() {
        if (name.trim().length < 3) {
            alert("Le nom doit faire au moins 3 caractères !");
            return;
        }
        if (isEditMode) {
            onUpdate({ ...folderToEdit, title: name.trim(), color });
        } else {
            onAdd({ id: Date.now(), title: name.trim(), description: "", color });
        }
        onClose();
    }

    if (selectMode) {
        return (
            <div className="modal__overlay" onClick={onClose}>
                <div className="modal__content" onClick={(e) => e.stopPropagation()}>
                    <h2 className="modal__title">Ajouter un dossier</h2>
                    {folders && folders.length > 0 ? (
                        <ul className="folder__list">
                            {folders.map((f) => (
                                <li
                                    key={f.id}
                                    className="folder folder--clickable"
                                    onClick={() => { onSelectFolder(f); onClose(); }}
                                >
                                    <div
                                        className="folder__color-dot"
                                        style={{ backgroundColor: `var(--folder-color-${f.color})` }}
                                    />
                                    <span className="folder__title">{f.title}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="task__empty">Aucun dossier disponible.</p>
                    )}
                    <div className="modal__actions">
                        <div className="modal__actions-spacer" />
                        <button
                            type="button"
                            className="modal__button modal__button--cancel"
                            onClick={onClose}
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>

                <h2 className="modal__title">
                    {isEditMode ? "Modifier le dossier" : "Nouveau dossier"}
                </h2>

                <label className="modal__label">
                    Nom (3 caractères min) *
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Marketing"
                        className="modal__input"
                    />
                </label>

                <label className="modal__label">
                    Couleur
                    <div className="color-picker">
                        {Object.values(FOLDER_COLORS).map((c) => (
                            <button
                                key={c.value}
                                type="button"
                                title={c.label}
                                className={`color-picker__swatch color-picker__swatch--${c.value} ${color === c.value ? "color-picker__swatch--selected" : ""}`}
                                onClick={() => setColor(c.value)}
                            />
                        ))}
                    </div>
                </label>

                <div className="modal__actions">
                    {isEditMode && (
                        <button
                            type="button"
                            className="modal__button modal__button--delete"
                            onClick={() => {
                                const deleted = onDelete(folderToEdit.id);
                                if (deleted) onClose();
                            }}
                        >
                            Supprimer
                        </button>
                    )}
                    <div className="modal__actions-spacer" />
                    <button
                        type="button"
                        className="modal__button modal__button--cancel"
                        onClick={onClose}
                    >
                        Annuler
                    </button>
                    <button
                        type="button"
                        className="modal__button modal__button--create"
                        onClick={handleSubmit}
                    >
                        {isEditMode ? "Sauvegarder" : "Créer"}
                    </button>
                </div>

            </div>
        </div>
    );
}