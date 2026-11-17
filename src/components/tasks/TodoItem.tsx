import { useState } from "react";
import type { Task } from "../../types/task";


// Propiedades del componente
interface TodoItemProps {
    task: Task;
    onToggle: (taskId: string, completed: boolean) => Promise<void>;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => Promise<void>;
}


const TodoItem = ({
    task,
    onToggle,
    onEdit,
    onDelete,
}: TodoItemProps) => {

    const [loading, setLoading] = useState(false);


    // Cambiar estado de la tarea
    const handleToggle = async () => {
        setLoading(true);


        try {
            await onToggle(task.id, !task.completed);

        } finally {
            setLoading(false);

        }
    };


    // Eliminar tarea
    const handleDelete = async () => {
        setLoading(true);


        try {
            await onDelete(task.id)

        } finally {
            setLoading(false);

        }
    };



    return (
        <li className="todo-item">
            <article>
                <h3 className={task.completed ? "completed" : ""}>
                    {task.title}
                </h3>

                <p>{task.description}</p>

                <span>
                    {task.completed ? "Completada" : "Pendiente"}
                </span>


                <div>
                    <button
                        type="button"
                        onClick={handleToggle}
                        disabled={loading}
                    >
                        {task.completed ? "Marcar como pendiente" : "Marcar como completada"}
                    </button>

                    <button
                        type="button"
                        onClick={() => onEdit(task)}
                        disabled={loading}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        Eliminar
                    </button>
                </div>
            </article>
        </li>

    );
};



export default TodoItem