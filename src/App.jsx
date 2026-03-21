import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { COMPLETED_STATUS } from "./constants/taskStatus";
import { loadFromBackup } from "./data/loadBackup";
import "./App.css";

const STORAGE_KEY = "todoapp_tasks";

const FILTERS = {
    ACTIVE: "active",
    ALL: "all",
};

function getInitialTasks() {
    const { tasks } = loadFromBackup();
    return tasks;
}

export default function App() {
    const [tasks, setTasks] = useState(getInitialTasks);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showRestoreBanner, setShowRestoreBanner] = useState(false);
    const [activeFilter, setActiveFilter] = useState(FILTERS.ACTIVE);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setShowRestoreBanner(true);
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    function handleRestoreYes() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            setTasks(parsed.map((t) => ({
                ...t,
                creationDate: new Date(t.creationDate),
                dueDate: new Date(t.dueDate),
            })));
        }
        setShowRestoreBanner(false);
    }

    function handleRestoreNo() {
        const confirmed = window.confirm("Êtes-vous sûr(e) ? Toutes vos modifications seront perdues.");
        if (!confirmed) return;
        localStorage.removeItem(STORAGE_KEY);
        setShowRestoreBanner(false);
    }

    function resetToBackup() {
        const confirmed = window.confirm("Êtes-vous sûr(e) ? Toutes vos modifications seront perdues.");
        if (!confirmed) return;
        localStorage.removeItem(STORAGE_KEY);
        const { tasks: backupTasks } = loadFromBackup();
        setTasks(backupTasks);
    }

    function addTask(newTask) {
        setTasks([...tasks, newTask]);
    }

    function updateTask(updatedTask) {
        setTasks(tasks.map(
            (t) => t.id === updatedTask.id ? updatedTask : t
        ));
    }

    function deleteTask(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if (!confirmed) return false;
        setTasks(tasks.filter((t) => t.id !== id));
        return true;
    }

    const totalTasks = tasks.length;
    const incompleteTasks = tasks.filter(
        (t) => !COMPLETED_STATUS.includes(t.status)
    ).length;

    const displayedTasks = activeFilter === FILTERS.ALL
        ? tasks
        : tasks.filter((t) => !COMPLETED_STATUS.includes(t.status));

    return (
        <div className="app">
            <Header
                totalTasks={totalTasks}
                incompleteTasks={incompleteTasks}
                onReset={resetToBackup}
            />

            {showRestoreBanner && (
                <div className="restore-banner">
                    <p className="restore-banner__text">
                        Une sauvegarde a été trouvée. Voulez-vous la reprendre ?
                    </p>
                    <div className="restore-banner__actions">
                        <button
                            type="button"
                            className="restore-banner__btn restore-banner__btn--yes"
                            onClick={handleRestoreYes}
                        >
                            Oui, reprendre
                        </button>
                        <button
                            type="button"
                            className="restore-banner__btn restore-banner__btn--no"
                            onClick={handleRestoreNo}
                        >
                            Non, repartir du backup
                        </button>
                    </div>
                </div>
            )}

            <div className="filter-bar">
                <button
                    type="button"
                    className={`filter-bar__btn ${activeFilter === FILTERS.ACTIVE ? "filter-bar__btn--active" : ""}`}
                    onClick={() => setActiveFilter(FILTERS.ACTIVE)}
                >
                    En cours ({incompleteTasks})
                </button>
                <button
                    type="button"
                    className={`filter-bar__btn ${activeFilter === FILTERS.ALL ? "filter-bar__btn--active" : ""}`}
                    onClick={() => setActiveFilter(FILTERS.ALL)}
                >
                    Tout voir ({totalTasks})
                </button>
            </div>

            <main className="app__content">
                <ul className="task__list">
                    {displayedTasks.length === 0 ? (
                        <li className="task__empty">
                            Aucune tâche non terminée
                        </li>
                    ) : (
                        displayedTasks.map((t) => (
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