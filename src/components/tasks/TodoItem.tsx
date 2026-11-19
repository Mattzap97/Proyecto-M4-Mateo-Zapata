import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const cancelButtonRef = useRef<HTMLButtonElement>(null);
    const deletingRef = useRef(false);



    // Gestionar el foco y la tecla Escape de la ventana
    useEffect(() => {
        if (!showDeleteConfirmation) return;

        const previousFocus = document.activeElement as HTMLElement | null;

        cancelButtonRef.current?.focus();

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !deletingRef.current) {
                setShowDeleteConfirmation(false);
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
            previousFocus?.focus();
        };
    }, [showDeleteConfirmation]);



    // Cambiar estado
    const handleToggle = async () => {
        setLoading(true);

        try {
            await onToggle(task.id, !task.completed);
        } finally {
            setLoading(false);
        }
    };



    // Eliminar tarea después de confirmar
    const handleDelete = async () => {
        setLoading(true);
        deletingRef.current = true;

        try {
            await onDelete(task.id);
            setShowDeleteConfirmation(false);
        } finally {
            deletingRef.current = false;
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
                        onClick={() => setShowDeleteConfirmation(true)}
                        disabled={loading}
                    >
                        Eliminar
                    </button>

                </div>

            </article>

            {/* Ventana de confirmación */}
            {showDeleteConfirmation && createPortal(

                <div className="task-delete-backdrop">

                    <section
                        className="task-delete-dialog"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="delete-dialog-title"
                        aria-describedby="delete-dialog-description"
                    >

                        <div className="task-delete-dialog__icon">
                            !
                        </div>

                        <h2 id="delete-dialog-title">
                            ¿Eliminar esta tarea?
                        </h2>

                        <p id="delete-dialog-description">
                            ¿Estás seguro de que deseas eliminar{" "}
                            <strong>"{task.title}"</strong>?
                            Esta acción no se puede deshacer.
                        </p>

                        <div className="task-delete-dialog__actions">

                            <button
                                ref={cancelButtonRef}
                                type="button"
                                className="task-delete-dialog__cancel"
                                onClick={() => setShowDeleteConfirmation(false)}
                                disabled={loading}
                            >
                                No, conservar
                            </button>

                            <button
                                type="button"
                                className="task-delete-dialog__confirm"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? "Eliminando..." : "Sí, eliminar"}
                            </button>

                        </div>

                    </section>

                </div>,

                document.body
            )}

        </li>
    );
};



export default TodoItem;
