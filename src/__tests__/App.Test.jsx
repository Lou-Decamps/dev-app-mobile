import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../App";
import { useTasks } from "../hooks/useTasks";


jest.mock("../hooks/useTasks", () => ({
    __esModule: true,
    useTasks: jest.fn(),  // ← jest.fn(), not () => ({...})
}));

jest.mock("../hooks/useFolders", () => ({
    useFolders: () => ({
        folders: [],
        addFolder: jest.fn(),
        updateFolder: jest.fn(),
        deleteFolder: jest.fn(),
    }),
}));

jest.mock("../hooks/useLocalStorage", () => ({
    useLocalStorage: (key, defaultValue) => [defaultValue, jest.fn()],
}));

jest.mock("../components/Header", () => ({
    __esModule: true,
    default: ({ totalTasks, incompleteTasks }) => (
        <header data-testid="header">
            Header — total:{totalTasks} incomplete:{incompleteTasks}
        </header>
    ),
}));

jest.mock("../components/Footer", () => ({
    __esModule: true,
    default: ({ onAddTask, onAddFolder }) => (
        <footer data-testid="footer">
            <button onClick={onAddTask}>Ajouter une tâche</button>
            <button onClick={onAddFolder}>Ajouter un dossier</button>
        </footer>
    ),
}));

jest.mock("../components/SortFilterBar", () => ({
    __esModule: true,
    default: () => <div data-testid="sort-filter-bar" />,
}));

jest.mock("../components/FolderList", () => ({
    __esModule: true,
    default: ({ onFolderClick, onFolderEdit }) => (
        <div data-testid="folder-list">
            <button onClick={() => onFolderClick({ id: "f1", name: "Dossier 1" })}>
                Ouvrir dossier
            </button>
            <button onClick={() => onFolderEdit({ id: "f1", name: "Dossier 1" })}>
                Éditer dossier
            </button>
        </div>
    ),
}));

jest.mock("../components/FolderDetail", () => ({
    __esModule: true,
    default: ({ folder, onBack }) => (
        <div data-testid="folder-detail">
            <span>{folder.name}</span>
            <button onClick={onBack}>Retour</button>
        </div>
    ),
}));

jest.mock("../components/Modal", () => ({
    __esModule: true,
    default: ({ onClose }) => (
        <div data-testid="modal">
            <button onClick={onClose}>Fermer Modal</button>
        </div>
    ),
}));

jest.mock("../components/FolderModal", () => ({
    __esModule: true,
    default: ({ onClose }) => (
        <div data-testid="folder-modal">
            <button onClick={onClose}>Fermer FolderModal</button>
        </div>
    ),
}));

jest.mock("../components/TaskCard", () => ({
    __esModule: true,
    default: ({ task }) => <li data-testid={`task-${task.id}`}>{task.title}</li>,
}));

beforeEach(() => {
    useTasks.mockReturnValue({
        tasks: [],
        addTask: jest.fn(),
        updateTask: jest.fn(),
        deleteTask: jest.fn(),
        addFolderToTask: jest.fn(),
        showRestoreBanner: false,
        handleRestoreYes: jest.fn(),
        handleRestoreNo: jest.fn(),
        resetToBackup: jest.fn(),
    });
});

