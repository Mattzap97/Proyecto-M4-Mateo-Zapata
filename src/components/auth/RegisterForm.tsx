/*============================================================================================================================================================================================================
                    COMPONENTE RESPONSABLE DE MOSTRAR EL FORMULARIO Y EJECUTAR LAS FUNCIONES DE AUTENTICACIÓN

Tiene 4 responsabilidades:
1. Capturar el correo electrónico
2. Capturar la contraseña
3. Verificar que ambas contraseñas coincidan
4. Registrar al usuario mediante firebase
==============================================================================================================================================================================================================*/

import { useNavigate } from "react-router";
import { useState, type FormEvent } from "react";

import { registerWithEmail } from "../../services/firebase/authService";
import { getAuthErrorMessage } from "../../utils/authErrors";


const RegisterForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);

        try {
            await registerWithEmail(email, password);
            navigate("/tasks", { replace: true });

        } catch (error) {
            setError(getAuthErrorMessage(error));

        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="auth-card" aria-labelledby="register-title">

            <header className="auth-card__header">
                <span className="auth-card__eyebrow">
                    COMIENZA HOY
                </span>

                <h1 id="register-title">
                    Crea tu cuenta
                </h1>

                <p>
                    Organiza tus actividades y alcanza tus objetivos.
                </p>
            </header>

            <form
                className="auth-form"
                onSubmit={handleRegister}
            >

                <div className="form-field">
                    <label className="form-label" htmlFor="register-email">
                        Correo electrónico
                    </label>

                    <input
                        className="form-control"
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="nombre@correo.com"
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="register-password">
                        Contraseña
                    </label>

                    <input
                        className="form-control"
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />

                    <span className="auth-field-hint">
                        La contraseña debe tener al menos 6 caracteres.
                    </span>
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="confirm-password">
                        Confirmar contraseña
                    </label>

                    <input
                        className="form-control"
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) =>
                            setConfirmPassword(event.target.value)
                        }
                        placeholder="Repite tu contraseña"
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
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
                    {loading ? "Registrando..." : "Crear cuenta"}
                </button>

            </form>

        </section>
    );
};


export default RegisterForm;
