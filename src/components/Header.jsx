export default function Header({ totalTaches, tachesNonFinies }) {
    return (
    <header className="header">
    <h1 className="header__title">To Do List</h1>
    <p className="header__subtitle">Organise ta vie simplement</p>
    <div className="header__stats">
    <span className="header__stat">Total : {totalTaches} tâche(s)</span>
<span className="header__separator">|</span>
<span className="header__stat">Non terminées : {tachesNonFinies} tâche(s)</span>
</div>
</header>
);
}