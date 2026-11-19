
import { useState } from "react";
import type { Task } from "../../types/task";


// Formatear fechas de Firestore
const formatTaskDate = (
    timestamp: Task["createdAt"] | null | undefined
) => {
    if (!timestamp || typeof timestamp.toDate !== "function") {
        return null;
    }

    const date = timestamp.toDate();

    return {
        label: new Intl.DateTimeFormat("es-EC", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(date),
        iso: date.toISOString(),
    };
};


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

    const createdAt = formatTaskDate(task.createdAt);
    const updatedAt = formatTaskDate(task.updatedAt);


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

                {/* Información de fechas */}
                <div className="task-metadata">

                    <p className="task-metadata__item">
                        <span className="task-metadata__icon" aria-hidden="true">
                            ◷
                        </span>

                        <span>
                            <strong>Creada:</strong>{" "}
                            {createdAt ? (
                                <time dateTime={createdAt.iso}>
                                    {createdAt.label}
                                </time>
                            ) : (
                                "No disponible"
                            )}
                        </span>
                    </p>

                    <p className="task-metadata__item">
                        <span className="task-metadata__icon" aria-hidden="true">
                            ↻
                        </span>

                        <span>
                            <strong>Última actualización:</strong>{" "}
                            {updatedAt ? (
                                <time dateTime={updatedAt.iso}>
                                    {updatedAt.label}
                                </time>
                            ) : (
                                "No disponible"
                            )}
                        </span>
                    </p>

                </div>

            </article>

        </li>
    );
};



export default TodoItem;
