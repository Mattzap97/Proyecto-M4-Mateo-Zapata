/*==================================================================================================================================================================
            FUNCIÓN QUE SE ENCARGARÁ DE CENTRALIZAR LA TRADUCCIÓN DE ERRORES PARA EVITAR REPETIR CONDICIONES EN CADA FORMULARIO
=====================================================================================================================================================================*/

export const getAuthErrorMessage = (error: unknown): string => {

    const errorCode =
        typeof error === "object" &&
            error !== null &&
            "code" in error &&
            typeof error.code === "string" ? error.code : "";



    switch (errorCode) {

        // Registro
        case "auth/email-already-in-use":
            return "Este correo electrónico ya está registrado.";

        case "auth/invalid-email":
            return "El correo electrónico no es válido.";

        case "auth/weak-password":
            return "La contraseña debe tener al menos 6 caracteres.";


        // Inicio de sesión
        case "auth/user-not-found":
            return "No existe una cuenta con este correo."

        case "auth/wrong-password":
            return "La contraseña es incorrecta."

        case "auth/invalid-credential":
            return "El correo o la contraseña son incorrectos."


        // Autenticador de Google
        case "auth/popup-closed-by-user":
            return "Cerraste la ventana de inicio de sesión.";

        case "auth/popup-blocked":
            return "El navegador bloqueó la ventana emergente.";

        case "auth/account-exists-with-different-credential":
            return "Ya existe una cuenta con otro método de acceso."


        // Otros errores
        case "auth/too-many-requests":
            return "Demasiados intentos. Inténtalo más tarde.";

        case "auth/network-request-failed":
            return "Error de conexión- Comprueba tu internet.";

        default:
            return "Ocurrió un error inesperado. Inténtalo nuevamente."

    }

};

