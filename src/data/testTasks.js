import { TaskStatus } from "../constants/taskStatus";

export const TACHES_DE_TEST = [
    {
        id: 1,
        title: "Manger",
        description: "",
        creationDate: new Date("2026-03-01"),
        duDate: new Date("2026-03-22"),
        statut: TaskStatus.FINISHED,
        file: [],
    },
    {
        id: 2,
        title: "Dormir",
        description: "8 heures minimum",
        creationDate: new Date("2026-03-01"),
        duDate: new Date("2026-03-23"),
        statut: TaskStatus.IN_PROGRESS,
        file: [],
    },
    {
        id: 3,
        title: "Répéter",
        description: "",
        creationDate: new Date("2026-03-01"),
        duDate: new Date("2026-03-25"),
        statut: TaskStatus.TO_DO,
        file: [],
    },
];