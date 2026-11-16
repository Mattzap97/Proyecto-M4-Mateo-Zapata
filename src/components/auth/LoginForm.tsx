/*============================================================================================================================================================================================================
                    COMPONENTE RESPONSABLE DE MOSTRAR EL FORMULARIO Y EJECUTAR LAS FUNCIONES DE AUTENTICACIÓN
=============================================================================================================================================================================================================*/

import { useNavigate, useLocation } from "react-router"
import { useState, type FormEvent } from "react";
import { loginWithEmail, loginWithGoogle } from "../../services/firebase/authService";
import { getAuthErrorMessage } from "../../utils/authErrors";


interface LoginFormState {
    email: string;
    password: string;
}


function validateLogin( form: LoginFormState ) {
    const errors: Partial<Record<keyof LoginFormState, string>> = {};

    if (

        !form.email.trim ||
        !form.email.includes('@') ||
        !form.email.includes('.')
    ) {
        errors.email = "Ingresa un email válido.";
    }

    if (!form.password.trim() || form.password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    return errors;


}


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormState, string>>>({});


    const navigate = useNavigate();
    const location = useLocation();

    const redirectState = location.state as {
        from?: {
            pathname?: string;
            search?: string;
            hash?: string;
        };
    } | null;

    const requestedPath = redirectState?.from?.pathname;


    const redirectTo =
        requestedPath?.startsWith("/") &&
            !requestedPath.startsWith("//")
            ? `${requestedPath}${redirectState?.from?.search ?? ""}${redirectState?.from?.hash ?? ""}`
            : "/tasks";



    const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        
        const validationErrors = validateLogin({ email, password });

        setFieldErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading (true);

        try {
            await loginWithEmail(email.trim(), password);
            navigate(redirectTo, { replace: true });

        } catch (error) {
            setError(getAuthErrorMessage(error));

        } finally {
            setLoading(false)

        }

    }

    const handleGoogleLogin = async () => {

        setError("");
        setLoading(true);

        try {
            await loginWithGoogle();
            navigate(redirectTo, { replace: true });

        } catch (error) {
            setError(getAuthErrorMessage(error));

        } finally {
            setLoading(false);

        }

    }

    return (
        <section>

            <h2>Iniciar sesión</h2>

            <form onSubmit={handleEmailLogin} noValidate>
                <div>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />

                    {fieldErrors.email && (<p role="alert">{fieldErrors.email}</p>)}
                </div>

                <div>
                    <label htmlFor="password">Contraseña</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />

                    {fieldErrors.password && (<p role="alert">{fieldErrors.password}</p>)}
                </div>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>
            </form>

            <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
            >
                Continuar con Google
            </button>

        </section>

    )
}

export default LoginForm;




