import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";
import{ useTasks } from "../hooks/useTasks";

import { logout } from "../services/firebase/authService";
import { getAuthErrorMessage } from "../utils/authErrors";

import TodoForm, { type TaskFormData } from "../components/tasks/TodoForm";
import TodoList from "../components/tasks/TodoList";

import type { Task } from "../types/task";



const TasksPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();


    const {
        tasks,
        loading,
        error,
        createTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
        
    } = useTasks ();


    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [logoutError, setLogoutError] = useState("");
    const [loggingOut, setLoggingOut] = useState (false);

    
    // Crear o editar una tarea
    const handleTaskSubmit = async( data: TaskFormData ): Promise<boolean> => {
        
        if(editingTask) {
            return updateTask (
                editingTask.id,
                data.title,
                data.description
            )
        }

        return createTask(data.title, data.description)
    };


    // Cerrar sesión
    const handleLogout = async () => {
        setLogoutError("");
        setLoggingOut(true)
    

        try {
            await logout ();
            navigate ("/login", { replace: true });

        } catch (error) {
            setLogoutError (getAuthErrorMessage(error));

        } finally {
            setLoggingOut (false);

        }

    };

    return (
        <main>
            <header>
                <h1>Gestor de tareas MateCode</h1>
                <p>Bienvenido, {user?.email}</p>
            
                <button 
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                >
                    {loggingOut ? "Cerrando sesión" : "Cerrar sesión"}
                </button>

                {logoutError && (<p role="alert">{logoutError}</p>)}

            </header>


            <section>
                <h2>
                    {editingTask ? "Editar tarea" : "Crear nueva tarea"}
                </h2>

                <TodoForm
                    key={editingTask?.id ?? "new"}
                    initialValues={
                        editingTask ? {title: editingTask.title, description: editingTask.description,} : undefined }
                    
                    onSubmit={handleTaskSubmit}
                    onCancel={() => setEditingTask(null)}
                />
            </section>


            <section>
                <h2>Mis tareas</h2>

                {error && <p role="alert">{error}</p>}

                {loading ? (
                    <p>Cargando tareas...</p>
                ): (
                    <TodoList
                        tasks={tasks}
                        onToggle={toggleTaskCompleted}
                        onEdit={setEditingTask}
                        onDelete={deleteTask}
                    />
                )}

            </section>
        </main>
    );
};



export default TasksPage;


