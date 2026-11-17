import { addDoc, collection, serverTimestamp,onSnapshot, query, where, type Unsubscribe, orderBy } from "firebase/firestore";
import { db } from "./firebaseConfig";
import type { Task } from "../../types/task";


/*====================================================================================================================================================================
                                                CRUD DE TAREAS -- CREAR TAREA
======================================================================================================================================================================*/

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

/*=================================================================================================================================================================                                                CRUD DE TAREAS -- SUSCRIPCIONES DE TAREAS===
                            CRUD DE TAREAS -- OBTENER O LEER LAS TAREAS DE UN USUARIO EN TIEMPO REAL
=====================================================================================================================================================================*/

export const suscribeToTasks = (
    userId: string,
    onTasksChange: (tasks: Task[]) => void,
    onError: (error: Error) => void,

) : Unsubscribe => {

    const tasksQuery = query (
        collection (db, "tasks"),
        where ("userId", "==", userId),
        orderBy ("createdAt", "desc")
    );


    return onSnapshot (
        tasksQuery,
        (snapshot) => {
            const tasks = snapshot.docs.map((taskDoc) => ({
                id: taskDoc.id,
                ...taskDoc.data ({
                    serverTimestamps: "estimate",
                }),
            })) as Task[];

            onTasksChange(tasks);
        },

        onError
    );

}