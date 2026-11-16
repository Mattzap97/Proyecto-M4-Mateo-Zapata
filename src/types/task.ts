import type { Timestamp } from "firebase/firestore";


export interface task {
    id: string;
    userId: string;
    title: string;
    description: string;
    completed: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

