export default function Footer({ onAjouterTache }) {
    return (
        <footer className="footer">
            <p className="footer__texte">© 2026 TodoList</p>
            <p className="footer__texte">Fait avec un pc et beaucoup de patience</p>
            <button
                type="button"
                className="footer__button-to-add"
                onClick={onAjouterTache}
            >
                +
            </button>
        </footer>
    );
}