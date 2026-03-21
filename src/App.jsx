import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import FolderModal from "./components/FolderModal";
import FolderList from "./components/FolderList";
import FolderDetail from "./components/FolderDetail";
import { COMPLETED_STATUS } from "./constants/taskStatus";
import { loadFromBackup } from "./data/loadBackup";

import "./App.css";

const STORAGE_KEY = "todoapp_tasks";
const STORAGE_KEY_FOLDERS = "todoapp_folders";

const FILTERS = { ACTIVE: "active", ALL: "all" };


const VIEWS = {
    TASKS: "tasks",
    FOLDERS: "folders",
    FOLDER_DETAIL: "folder-detail",   // ← nouveau
};

function getInitialTasks() {
    const { tasks } = loadFromBackup();
    return tasks;
}

function getInitialFolders() {
    const saved = localStorage.getItem(STORAGE_KEY_FOLDERS);
    if (saved) return JSON.parse(saved);
    const { folders } = loadFromBackup();
    return folders;
}

export default function App() {
    const [tasks, setTasks] = useState(getInitialTasks);
    const [folders, setFolders] = useState(getInitialFolders);
    const [currentView, setCurrentView] = useState(VIEWS.TASKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [showRestoreBanner, setShowRestoreBanner] = useState(false);
    const [activeFilter, setActiveFilter] = useState(FILTERS.ACTIVE);


    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setShowRestoreBanner(true);
    }, []);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_FOLDERS, JSON.stringify(folders));
    }, [folders]);

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

    function addTask(newTask) { setTasks([...tasks, newTask]); }
    function updateTask(updatedTask) {
        setTasks(tasks.map((t) => t.id === updatedTask.id ? updatedTask : t));
    }
    function deleteTask(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?");
        if (!confirmed) return false;
        setTasks(tasks.filter((t) => t.id !== id));
        return true;
    }

    function addFolder(newFolder) { setFolders([...folders, newFolder]); }
    function updateFolder(updatedFolder) {
        setFolders(folders.map((f) => f.id === updatedFolder.id ? updatedFolder : f));
    }
    function deleteFolder(id) {
        const confirmed = window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?");
        if (!confirmed) return false;
        setFolders(folders.filter((f) => f.id !== id));
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
                        <button type="button" className="restore-banner__btn restore-banner__btn--yes" onClick={handleRestoreYes}>
                            Oui, reprendre
                        </button>
                        <button type="button" className="restore-banner__btn restore-banner__btn--no" onClick={handleRestoreNo}>
                            Non, repartir du backup
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="tabs">
                <button
                    type="button"
                    className={`tabs__tab ${currentView === VIEWS.TASKS ? "tabs__tab--active" : ""}`}
                    onClick={() => setCurrentView(VIEWS.TASKS)}
                >
                    Tâches ({totalTasks})
                </button>
                <button
                    type="button"
                    className={`tabs__tab ${currentView === VIEWS.FOLDERS ? "tabs__tab--active" : ""}`}
                    onClick={() => setCurrentView(VIEWS.FOLDERS)}
                >
                    Dossiers ({folders.length})
                </button>
            </div>

            {/* Task View*/}
            {currentView === VIEWS.TASKS && (
                <>
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
                                <li className="task__empty">Aucune tâche non terminée 🎉</li>
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
                </>
            )}

            {/* Folder view */}
            {currentView === VIEWS.FOLDERS && (
                <main className="app__content">
                    <FolderList
                        folders={folders}
                        onFolderClick={(folder) => {
                            setSelectedFolder(folder);
                            setCurrentView(VIEWS.FOLDER_DETAIL);
                        }}
                        onFolderEdit={(folder) => {
                            setSelectedFolder(folder);
                            setIsFolderModalOpen(true);
                        }}
                    />
                </main>
            )}

            {/* Vue détail d'un dossier */}
            {currentView === VIEWS.FOLDER_DETAIL && selectedFolder && (
                <FolderDetail
                    folder={selectedFolder}
                    tasks={tasks}
                    onBack={() => {
                        setCurrentView(VIEWS.FOLDERS);
                        setSelectedFolder(null);
                    }}
                    onTaskClick={(task) => {
                        setSelectedTask(task);
                        setIsModalOpen(true);
                    }}
                />
            )}

            {/* Modals */}
            {isModalOpen && (
                <Modal
                    onClose={() => { setIsModalOpen(false); setSelectedTask(null); }}
                    onAdd={addTask}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    taskToEdit={selectedTask}
                />
            )}
            {isFolderModalOpen && (
                <FolderModal
                    onClose={() => { setIsFolderModalOpen(false); setSelectedFolder(null); }}
                    onAdd={addFolder}
                    onUpdate={updateFolder}
                    onDelete={deleteFolder}
                    folderToEdit={selectedFolder}
                />
            )}

            <Footer
                currentView={currentView}
                onAddTask={() => { setSelectedTask(null); setIsModalOpen(true); }}
                onAddFolder={() => { setSelectedFolder(null); setIsFolderModalOpen(true); }}
            />
        </div>
    );
}