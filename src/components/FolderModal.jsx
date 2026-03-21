import { useState } from "react";
import { FOLDER_COLORS } from "../constants/folderColors";

export default function FolderModal({ onClose, onAdd, onUpdate, onDelete, folderToEdit }) {
    const isEditMode = folderToEdit !== null && folderToEdit !== undefined;

    const [name, setName] = useState(isEditMode ? folderToEdit.title : "");
    const [color, setColor] = useState(isEditMode ? folderToEdit.color : FOLDER_COLORS.BLUE.value);

    function handleSubmit() {
        if (name.trim().length < 3) {
            alert("Le nom doit faire au moins 3 caractères !");
            return;
        }

        if (isEditMode) {
            onUpdate({ ...folderToEdit, title: name.trim(), color });
        } else {
            onAdd({
                id: Date.now(),
                title: name.trim(),
                description: "",
                color,
            });
        }
        onClose();
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
                    <button type="button" className="modal__button modal__button--cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button type="button" className="modal__button modal__button--create" onClick={handleSubmit}>
                        {isEditMode ? "Sauvegarder" : "Creer"}
                    </button>
                </div>

            </div>
        </div>
    );
}