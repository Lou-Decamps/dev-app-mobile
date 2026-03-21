import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { COMPLETED_STATUS } from "./constants/taskStatus";
import { loadFromBackup } from "./data/loadBackup";
import "./App.css";

const STORAGE_KEY = "todoapp_tasks";

function getInitialTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((t) => ({
            ...t,
            creationDate: new Date(t.creationDate),
            dueDate: new Date(t.dueDate),
        }));
    }

    const { tasks } = loadFromBackup();
    return tasks;
}

export default function App() {
    const [task, setTask] = useState(getInitialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(task));
    }, [task]);

    const totalTask = task.length;
    const unfinishedTask = task.filter(
        (t) => !COMPLETED_STATUS.includes(t.statut)
    ).length;

    function updateTask(updatedTask) {
        setTask(task.map(
            (t) => t.id === updatedTask.id ? updatedTask : t
        ));
    }

    function deleteTask(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche?");
        if (!confirmed) return false;
        setTask(task.filter((t) => t.id !== id));
        return true;
    }

    function addTask(newTask) {
        setTask([...task, newTask]);
    }

    function resetToBackup() {
        const confirmed = window.confirm("Êtes-vous sûr(e) ? Toutes vos modifications seront perdues.");
        if (!confirmed) return;
        localStorage.removeItem(STORAGE_KEY);
        const { tasks: backupTasks } = loadFromBackup();
        setTask(backupTasks);
    }

    return (
        <div className="app">
            <Header
                totalTask={totalTask}
                unfinishedTask={unfinishedTask}
            />

            <main className="app__content">
                <ul className="task__list">
                    {task.length === 0 ? (
                        <li className="task__empty">
                            Aucune tâche pour l'instant. Clique sur + pour commencer !
                        </li>
                    ) : (
                        task.map((t) => (
                            <li
                                key={t.id}
                                className="task task--clickable"
                                onClick={() => {
                                    setSelectedTask(t);
                                    setIsModalOpen(true);
                                }}
                            >
                                <span className="task__title">{t.title}</span>
                                <span className="task__status">{t.status}</span>
                            </li>
                        ))
                    )}
                </ul>
            </main>

            {isModalOpen && (
                <Modal
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedTask(null);
                    }}
                    onAdd={addTask}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    taskToEdit={selectedTask}
                />
            )}
            <Footer onAddTask={() => {
                setSelectedTask(null);
                setIsModalOpen(true);
            }} />
        </div>
    );
}