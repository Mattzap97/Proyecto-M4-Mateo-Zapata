
import type { User } from "firebase/auth";


// Comprobar que la respuesta sea un objeto
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}


// Solicitar el envío del resumen de tareas
export async function sendTaskSummaryEmail(
    user: User
): Promise<void> {

    // Obtener token de autenticación de Firebase
    const idToken = await user.getIdToken();

    // Enviar solicitud a Vercel
    const response = await fetch("/api/send-summary", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
        },
    });

    
    // Procesar respuesta
    const result: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            isRecord(result) && typeof result.error === "string"
                ? result.error
                : "No se pudo enviar el resumen de tareas.";

        throw new Error(message);
    }
}
