/**
 * @fileoverview Root component of the ToDoList application.
 * Manages all global state, handles view routing, and orchestrates
 * communication between all child components.
 * Acts as the single source of truth for tasks, folders, UI visibility,
 * and user preferences.
 */

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

import { useLocalStorage } from "./hooks/useLocalStorage";
import { useTasks } from "./hooks/useTasks";
import { useFolders } from "./hooks/useFolders";

import "./App.css";

/**
 * @component App
 * @description Root component of the application. Renders the full UI and
 * manages all shared state: tasks, folders, active view, open modals,
 * filters, sort order, and dark mode preference.
 *
 * @returns {JSX.Element} The complete application layout.
 */
export default function App() {
    const {
        tasks, addTask, updateTask, deleteTask, addFolderToTask,
        showRestoreBanner, handleRestoreYes, handleRestoreNo, resetToBackup,
    } = useTasks();

    const { folders, addFolder, updateFolder, deleteFolder } = useFolders();

    /** @type {string} The currently rendered view — one of VIEWS.TASKS, VIEWS.FOLDERS, VIEWS.FOLDER_DETAIL */
    const [currentView, setCurrentView] = useState(VIEWS.TASKS);

    /** @type {boolean} Whether the task creation/edit Modal is open */
    const [isModalOpen, setIsModalOpen] = useState(false);

    /** @type {boolean} Whether the FolderModal (create/edit/select) is open */
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

    /** @type {Object|null} The task currently being edited, or null when creating a new one */
    const [selectedTask, setSelectedTask] = useState(null);

    /** @type {Object|null} The folder currently selected for detail view or editing */
    const [selectedFolder, setSelectedFolder] = useState(null);

    /** @type {string} The active task filter — either FILTERS.ACTIVE or FILTERS.ALL */
    const [activeFilter, setActiveFilter] = useState(FILTERS.ACTIVE);

    /** @type {string|null} The ID of the currently expanded TaskCard, or null if none */
    const [expandedTaskId, setExpandedTaskId] = useState(null);

    /**
     * @type {boolean} Whether FolderModal is in folder-selection mode.
     * true  → the user is picking a folder to attach to a task.
     * false → the user is creating or editing a folder.
     */
    const [isFolderSelectMode, setIsFolderSelectMode] = useState(false);

    /** @type {string} The current sort strategy — one of the SORT_OPTIONS values */
    const [sortBy, setSortBy] = useState(SORT_OPTIONS.DUE_DATE);

    /** @type {string[]} The list of task statuses currently used as filters (empty = no filter) */
    const [selectedStatuses, setSelectedStatuses] = useState([]);

    /** @type {string[]} The list of folder IDs currently used as filters (empty = no filter) */
    const [selectedFolderIds, setSelectedFolderIds] = useState([]);

    /** @type {boolean} Dark mode toggle, persisted in localStorage */
    const [isDark, setIsDark] = useLocalStorage("todoapp_dark_mode", false);

    /**
     * Toggles the expanded state of a TaskCard.
     * Collapses the card if it is already expanded, expands it otherwise.
     * @param {string} id - The ID of the task to toggle.
     */
    function toggleTask(id) {
        setExpandedTaskId((prev) => prev === id ? null : id);
    }

    /**
     * Flips the dark mode preference.
     * The new value is automatically persisted via useLocalStorage.
     */
    function toggleDarkMode() {
        setIsDark((prev) => !prev);
    }

    /**
     * Adds or removes a status from the active status filters.
     * Passing the special value "__clear__" resets all status filters.
     * @param {string} status - A task status value, or "__clear__" to reset.
     */
    function toggleStatusFilter(status) {
        if (status === "__clear__") { setSelectedStatuses([]); return; }
        setSelectedStatuses((prev) =>
            prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
        );
    }

    /**
     * Adds or removes a folder ID from the active folder filters.
     * When one or more folder IDs are selected, only tasks belonging
     * to those folders are displayed.
     * @param {string} folderId - The ID of the folder to toggle.
     */
    function toggleFolderFilter(folderId) {
        setSelectedFolderIds((prev) =>
            prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
        );
    }

    /** @type {number} Total number of tasks regardless of status */
    const totalTasks = tasks.length;

    /** @type {number} Number of tasks whose status is not in COMPLETED_STATUS */
    const incompleteTasks = tasks.filter(
        (t) => !COMPLETED_STATUS.includes(t.status)
    ).length;

    /**
     * @type {Object[]} The filtered and sorted task array to render.
     * Computed from the full task list using the current filter and sort state.
     */
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