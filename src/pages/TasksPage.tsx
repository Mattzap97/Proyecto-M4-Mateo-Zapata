
import { useState } from "react";
import { useNavigate } from "react-router";

import { useAuth } from "../hooks/useAuth";
import { useTasks } from "../hooks/useTasks";

import { logout } from "../services/firebase/authService";
import { getAuthErrorMessage } from "../utils/authErrors";

import TodoForm, { type TaskFormData } from "../components/tasks/TodoForm";
import TodoList from "../components/tasks/TodoList";

import type { Task } from "../types/task";
import { sendTaskSummaryEmail } from "../services/emailService";



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
    } = useTasks();

    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [logoutError, setLogoutError] = useState("");
    const [loggingOut, setLoggingOut] = useState(false);

    const [sendingEmail, setSendingEmail] = useState(false);
    const [emailSuccess, setEmailSuccess] = useState("");
    const [emailError, setEmailError] = useState("");

    // Estadísticas calculadas a partir de las tareas
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.length - completedTasks;

    // Crear o editar tarea
    const handleTaskSubmit = async (
        data: TaskFormData
    ): Promise<boolean> => {
        if (editingTask) {
            return updateTask(
                editingTask.id,
                data.title,
                data.description
            );
        }

        return createTask(data.title, data.description);
    };

    // Cerrar sesión
    const handleLogout = async () => {
        setLogoutError("");
        setLoggingOut(true);

        try {
            await logout();
            navigate("/login", { replace: true });
        } catch (error) {
            setLogoutError(getAuthErrorMessage(error));
        } finally {
            setLoggingOut(false);
        }
    };

    // Enviar resumen por email
    const handleSendSummary = async () => {
        if (!user) {
            setEmailError("Debes iniciar sesión para enviar el resumen.");
            return;
        }

        setSendingEmail(true);
        setEmailSuccess("");
        setEmailError("");

        try {
            await sendTaskSummaryEmail(user);

            setEmailSuccess(
                "¡Resumen enviado correctamente! Revisa tu correo."
            );
        } catch (error) {
            setEmailError(
                error instanceof Error
                    ? error.message
                    : "No se pudo enviar el resumen."
            );
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <main className="app-shell tasks-page">

            {/* Encabezado */}
            <header className="dashboard-header">

                <div className="brand-mark" aria-hidden="true">
                    M
                </div>

                <div className="dashboard-header__content">
                    <span className="section-kicker">
                        MATECODE / PRODUCTIVIDAD
                    </span>

                    <h1 className="page-title">
                        Mi espacio de trabajo
                    </h1>

                    <p className="page-subtitle">
                        Bienvenido,{" "}
                        <strong>{user?.email}</strong>
                    </p>
                </div>

                <button
                    type="button"
                    className="button-ghost logout-button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                >
                    {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}
                </button>
            </header>

            {logoutError && (
                <p className="feedback-error" role="alert">
                    {logoutError}
                </p>
            )}

            {/* Estadísticas */}
            <section className="stats-grid" aria-label="Resumen de tareas">

                <article className="stat-card stat-card--total">
                    <span className="stat-icon">✦</span>
                    <p className="stat-label">Total de tareas</p>
                    <p className="stat-value">{tasks.length}</p>
                </article>

                <article className="stat-card stat-card--pending">
                    <span className="stat-icon">◷</span>
                    <p className="stat-label">Pendientes</p>
                    <p className="stat-value">{pendingTasks}</p>
                </article>

                <article className="stat-card stat-card--completed">
                    <span className="stat-icon">✓</span>
                    <p className="stat-label">Completadas</p>
                    <p className="stat-value">{completedTasks}</p>
                </article>

            </section>

            {/* Resumen por email */}
            <section className="email-panel panel">

                <div className="email-panel__content">
                    <span className="section-kicker">
                        MANTENTE AL DÍA
                    </span>

                    <h2>Tu productividad, en tu correo</h2>

                    <p>
                        Recibe un resumen de tus tareas pendientes
                        y completadas directamente en tu email.
                    </p>
                </div>

                <div className="email-panel__action">
                    <button
                        type="button"
                        onClick={handleSendSummary}
                        disabled={sendingEmail}
                    >
                        {sendingEmail
                            ? "Enviando..."
                            : "Enviar resumen por email"}
                    </button>
                </div>

                {emailSuccess && (
                    <p className="feedback-success" role="status">
                        {emailSuccess}
                    </p>
                )}

                {emailError && (
                    <p className="feedback-error" role="alert">
                        {emailError}
                    </p>
                )}

            </section>

            {/* Área de trabajo */}
            <div className="dashboard-grid">

                {/* Formulario */}
                <section className="panel task-form-panel">

                    <span className="section-kicker">
                        {editingTask ? "ACTUALIZACIÓN" : "NUEVA ACTIVIDAD"}
                    </span>

                    <h2 className="panel-title">
                        {editingTask ? "Editar tarea" : "Crear nueva tarea"}
                    </h2>

                    <p className="panel-description">
                        {editingTask
                            ? "Modifica los detalles de tu actividad."
                            : "Organiza tus actividades y mantén tus objetivos claros."}
                    </p>

                    <TodoForm
                        key={editingTask?.id ?? "new"}
                        initialValues={
                            editingTask
                                ? {
                                    title: editingTask.title,
                                    description: editingTask.description,
                                }
                                : undefined
                        }
                        onSubmit={handleTaskSubmit}
                        onCancel={() => setEditingTask(null)}
                    />

                </section>

                {/* Listado de tareas */}
                <section className="panel task-list-panel">

                    <div className="task-list-header">
                        <div>
                            <span className="section-kicker">
                                ORGANIZACIÓN PERSONAL
                            </span>

                            <h2 className="panel-title">
                                Mis tareas
                            </h2>
                        </div>

                        <span className="task-count">
                            {tasks.length} actividades
                        </span>
                    </div>

                    {error && (
                        <p className="feedback-error" role="alert">
                            {error}
                        </p>
                    )}

                    {loading ? (
                        <p className="loading-state">
                            Cargando tus tareas...
                        </p>
                    ) : (
                        <TodoList
                            tasks={tasks}
                            onToggle={toggleTaskCompleted}
                            onEdit={setEditingTask}
                            onDelete={deleteTask}
                        />
                    )}

                </section>

            </div>

            <footer className="app-footer">
                <span>MateCode © 2026</span>
                <span>Organiza tus ideas. Alcanza tus objetivos.</span>
            </footer>

        </main>
    );
};

export default TasksPage;
