import { useState } from "react";
import { TaskStatus } from "../constants/taskStatus";

export default function Modal({ onClose, onAdd, onUpdate, onDelete, taskToEdit }) {

    const isEditMode = taskToEdit !== null;

    const [title, setTitle] = useState(taskToEdit ? taskToEdit.title : "");
    const [description, setDescription] = useState(taskToEdit ? taskToEdit.description : "");
    const [dueDate, setDueDate] = useState(
        taskToEdit
            ? taskToEdit.dueDate.toISOString().split("T")[0]
            : ""
    );
    const [status, setStatus] = useState(
        taskToEdit ? taskToEdit.status : TaskStatus.TO_DO
    );

    function handleSubmit() {
        if (title.trim().length < 5) {
            alert("Title must be at least 5 characters!");
            return;
        }
        if (!dueDate) {
            alert("Due date is required!");
            return;
        }

        if (isEditMode) {
            const updatedTask = {
                ...taskToEdit,
                title: title.trim(),
                description: description.trim(),
                dueDate: new Date(dueDate),
                status,
            };
            onUpdate(updatedTask);
        } else {
            const newTask = {
                id: Date.now(),
                title: title.trim(),
                description: description.trim(),
                creationDate: new Date(),
                dueDate: new Date(dueDate),
                status,
                folders: [],
            };
            onAdd(newTask);
        }

        onClose();
    }

    return (
        <div className="modal__overlay" onClick={onClose}>
            <div className="modal__content" onClick={(e) => e.stopPropagation()}>

                <h2 className="modal__title">
                    {isEditMode ? "Edit task" : "New task"}
                </h2>

                <label className="modal__label">
                    Titre (5 characters min) *
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Buy groceries"
                        className="modal__input"
                    />
                </label>

                <label className="modal__label">
                    Description
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Optional details..."
                        className="modal__input modal__textarea"
                    />
                </label>

                <label className="modal__label">
                    Date d'Echéance *
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
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="modal__input modal__select"
                    >
                        {Object.values(TaskStatus).map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </label>

                <div className="modal__actions">

                    {}
                    {isEditMode && (
                        <button
                            type="button"
                            className="modal__button modal__button--delete"
                            onClick={() => {
                                const deleted = onDelete(taskToEdit.id);
                                if (deleted) onClose();
                            }}
                        >
                            Delete
                        </button>
                    )}

                    {/* Spacer*/}
                    <div className="modal__actions-spacer" />

                    <button
                        type="button"
                        className="modal__button modal__button--cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="modal__button modal__button--create"
                        onClick={handleSubmit}
                    >
                        {isEditMode ? "Save" : "Create"}
                    </button>

                </div>

            </div>
        </div>
    );
}