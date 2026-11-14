import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../../services/firebase/firebaseConfig";


// Definir la estructura del contexto
interface AuthContextType {
    user: User | null,
    loading: boolean;
}


// Crear el contexto
export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
)


// Definir las propiedades del provider
interface AuthProviderProps {
    children: ReactNode;
}


// Componente proveedor
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const unsuscribe = onAuthStateChanged(auth,(firebaseUser) =>{
            setUser(firebaseUser);
            setLoading(false);

        });

        // CleanUp: Cancelar la suscripción al desmontar
        return () => unsuscribe();
    }, [] );


    return (
        <AuthContext.Provider value={{user, loading}}>
            {children}
        </AuthContext.Provider>
    );

}