describe("App", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("affiche le Header et le Footer", () => {
        render(<App />);
        expect(screen.getByTestId("header")).toBeInTheDocument();
        expect(screen.getByTestId("footer")).toBeInTheDocument();
    });

    it("affiche la vue Tâches par défaut", () => {
        render(<App />);
        expect(screen.getByTestId("sort-filter-bar")).toBeInTheDocument();
    });

    it("affiche le message jestde quand il n'y a aucune tâche", () => {
        render(<App />);
        expect(screen.getByText(/aucune tâche non terminée/i)).toBeInTheDocument();
    });

    it("affiche le compteur avec 0 tâches dans les onglets", () => {
        render(<App />);
        expect(screen.getByText(/tâches \(0\)/i)).toBeInTheDocument();
        expect(screen.getByText(/dossiers \(0\)/i)).toBeInTheDocument();
    });

    it("bascule vers la vue Dossiers en cliquant sur l'onglet", () => {
        render(<App />);
        fireEvent.click(screen.getByText(/dossiers/i));
        expect(screen.getByTestId("folder-list")).toBeInTheDocument();
    });

    it("rejestent à la vue Tâches en cliquant sur l'onglet Tâches", () => {
        render(<App />);
        fireEvent.click(screen.getByText(/dossiers/i));
        fireEvent.click(screen.getByText(/tâches/i));
        expect(screen.getByTestId("sort-filter-bar")).toBeInTheDocument();
    });

    it("ouvre la Modal quand on clique sur Ajouter une tâche", () => {
        render(<App />);
        fireEvent.click(screen.getByText("Ajouter une tâche"));
        expect(screen.getByTestId("modal")).toBeInTheDocument();
    });

    it("ferme la Modal quand onClose est appelé", () => {
        render(<App />);
        fireEvent.click(screen.getByText("Ajouter une tâche"));
        fireEvent.click(screen.getByText("Fermer Modal"));
        expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });

    it("ouvre la FolderModal quand on clique sur Ajouter un dossier", () => {
        render(<App />);
        fireEvent.click(screen.getByText("Ajouter un dossier"));
        expect(screen.getByTestId("folder-modal")).toBeInTheDocument();
    });

    it("ferme la FolderModal quand onClose est appelé", () => {
        render(<App />);
        fireEvent.click(screen.getByText("Ajouter un dossier"));
        fireEvent.click(screen.getByText("Fermer FolderModal"));
        expect(screen.queryByTestId("folder-modal")).not.toBeInTheDocument();
    });

    it("affiche FolderDetail quand on clique sur un dossier", () => {
        render(<App />);
        fireEvent.click(screen.getByText(/dossiers/i));
        fireEvent.click(screen.getByText("Ouvrir dossier"));
        expect(screen.getByTestId("folder-detail")).toBeInTheDocument();
        expect(screen.getByText("Dossier 1")).toBeInTheDocument();
    });

    it("rejestent à la liste des dossiers depuis FolderDetail", () => {
        render(<App />);
        fireEvent.click(screen.getByText(/dossiers/i));
        fireEvent.click(screen.getByText("Ouvrir dossier"));
        fireEvent.click(screen.getByText("Retour"));
        expect(screen.getByTestId("folder-list")).toBeInTheDocument();
        expect(screen.queryByTestId("folder-detail")).not.toBeInTheDocument();
    });

    it("ouvre la FolderModal en mode édition depuis FolderList", () => {
        render(<App />);
        fireEvent.click(screen.getByText(/dossiers/i));
        fireEvent.click(screen.getByText("Éditer dossier"));
        expect(screen.getByTestId("folder-modal")).toBeInTheDocument();
    });

    it("n'affiche pas la bannière de restauration par défaut", () => {
        render(<App />);
        expect(screen.queryByText(/sauvegarde/i)).not.toBeInTheDocument();
    });
});

describe("App — bannière de restauration", () => {
    it("affiche la bannière quand showRestoreBanner est true", () => {
        useTasks.mockReturnValue({  // no async/await needed
            tasks: [],
            addTask: jest.fn(),
            updateTask: jest.fn(),
            deleteTask: jest.fn(),
            addFolderToTask: jest.fn(),
            showRestoreBanner: true,  // ← only difference
            handleRestoreYes: jest.fn(),
            handleRestoreNo: jest.fn(),
            resetToBackup: jest.fn(),
        });

        render(<App />);
        expect(screen.getByText(/sauvegarde a été trouvée/i)).toBeInTheDocument();
        expect(screen.getByText(/oui, reprendre/i)).toBeInTheDocument();
        expect(screen.getByText(/non, repartir/i)).toBeInTheDocument();
    });
});