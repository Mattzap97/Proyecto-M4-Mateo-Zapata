import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Crear una nueva tarea
export const createTask = async (
    userId: string,
    title: string,
    description: string

): Promise<string> => {

    const taskRef = await addDoc(collection(db, "tasks"), {

        userId,
        title: title.trim(),
        description: description.trim(),
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

    });

    return taskRef.id;

}

