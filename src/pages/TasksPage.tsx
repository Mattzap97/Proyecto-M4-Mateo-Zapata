import { useAuth } from "../hooks/useAuth";

const TasksPage = () => {
    const { user } = useAuth();

    return (
        <main>
            <h1>Gestor de tareas MateCode</h1>

            <p>Bienvenido, {user?.email}</p>

            <p>Esta es tu área privada de tareas.</p>

        </main>
    )
};



export default TasksPage;


