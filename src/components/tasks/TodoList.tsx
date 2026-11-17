import type { Task } from "../../types/task";
import TodoItem from "./TodoItem";



// Definición de las propiedades del componente
interface TodoListProps {
    tasks: Task[];
    onToggle: (taskId: string, completed: boolean) => Promise<void>;
    onEdit: (task: Task) => void,
    onDelete: (taskId: string) => Promise<void>
}


const TodoList = ({
    tasks,
    onToggle,
    onEdit,
    onDelete
}: TodoListProps) => {


    // Comprobar si existen tareas
    if(tasks.length === 0) {
        return <p>No tienes tareas pendientes.</p>
    }


    return (
        <ul className="todo-list">
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
    )
}



export default TodoList;