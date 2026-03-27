/**
 * @fileoverview Application header component.
 */
import PieChart from "./PieChart";

/**
 * Header displaying the title, statistics, pie chart
 * and global control buttons.
 * @param {Object} props
 * @param {number} props.totalTasks - Total number of tasks
 * @param {number} props.incompleteTasks - Number of incomplete tasks
 * @param {Function} props.onReset - Callback to reset from backup
 * @param {Object[]} props.tasks - Task array (for the pie chart)
 * @param {boolean} props.isDark - Current dark mode state
 * @param {Function} props.onToggleDark - Callback to toggle dark mode
 */
export default function Header({ totalTasks, incompleteTasks, onReset, tasks, isDark, onToggleDark }) {
    return (
        <header className="header">
            <div className="header__top">
                <button
                    type="button"
                    className="header__reset"
                    onClick={onReset}
                >
                    Repartir de zéro
                </button>

                <div className="header__info">
                    <h1 className="header__title">To Do List</h1>
                    <p className="header__subtitle">Organise ta vie simplement</p>
                    <div className="header__stats">
                        <span className="header__stat">Total : {totalTasks} tâche(s)</span>
                        <span className="header__separator">|</span>
                        <span className="header__stat">Non terminées : {incompleteTasks} tâche(s)</span>
                    </div>
                </div>

                <button
                    type="button"
                    className="header__dark-toggle"
                    onClick={onToggleDark}
                >
    <span className="header__dark-toggle-icon">
        {isDark ? "☀️" : "🌙"}
    </span>
                </button>

            </div>

            {totalTasks > 0 && <PieChart tasks={tasks} />}
        </header>
    );
}