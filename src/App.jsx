import { useState, useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import FolderModal from "./components/FolderModal";
import FolderList from "./components/FolderList";
import FolderDetail from "./components/FolderDetail";
import TaskCard from "./components/TaskCard";
import SortFilterBar from "./components/SortFilterBar";
import { COMPLETED_STATUS } from "./constants/taskStatus";
import { loadFromBackup } from "./data/loadBackup";

import "./App.css";

const STORAGE_KEY = "todoapp_tasks";
const STORAGE_KEY_FOLDERS = "todoapp_folders";

const FILTERS = { ACTIVE: "active", ALL: "all" };

const VIEWS = {
    TASKS: "tasks",
    FOLDERS: "folders",
    FOLDER_DETAIL: "folder-detail",
};

const SORT_OPTIONS = {
    DUE_DATE:      "dueDate",
    CREATION_DATE: "creationDate",
    NAME:          "name",
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

function isNotExpired(task){
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - (24*60*60*1000)*7);
    return new Date (task.dueDate) > oneWeekAgo;
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
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [isFolderSelectMode, setIsFolderSelectMode] = useState(false);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.DUE_DATE);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedFolderIds, setSelectedFolderIds] = useState([]);
    const [isDark, setIsDark] = useState(false);

    function toggleTask(id) {
        setExpandedTaskId(expandedTaskId === id ? null : id);
    }

    function addFolderToTask(task, folder) {
        const alreadyLinked = task.folders && task.folders.some((f) => f.id === folder.id);
        if (alreadyLinked) {
            alert("Ce dossier est déjà lié à cette tâche !");
            return;
        }
        updateTask({
            ...task,
            folders: [...(task.folders || []), folder],
        });
    }

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

    function toggleStatusFilter(status) {
        if (status === "__clear__") {
            setSelectedStatuses([]);
            return;
        }
        setSelectedStatuses((prev) =>
            prev.includes(status)
                ? prev.filter((s) => s !== status)
                : [...prev, status]
        );
    }

    function toggleFolderFilter(folderId) {
        setSelectedFolderIds((prev) =>
            prev.includes(folderId)
                ? prev.filter((id) => id !== folderId)
                : [...prev, folderId]
        );
    }

    function toggleDarkMode() {
        setIsDark((prev )=>  !prev);
    }

    const totalTasks = tasks.length;
    const incompleteTasks = tasks.filter(
        (t) => !COMPLETED_STATUS.includes(t.status)
    ).length;

    const displayedTasks = (() => {
        let result = [...tasks];

        if (selectedStatuses.length > 0) {
            result = result.filter((t) => selectedStatuses.includes(t.status));
        } else if (activeFilter === FILTERS.ACTIVE) {
            result = result.filter((t) => !COMPLETED_STATUS.includes(t.status));
        }
        if (selectedFolderIds.length > 0) {
            result = result.filter((t) =>
                t.folders && t.folders.some((f) => selectedFolderIds.includes(f.id))
            );
        }
        result.sort((a, b) => {
            if (sortBy === SORT_OPTIONS.NAME) {
                return a.title.localeCompare(b.title);
            }
            if (sortBy === SORT_OPTIONS.CREATION_DATE) {
                return new Date(a.creationDate) - new Date(b.creationDate);
            }
            return new Date(a.dueDate) - new Date(b.dueDate);
        });
        result = result.filter(isNotExpired);
        return result;
    })();

    return (
        <div className={`app ${isDark ? "dark" : ""}`}>
            <Header
                totalTasks={totalTasks}
                incompleteTasks={incompleteTasks}
                onReset={resetToBackup}
                tasks={tasks}
                isDark={isDark}
                onToggleDark={toggleDarkMode}
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

            {currentView === VIEWS.TASKS && (
                <>
                    <SortFilterBar
                        sortBy={sortBy}
                        onSortChange={setSortBy}
                        selectedStatuses={selectedStatuses}
                        onToggleStatus={toggleStatusFilter}
                        selectedFolderIds={selectedFolderIds}
                        onToggleFolderFilter={toggleFolderFilter}
                        folders={folders}
                        activeFilter={activeFilter}
                        onActiveFilterChange={setActiveFilter}
                        FILTERS={FILTERS}
                        SORT_OPTIONS={SORT_OPTIONS}
                    />
                    <main className="app__content">
                        <ul className="task__list">
                            {displayedTasks.length === 0 ? (
                                <li className="task__empty">Aucune tâche non terminée 🎉</li>
                            ) : (
                                displayedTasks.map((t) => (
                                    <TaskCard
                                        key={t.id}
                                        task={t}
                                        isExpanded={expandedTaskId === t.id}
                                        onToggle={() => toggleTask(t.id)}
                                        onUpdate={updateTask}
                                        folders={folders}
                                        onAddFolder={(task) => {
                                            setSelectedTask(task);
                                            setIsFolderSelectMode(true);
                                            setIsFolderModalOpen(true);
                                        }}
                                    />
                                ))
                            )}
                        </ul>
                    </main>
                </>
            )}

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
                            setIsFolderSelectMode(false);
                            setIsFolderModalOpen(true);
                        }}
                    />
                </main>
            )}

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
                    onClose={() => {
                        setIsFolderModalOpen(false);
                        setSelectedFolder(null);
                        setIsFolderSelectMode(false);
                    }}
                    onAdd={addFolder}
                    onUpdate={updateFolder}
                    onDelete={deleteFolder}
                    folderToEdit={isFolderSelectMode ? null : selectedFolder}
                    selectMode={isFolderSelectMode}
                    folders={folders}
                    onSelectFolder={(folder) => {
                        if (selectedTask) addFolderToTask(selectedTask, folder);
                    }}
                />
            )}

            <Footer
                currentView={currentView}
                onAddTask={() => { setSelectedTask(null); setIsModalOpen(true); }}
                onAddFolder={() => {
                    setSelectedFolder(null);
                    setIsFolderSelectMode(false);
                    setIsFolderModalOpen(true);
                }}
            />
        </div>
    );
}