/*============================================================================================================================================================================================================
                    COMPONENTE RESPONSABLE DE MOSTRAR EL FORMULARIO Y EJECUTAR LAS FUNCIONES DE AUTENTICACIÓN

Tiene 4 responsabilidades:
1. Capturar el correo electrónico
2. Capturar la contraseña
3. Verificar que ambas contraseñas coincidan
4. Registrar al usuario mediante firebase
==============================================================================================================================================================================================================*/

import { useNavigate } from "react-router"
import { useState, type FormEvent } from "react";
import { registerWithEmail } from "../../services/firebase/authService";
import { getAuthErrorMessage } from "../../utils/authErrors";


const RegisterForm = () => {
    const [email, setEmail] = useState ("");
    const [password, setPassword] = useState ("");
    const [confirmPassword, setConfirmPassword] = useState ("");
    const [error, setError] = useState ("");
    const [loading, setLoading] = useState (false);


    const navigate = useNavigate();


    const handleRegister = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError ("");

        if (password !== confirmPassword) {
            setError ("Las contraseñas no coinciden.");
            return;
        }

        setLoading (true);

        try {
            await registerWithEmail (email, password);
            navigate("/tasks", { replace: true });

        } catch (error) {
            setError(getAuthErrorMessage(error));

        } finally {
            setLoading (false);

        }

    }


    return (
        <section>
            <h2>Crear Cuenta</h2>

            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor="register-email">Correo Electrónico</label>
                    <input
                        id="register-email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="register-password">Contraseña</label>
                    <input
                        id="register-password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="confirm-password">Confirmar contraseña</label>
                    <input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                </div>

                {error && <p role="alert">{error}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Registrando..." : "Crear cuenta"}
                </button>
            </form>

        </section>
    )
}




export default RegisterForm;
