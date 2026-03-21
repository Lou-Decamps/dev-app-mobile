import { TaskStatus } from "../constants/taskStatus";

export const TACHES_DE_TEST = [
    {
        id: 1,
        title: "Manger",
        description: "",
        creationDate: new Date("2026-03-01"),
        duDate: new Date("2026-03-22"),
        status: TaskStatus.FINISHED,
        folder: [],
    },
    {
        id: 2,
        title: "Dormir",
        description: "8 heures minimum",
        creationDate: new Date("2026-03-01"),
        duDate: new Date("2026-03-23"),
        status: TaskStatus.IN_PROGRESS,
        folder: [],
    },
    {
        id: 3,
        title: "Répéter",
        description: "",
        creationDate: new Date("2026-03-01"),
        duDate: new Date("2026-03-25"),
        status: TaskStatus.TO_DO,
        folder: [],
    },
];