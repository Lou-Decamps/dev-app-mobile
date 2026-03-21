export default function Footer({ onAddTask, onAddFolder, currentView }) {
    return (
        <footer className="footer">
            <p className="footer__text">© 2026 TodoList</p>
            <p className="footer__text">Fait avec un pc et beaucoup de patience</p>
            <div className="footer__actions">

                {/* Bouton tâche — seulement sur la vue tâches */}
                {currentView === "tasks" && (
                    <button
                        type="button"
                        className="footer__button-add"
                        onClick={onAddTask}
                    >
                        + Tâche
                    </button>
                )}

                {/* Bouton dossier — masqué sur la page de détail */}
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
        </footer>
    );
}