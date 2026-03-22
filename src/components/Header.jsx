import PieChart from "./PieChart";

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