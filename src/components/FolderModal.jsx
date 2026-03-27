/**
 * @fileoverview Multi-mode modal for folders.
 */
import { useState } from "react";
import { FOLDER_COLORS } from "../constants/folderColors";
import { FOLDER_ICONS } from "../constants/folderIcons";

/**
 * Modal usable in three modes:
 * - Create: folderToEdit = null, selectMode = false
 * - Edit: folderToEdit = a folder, selectMode = false
 * - Select: selectMode = true (to link a folder to a task)
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onAdd - Callback to create a folder
 * @param {Function} props.onUpdate - Callback to modify a folder
 * @param {Function} props.onDelete - Callback to delete a folder
 * @param {Object|null} props.folderToEdit - The folder to edit, or null
 * @param {boolean} props.selectMode - If true, displays the selection list
 * @param {Object[]} props.folders - List of available folders (selection mode)
 * @param {Function} props.onSelectFolder - Callback when a folder is selected
 */
export default function FolderModal({
                                        onClose, onAdd, onUpdate, onDelete,
                                        folderToEdit,
                                        selectMode,
                                        folders,
                                        onSelectFolder,
                                    }) {

    const isEditMode = !selectMode && folderToEdit != null;
    const [icon, setIcon] = useState(isEditMode ? folderToEdit.icon || "" : "");

    const [name, setName] = useState(isEditMode ? folderToEdit.title : "");
    const [description, setDescription] = useState(isEditMode ? folderToEdit.description : "");
    const [color, setColor] = useState(
        isEditMode ? folderToEdit.color : FOLDER_COLORS.BLUE.value
    );

    function handleSubmit() {
        if (name.trim().length < 3) {
            alert("Le nom doit faire au moins 3 caractères !");
            return;
        } if (isEditMode) {
            onUpdate({ ...folderToEdit, title: name.trim(), color, icon });
        } else {
            onAdd({ id: Date.now(), title: name.trim(), description: description.trim(), color, icon });
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
                    Description
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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

                <label className="modal__label">
                    Pictogramme
                    <div className="icon-picker">
                        <button
                            type="button"
                            className={`icon-picker__btn ${icon === "" ? "icon-picker__btn--selected" : ""}`}
                            onClick={() => setIcon("")}
                            title="Aucun"
                        >
                            —
                        </button>

                        {FOLDER_ICONS.map((ic) => (
                            <button
                                key={ic.value}
                                type="button"
                                className={`icon-picker__btn ${icon === ic.value ? "icon-picker__btn--selected" : ""}`}
                                onClick={() => setIcon(ic.value)}
                                title={ic.label}
                            >
                                {ic.value}
                            </button>
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