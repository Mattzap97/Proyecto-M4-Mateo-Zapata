import { useState, type FormEvent } from "react";


// Define los datos que recibirá el formulario
export interface TaskFormData {
    title: string;
    description: string;
}


// Propiedades del componente 
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
    const [description, setDescription] = useState( initialValues?.description ?? "")

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);


    // Enviar formulario
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if(!title.trim()) {
            setError( "El título es obligatorio." );
            return;
        }

        if(!description.trim()) {
            setError( "La descripción es obligatoria" );
            return;
        }

        setLoading(true);


        try {
            const success = await onSubmit({
                title: title.trim(),
                description: description.trim(),

            });

            if(success) {
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
            setLoading(false)
        }
    };

    

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div>
                <label htmlFor="task-title">Título de la tarea</label>

                <input
                    id="task-title"
                    type="text"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ejemplo: Completar proyecto integrador"
                    required
                />
            </div>

            <div>
                <label htmlFor="task-description">Descripción</label>

                <textarea
                    id="task-description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Describe brevemente la tarea..."
                    required
                />
            </div>

            {error && <p role="alert">{error}</p>}


            <button type="submit" disabled={loading}>

                {loading
                    ? "Guardando"
                    : initialValues
                        ? "Guardar cambios"
                        : "Crear tarea"}

            </button>


            {initialValues && onCancel && (
                <button type="button" onClick={onCancel} disabled={loading}>
                    Cancelar
                </button>
            )}

        </form>
    );
};




export default TodoForm;