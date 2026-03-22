import { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import FolderModal from "./components/FolderModal";
import FolderList from "./components/FolderList";
import FolderDetail from "./components/FolderDetail";
import TaskCard from "./components/TaskCard";

import SortFilterBar from "./components/SortFilterBar";
import { COMPLETED_STATUS } from "./constants/taskStatus";
import { FILTERS, SORT_OPTIONS } from "./constants/filters";
import { VIEWS } from "./constants/views";

import { getDisplayedTasks } from "./utils/taskFilters";

import { useTasks } from "./hooks/useTasks";
import { useFolders } from "./hooks/useFolders";

import "./App.css";

export default function App() {
    const {
        tasks, addTask, updateTask, deleteTask, addFolderToTask,
        showRestoreBanner, handleRestoreYes, handleRestoreNo, resetToBackup,
    } = useTasks();

    const { folders, addFolder, updateFolder, deleteFolder } = useFolders();

    const [currentView, setCurrentView] = useState(VIEWS.TASKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedFolder, setSelectedFolder] = useState(null);
    const [activeFilter, setActiveFilter] = useState(FILTERS.ACTIVE);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [isFolderSelectMode, setIsFolderSelectMode] = useState(false);
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.DUE_DATE);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const [selectedFolderIds, setSelectedFolderIds] = useState([]);
    const [isDark, setIsDark] = useState(false);

    function toggleTask(id) {
        setExpandedTaskId((prev) => prev === id ? null : id);
    }

    function toggleDarkMode() {
        setIsDark((prev) => !prev);
    }

    function toggleStatusFilter(status) {
        if (status === "__clear__") { setSelectedStatuses([]); return; }
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    }

    function toggleFolderFilter(folderId) {
        setSelectedFolderIds((prev) =>
            prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
        );
    }

    const totalTasks = tasks.length;
    const incompleteTasks = tasks.filter(
        (t) => !COMPLETED_STATUS.includes(t.status)
    ).length;

    const displayedTasks = getDisplayedTasks(tasks, {
        activeFilter, selectedStatuses, selectedFolderIds,
        sortBy, FILTERS, SORT_OPTIONS, COMPLETED_STATUS,
    });

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
                <button type="button" className={`tabs__tab ${currentView === VIEWS.TASKS ? "tabs__tab--active" : ""}`} onClick={() => setCurrentView(VIEWS.TASKS)}>
                    Tâches ({totalTasks})
                </button>
                <button type="button" className={`tabs__tab ${currentView === VIEWS.FOLDERS ? "tabs__tab--active" : ""}`} onClick={() => setCurrentView(VIEWS.FOLDERS)}>
                    Dossiers ({folders.length})
                </button>
            </div>

            {currentView === VIEWS.TASKS && (
                <>
                    <SortFilterBar
                        sortBy={sortBy} onSortChange={setSortBy}
                        selectedStatuses={selectedStatuses} onToggleStatus={toggleStatusFilter}
                        selectedFolderIds={selectedFolderIds} onToggleFolderFilter={toggleFolderFilter}
                        folders={folders} activeFilter={activeFilter}
                        onActiveFilterChange={setActiveFilter}
                        FILTERS={FILTERS} SORT_OPTIONS={SORT_OPTIONS}
                    />
                    <main className="app__content">
                        <ul className="task__list">
                            {displayedTasks.length === 0 ? (
                                <li className="task__empty">Aucune tâche non terminée 🎉</li>
                            ) : (
                                displayedTasks.map((t) => (
                                    <TaskCard
                                        key={t.id} task={t}
                                        isExpanded={expandedTaskId === t.id}
                                        onToggle={() => toggleTask(t.id)}
                                        onUpdate={updateTask} folders={folders}
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
                        onFolderClick={(folder) => { setSelectedFolder(folder); setCurrentView(VIEWS.FOLDER_DETAIL); }}
                        onFolderEdit={(folder) => { setSelectedFolder(folder); setIsFolderSelectMode(false); setIsFolderModalOpen(true); }}
                    />
                </main>
            )}

            {currentView === VIEWS.FOLDER_DETAIL && selectedFolder && (
                <FolderDetail
                    folder={selectedFolder} tasks={tasks}
                    onBack={() => { setCurrentView(VIEWS.FOLDERS); setSelectedFolder(null); }}
                    onTaskClick={(task) => { setSelectedTask(task); setIsModalOpen(true); }}
                />
            )}

            {isModalOpen && (
                <Modal
                    onClose={() => { setIsModalOpen(false); setSelectedTask(null); }}
                    onAdd={addTask} onUpdate={updateTask} onDelete={deleteTask}
                    taskToEdit={selectedTask}
                />
            )}

            {isFolderModalOpen && (
                <FolderModal
                    onClose={() => { setIsFolderModalOpen(false); setSelectedFolder(null); setIsFolderSelectMode(false); }}
                    onAdd={addFolder} onUpdate={updateFolder} onDelete={deleteFolder}
                    folderToEdit={isFolderSelectMode ? null : selectedFolder}
                    selectMode={isFolderSelectMode} folders={folders}
                    onSelectFolder={(folder) => { if (selectedTask) addFolderToTask(selectedTask, folder); }}
                />
            )}

            <Footer
                currentView={currentView}
                onAddTask={() => { setSelectedTask(null); setIsModalOpen(true); }}
                onAddFolder={() => { setSelectedFolder(null); setIsFolderSelectMode(false); setIsFolderModalOpen(true); }}
            />
        </div>
    );
}