export default function Footer({ onAddTask }) {
    return (
        <footer className="footer">
            <button
            type="button"
            className="footer__button-to-add"
            onClick={onAddTask}
        >
            +
        </button>
            <p className="footer__texte">© 2026 TodoList</p>
            <p className="footer__texte">Fait avec un pc et beaucoup de patience</p>

        </footer>
    );
}