/*============================================================================================================================================================================================================
                    COMPONENTE RESPONSABLE DE MOSTRAR EL FORMULARIO Y EJECUTAR LAS FUNCIONES DE AUTENTICACIÓN
=============================================================================================================================================================================================================*/

import { useState, type FormEvent } from "react";
import { loginWithEmail, loginWithGoogle } from "../../services/firebase/authService";
import { getAuthErrorMessage } from "../../utils/authErrors";


const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleEmailLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            await loginWithEmail(email, password);

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

        } catch (error) {
            setError(getAuthErrorMessage(error));

        } finally {
            setLoading(false);

        }

    }

    return (
        <section>

            <h2>Iniciar sesión</h2>

            <form onSubmit={handleEmailLogin}>
                <div>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required
                    />
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