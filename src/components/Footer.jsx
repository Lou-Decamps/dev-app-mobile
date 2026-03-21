export default function Footer({ onAddTask, onAddFolder, currentView }) {
    return (
        <footer className="footer">

            <div className="footer__actions">

                {currentView === "tasks" && (
                    <button
                        type="button"
                        className="footer__button-add"
                        onClick={onAddTask}
                    >
                        + Tâche
                    </button>
                )}

                {currentView !== "folder-detail" && (
                    <button
                        type="button"
                        className="footer__button-add footer__button-add--folder"
                        onClick={onAddFolder}
                    >
                        + Dossier
                    </button>
                )}

            </div>
            <p className="footer__text">© 2026 TodoList</p>
            <p className="footer__text">Fait avec un pc et beaucoup de patience</p>
        </footer>
    );
}