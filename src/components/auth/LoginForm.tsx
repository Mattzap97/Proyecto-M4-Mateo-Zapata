/*============================================================================================================================================================================================================
                    COMPONENTE RESPONSABLE DE MOSTRAR EL FORMULARIO Y EJECUTAR LAS FUNCIONES DE AUTENTICACIÓN
=============================================================================================================================================================================================================*/

import { useNavigate, useLocation } from "react-router";
import { useState, type FormEvent } from "react";

import { loginWithEmail, loginWithGoogle } from "../../services/firebase/authService";

import { getAuthErrorMessage } from "../../utils/authErrors";

interface LoginFormState {
    email: string;
    password: string;
}

function validateLogin(form: LoginFormState) {
    const errors: Partial<Record<keyof LoginFormState, string>> = {};

    if (
        !form.email.trim() ||
        !form.email.includes("@") ||
        !form.email.includes(".")
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

    const [fieldErrors, setFieldErrors] = useState<
        Partial<Record<keyof LoginFormState, string>>
    >({});

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

    // Inicio de sesión con email y contraseña
    const handleEmailLogin = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");

        const validationErrors = validateLogin({ email, password });

        setFieldErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        setLoading(true);

        try {
            await loginWithEmail(email.trim(), password);
            navigate(redirectTo, { replace: true });

        } catch (error) {
            setError(getAuthErrorMessage(error));

        } finally {
            setLoading(false);
        }
    };

    // Inicio de sesión con Google
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
    };

    return (
        <section className="auth-card" aria-labelledby="login-title">

            <header className="auth-card__header">
                <span className="auth-card__eyebrow">
                    TU ESPACIO DE PRODUCTIVIDAD
                </span>

                <h1 id="login-title">
                    ¡Qué bueno tenerte de vuelta!
                </h1>

                <p>
                    Inicia sesión para continuar organizando tus tareas.
                </p>
            </header>

            <form
                className="auth-form"
                onSubmit={handleEmailLogin}
                noValidate
            >

                <div className="form-field">
                    <label className="form-label" htmlFor="email">
                        Correo electrónico
                    </label>

                    <input
                        className="form-control"
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="nombre@correo.com"
                        autoComplete="email"
                        aria-invalid={Boolean(fieldErrors.email)}
                        aria-describedby={
                            fieldErrors.email ? "login-email-error" : undefined
                        }
                        required
                    />

                    {fieldErrors.email && (
                        <p
                            className="auth-field-error"
                            id="login-email-error"
                            role="alert"
                        >
                            {fieldErrors.email}
                        </p>
                    )}
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        className="form-control"
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Ingresa tu contraseña"
                        autoComplete="current-password"
                        aria-invalid={Boolean(fieldErrors.password)}
                        aria-describedby={
                            fieldErrors.password
                                ? "login-password-error"
                                : undefined
                        }
                        required
                    />

                    {fieldErrors.password && (
                        <p
                            className="auth-field-error"
                            id="login-password-error"
                            role="alert"
                        >
                            {fieldErrors.password}
                        </p>
                    )}
                </div>

                {error && (
                    <p className="feedback-error" role="alert">
                        {error}
                    </p>
                )}

                <button
                    className="auth-submit"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </button>

            </form>

            <div className="auth-divider">
                <span>O continúa con</span>
            </div>

            <button
                className="auth-google-button"
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
            >
                <span className="google-mark" aria-hidden="true">
                    G
                </span>

                {loading ? "Conectando..." : "Continuar con Google"}
            </button>

        </section>
    );
};

export default LoginForm;





