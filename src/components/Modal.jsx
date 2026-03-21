import { useState } from "react";
import { TaskStatus } from "../constants/taskStatus";

export default function Modal({ onClose, onAdd }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [statut, setStatut] = useState(TaskStatus.TO_DO);

    function handleSubmit() {
        if (title.trim().length < 5) {
            alert("Le titre doit faire au moins 5 caractères !");
            return;
        }
        if (!dueDate) {
            alert("La date d'échéance est obligatoire !");
            return;
        }

        const nouvelleTache = {
            id: Date.now(),
            titre: title.trim(),
            description: description.trim(),
            dateCreation: new Date(),
            dateEcheance: new Date(dueDate),
            statut,
            dossiers: [],
        };

        onAdd(nouvelleTache);
        onClose();
    }

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>

                <h2 className="modal__title">Nouvelle tâche</h2>

                <label className="modal__label">
                    Titre (5 caractères min) *
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Faire les courses"
                        className="modal__input"
                    />
                </label>

                <label className="modal__label">
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Détails optionnels..."
                        className="modal__input modal__textarea"
                    />
                </label>

                <label className="modal__label">
                    Date d'échéance *
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="modal__input"
                    />
                </label>

                <label className="modal__label">
                    Statut
                    <select
                        value={statut}
                        onChange={(e) => setStatut(e.target.value)}
                        className="modal__input modal__select"
                    >
                        {Object.values(TaskStatus).map((etat) => (
                            <option key={etat} value={etat}>{etat}</option>
                        ))}
                    </select>
                </label>

                <div className="modal__actions">
                    <button type="button" className="modal__button modal__button--cancel" onClick={onClose}>
                        Annuler
                    </button>
                    <button type="button" className="modal__button modal__button--create" onClick={handleSubmit}>
                        Créer
                    </button>
                </div>

            </div>
        </div>
    );
}