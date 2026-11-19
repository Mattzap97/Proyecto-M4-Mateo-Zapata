/*====================================================================================================================================================
                            ESTA PÁGINA SERÁ CONTENEDOR DEL FORMULARIO PARA REGISTRAR NUEVO USUARIO
======================================================================================================================================================*/


import RegisterForm from "../components/auth/RegisterForm";
import { Link } from "react-router";

const RegisterPage = () => {
    return (
        <main className="auth-page">
            <div className="auth-shell">

                <div className="auth-brand">
                    <span className="auth-brand__logo">M</span>
                    <span className="auth-brand__name">MateCode</span>
                </div>

                <RegisterForm />

                <p className="auth-switch">
                    ¿Ya tienes una cuenta?{" "}
                    <Link className="auth-link" to="/login">
                        Inicia sesión
                    </Link>
                </p>

            </div>
        </main>
    );
};


export default RegisterPage;
