
import { useState, type FormEvent } from "react";



export interface TaskFormData {
    title: string;
    description: string;
}

interface TodoFormProps {
    onSubmit: (data: TaskFormData) => Promise<boolean>;
    initialValues?: TaskFormData;
    onCancel?: () => void;
}

const TodoForm = ({
    onSubmit,
    initialValues,
    onCancel,
}: TodoFormProps) => {

    const [title, setTitle] = useState(initialValues?.title ?? "");
    const [description, setDescription] = useState(
        initialValues?.description ?? ""
    );

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!title.trim()) {
            setError("El título es obligatorio.");
            return;
        }

        if (!description.trim()) {
            setError("La descripción es obligatoria");
            return;
        }

        setLoading(true);

        try {
            const success = await onSubmit({
                title: title.trim(),
                description: description.trim(),
            });

            if (success) {
                if (initialValues) {
                    onCancel?.();
                } else {
                    setTitle("");
                    setDescription("");
                }
            }

        } catch {
            setError("No se pudo guardar la tarea. Inténtalo nuevamente.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            className="todo-form"
            onSubmit={handleSubmit}
            noValidate
        >

            <div className="form-field">
                <label
                    className="form-label"
                    htmlFor="task-title"
                >
                    Título de la tarea
                </label>

                <input
                    className="form-control"
                    id="task-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ej. Completar proyecto integrador"
                    required
                />
            </div>

            <div className="form-field">
                <label
                    className="form-label"
                    htmlFor="task-description"
                >
                    Descripción
                </label>

                <textarea
                    className="form-control"
                    id="task-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe brevemente tu actividad..."
                    rows={4}
                    required
                />
            </div>

            {error && (
                <p className="feedback-error" role="alert">
                    {error}
                </p>
            )}

            <div className="form-actions">

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Guardando..."
                        : initialValues
                            ? "Guardar cambios"
                            : "Crear tarea"}
                </button>

                {initialValues && onCancel && (
                    <button
                        className="button-ghost"
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                )}

            </div>

        </form>
    );
};

export default TodoForm;
