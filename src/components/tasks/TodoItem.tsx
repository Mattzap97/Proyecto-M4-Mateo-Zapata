
import { useState } from "react";
import type { Task } from "../../types/task";


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

    // Cambiar estado
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
            await onDelete(task.id);
        } finally {
            setLoading(false);
        }
    };

    return (
        <li className={`task-card ${task.completed ? "completed" : ""}`}>

            <article className="task-content">

                <div className="task-card__header">

                    <span
                        className={`status-badge ${
                            task.completed
                                ? "status-completed"
                                : "status-pending"
                        }`}
                    >
                        {task.completed ? "✓ Completada" : "◷ Pendiente"}
                    </span>

                </div>

                <h3 className="task-title">
                    {task.title}
                </h3>

                <p className="task-description">
                    {task.description}
                </p>

                <div className="task-actions">

                    <button
                        type="button"
                        className="button-secondary"
                        onClick={handleToggle}
                        disabled={loading}
                    >
                        {task.completed
                            ? "Marcar como pendiente"
                            : "Marcar como completada"}
                    </button>

                    <button
                        type="button"
                        className="button-ghost"
                        onClick={() => onEdit(task)}
                        disabled={loading}
                    >
                        Editar
                    </button>

                    <button
                        type="button"
                        className="button-danger"
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

export default TodoItem;
