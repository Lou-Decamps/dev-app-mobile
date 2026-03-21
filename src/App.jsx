import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Modal from "./components/Modal";
import { COMPLETED_STATUS } from "./constants/taskStatus";
import "./App.css";

export default function App() {
    const [task, setTask] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const totalTask = task.length;
    const unfinishedTask = task.filter(
        (t) => !COMPLETED_STATUS.includes(t.statut)
    ).length;

    function addTask(newTask) {
        setTask([...task, newTask]);
    }

    return (
        <div className="app">
            <Header
                totalTask={totalTask}
                unfinishedTask={unfinishedTask}
            />

            <main className="app__content">
                <ul className="task__list">
                    {task.length === 0 ? (
                        <li className="task__empty">
                            Aucune tâche pour l'instant. Clique sur + pour commencer !
                        </li>
                    ) : (
                        task.map((task) => (
                            <li key={task.id} className="task">
                                <span className="task__title">{task.title}</span>
                                <span className="task__status">{task.status}</span>
                            </li>
                        ))
                    )}
                </ul>
            </main>

            {isModalOpen && (
                <Modal
                    onClose={() => setIsModalOpen(false)}
                    onAdd={addTask}
                />
            )}
            <Footer onAddTask={() => setIsModalOpen(true)} />
        </div>
    );
}