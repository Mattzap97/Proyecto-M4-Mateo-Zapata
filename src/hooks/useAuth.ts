import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthProvider";


// Hook para poder consultar de manera sencilla el contexto desde cualquier componente
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth debe utilizarse dentro de AuthProvider");
    }

    return context;
}