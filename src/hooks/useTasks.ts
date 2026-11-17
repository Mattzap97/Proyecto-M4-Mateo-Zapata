import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { useAuth } from "./useAuth";

import {
    createTask as createTaskService,
    suscribeToTasks,
    updateTask as updateTaskService,
    toggleTaskCompleted as toggleTaskCompletedService,
    deleteTask as deleteTaskService
} from "../services/firebase/taskService";


// Hook personalizado para gestionar las tareas del usuario
export const useTasks = () => {
    const { user } = useAuth();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const userId = user?.uid;

    // Escuchar los cambios de firestore
    useEffect(() => {

        if(!userId) {
            setTasks([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);


        const unsubscribe = suscribeToTasks(

            userId,
            (updatedTasks) => {
                setTasks(updatedTasks);
                setLoading(false);
            },
            (error) => {
                setError(error.message);
                setLoading(false)
            }

        );


        // Cancelar suscripción al desmontar
        return () => unsubscribe();

    }, [userId]);


    // Crear tarea
    const createTask = async (
        title: string,
        description: string

    ): Promise<boolean> => {
        if(!userId) {
            setError("Debes iniciar sesión para crear tareas.");
            return false;
        }

        try {
            setError(null);
            await createTaskService(userId, title, description)
            return true;

        } catch (error) {
            setError(getTaskErrorMessage(error));
            return false;

        }

    };


    // Editar tarea
    const updateTask = async (
        taskId: string,
        title: string,
        description: string

    ): Promise<boolean> => {
        if(!userId) {
            setError("Debes iniciar sesión para editar tareas")
            return false;
        }


        try {
            setError(null);
            await updateTaskService(taskId, title, description);
            return true;

        } catch (error) {
            setError(getTaskErrorMessage(error));
            return false;

        }
    };


    // Cambiar estado de finalización
    const toggleTaskCompleted = async (
        taskId: string,
        completed: boolean

    ) => {

        try {
            setError(null);
            await toggleTaskCompletedService(taskId, completed);
            
        } catch (error) {
            setError(getTaskErrorMessage(error));

        }

    };


    // Eliminar tarea
    const deleteTask = async (taskId: string) => {

        try {
            setError(null);
            await deleteTaskService(taskId);

        } catch (error) {
            setError(getTaskErrorMessage(error));

        }

    };


    return {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
    };

}


// Obtener un mensaje de error comprensible
const getTaskErrorMessage = (error: unknown): string => {

    return error instanceof Error ? error.message : "Ocurrió un error al gestionar la tarea"
}
