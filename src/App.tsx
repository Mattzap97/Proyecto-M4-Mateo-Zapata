import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./routes/ProtectedRoute";


function App() {
    return (
        <Routes>

            <Route path="/" element={<Navigate to="/login" replace />}/>    // Ruta inicial Redirige a /login

            <Route path="/login" element={<LoginPage />}/>   // Rutas públicas
            <Route path="/register" element={<RegisterPage />}/>

            <Route element={<ProtectedRoute />}>
                <Route path="/tasks" element={<TasksPage />}/>  // Rutas privadas
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />}/>  // Rutas para direcciones inexistentes

            
        </Routes>
    )

}


export default App;