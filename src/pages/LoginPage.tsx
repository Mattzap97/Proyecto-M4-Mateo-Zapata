/*=====================================================================================================================================================
                                ESTA PÁGINA SERÁ EL CONTENEDOR DEL FORMULARIO PARA INICIAR SESIÓN
=======================================================================================================================================================*/


import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router";

const LoginPage = () => {
    return (
        <main className="auth-page">
            <div className="auth-shell">

                <div className="auth-brand">
                    <span className="auth-brand__logo">M</span>
                    <span className="auth-brand__name">MateCode</span>
                </div>

                <LoginForm />

                <p className="auth-switch">
                    ¿No tienes una cuenta?{" "}
                    <Link className="auth-link" to="/register">
                        Regístrate aquí
                    </Link>
                </p>

            </div>
        </main>
    );
};



export default LoginPage;
