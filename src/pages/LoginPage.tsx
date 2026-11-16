/*=====================================================================================================================================================
                                ESTA PÁGINA SERÁ EL CONTENEDOR DEL FORMULARIO PARA INICIAR SESIÓN
=======================================================================================================================================================*/

import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router";

const LoginPage = () => {

    return (

        <main className="auth-page">
            <LoginForm/>

            <p>
                ¿No tienes una cuenta?{" "}
                <Link to="/register">Regístrate aquí</Link>
            </p>
            
        </main>

    )
}


export default LoginPage;