import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";


const ProtectedRoute = () => {
    const {user, loading} = useAuth();
    const location = useLocation();  // Obtiene la ubicación actual del usuario


    if(loading) {
        return <p>Verificando sesión...</p>
    }


    if(!user) {
        return (
            <Navigate
                    to="/login"
                    state={{from: location}}  // Guarda la ruta original para recuperarla posteriormente desde la página de Login
                    replace // Evita que el usuario vuelva a la ruta protegida mediante el historial del navegador
            />
        )
    }


    return <Outlet />;

};


export default ProtectedRoute;