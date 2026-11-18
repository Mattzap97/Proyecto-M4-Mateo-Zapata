
import type { Task } from "../../types/task";
import TodoItem from "./TodoItem";


interface TodoListProps {
    tasks: Task[];
    onToggle: (taskId: string, completed: boolean) => Promise<void>;
    onEdit: (task: Task) => void;
    onDelete: (taskId: string) => Promise<void>;
}

const TodoList = ({
    tasks,
    onToggle,
    onEdit,
    onDelete,
}: TodoListProps) => {

    if (tasks.length === 0) {
        return (
            <div className="empty-state">
                <span className="empty-state__icon">✦</span>

                <h3>¡Todo comienza aquí!</h3>

                <p>No tienes tareas pendientes.</p>

                <span className="empty-state__hint">
                    Crea una actividad y comienza a organizarte.
                </span>
            </div>
        );
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TodoItem
                    key={task.id}
                    task={task}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </ul>
    );
};

export default TodoList;
