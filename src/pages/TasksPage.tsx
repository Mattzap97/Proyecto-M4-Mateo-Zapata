import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { logout } from "../services/firebase/authService";
import { getAuthErrorMessage } from "../utils/authErrors";




const TasksPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();


    const [error, setError] = useState("");
    const [loggingOut, setLoggingOut] = useState (false);

    const handleLogout = async () => {
        setError ("")
        setLoggingOut (true);


        try {
            await logout ();
            navigate ("/login", { replace: true });

        } catch (error) {
            setError (getAuthErrorMessage(error));

        } finally {
            setLoggingOut (false);

        }

    }

    return (
        <main>
            
            <h1>Gestor de tareas MateCode</h1>

            <p>Bienvenido, {user?.email}</p>

            <p>Esta es tu área privada de tareas.</p>

            {error && <p role="alert">{error}</p>}

            <button onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? "Cerrando sesión..." : "Cerrar sesión"}      
            </button>

        </main>
    )
};



export default TasksPage;


