
import {
    SESv2Client,
    SendEmailCommand,
} from "@aws-sdk/client-sesv2";

import {
    awsCredentialsProvider,
} from "@vercel/oidc-aws-credentials-provider";

import {
    createRemoteJWKSet,
    jwtVerify,
} from "jose";

interface TaskForSummary {
    userId: string;
    title: string;
    description: string;
    completed: boolean;
}

const firebaseJwks = createRemoteJWKSet(
    new URL(
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
    )
);

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export default {
    async fetch(request: Request): Promise<Response> {

        // Aceptar únicamente solicitudes POST
        if (request.method !== "POST") {
            return Response.json(
                { error: "Método no permitido." },
                { status: 405 }
            );
        }

        // Obtener configuración del servidor
        const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
        const region = process.env.AWS_REGION;
        const roleArn = process.env.AWS_ROLE_ARN;
        const sender = process.env.SES_FROM_EMAIL;

        if (!projectId || !region || !roleArn || !sender) {
            return Response.json(
                { error: "Falta configuración del servidor." },
                { status: 500 }
            );
        }

        // Validar autenticación Firebase
        const authorization = request.headers.get("Authorization");

        if (!authorization?.startsWith("Bearer ")) {
            return Response.json(
                { error: "Debes iniciar sesión." },
                { status: 401 }
            );
        }

        const idToken = authorization.slice(7).trim();

        let uid: string;
        let email: string;

        try {
            const { payload } = await jwtVerify(idToken, firebaseJwks, {
                issuer: `https://securetoken.google.com/${projectId}`,
                audience: projectId,
                algorithms: ["RS256"],
            });

            if (
                typeof payload.sub !== "string" ||
                typeof payload.email !== "string"
            ) {
                throw new Error("Identidad de usuario inválida.");
            }

            uid = payload.sub;
            email = payload.email;

        } catch {
            return Response.json(
                { error: "La sesión no es válida o ha expirado." },
                { status: 401 }
            );
        }

        // Obtener las tareas enviadas por el frontend
        let body: unknown;

        try {
            body = await request.json();

        } catch {
            return Response.json(
                { error: "El contenido de la solicitud no es válido." },
                { status: 400 }
            );
        }

        if (!isRecord(body) || !Array.isArray(body.tasks)) {
            return Response.json(
                { error: "No se recibió una lista válida de tareas." },
                { status: 400 }
            );
        }

        if (body.tasks.length > 200) {
            return Response.json(
                { error: "El resumen supera el límite de tareas." },
                { status: 400 }
            );
        }

        const tasks: TaskForSummary[] = [];

        for (const item of body.tasks) {
            if (!isRecord(item)) {
                return Response.json(
                    { error: "Existe una tarea con formato inválido." },
                    { status: 400 }
                );
            }

            if (item.userId !== uid) {
                return Response.json(
                    { error: "La tarea no pertenece al usuario autenticado." },
                    { status: 403 }
                );
            }

            if (
                typeof item.title !== "string" ||
                item.title.length > 200 ||
                typeof item.description !== "string" ||
                item.description.length > 2000 ||
                typeof item.completed !== "boolean"
            ) {
                return Response.json(
                    { error: "Los datos de una tarea son inválidos." },
                    { status: 400 }
                );
            }

            tasks.push({
                userId: uid,
                title: item.title,
                description: item.description,
                completed: item.completed,
            });
        }

        // Preparar el resumen
        const completedTasks = tasks.filter(task => task.completed);
        const pendingTasks = tasks.filter(task => !task.completed);

        const taskDetails = tasks.length > 0
            ? tasks.map((task, index) =>
                `${index + 1}. ${task.title}\n` +
                `Descripción: ${task.description}  \n` +
                `Estado: ${task.completed ? "Completada" : "Pendiente"}`
            ).join("\n\n")
            : "Todavía no tienes tareas registradas.";

        const emailBody = `
Hola,

Este es el resumen de tus tareas en MateCode.

Total de tareas: ${tasks.length}
Completadas: ${completedTasks.length}
Pendientes: ${pendingTasks.length}

DETALLE DE TAREAS

${taskDetails}

Saludos,
Equipo MateCode
`;

        // Preparar cliente AWS con credenciales temporales OIDC
        const sesClient = new SESv2Client({
            region,
            credentials: awsCredentialsProvider({
                roleArn,
            }),
        });

        // Enviar correo mediante AWS SES
        try {
            const result = await sesClient.send(
                new SendEmailCommand({
                    FromEmailAddress: sender,

                    Destination: {
                        ToAddresses: [email],
                    },

                    Content: {
                        Simple: {
                            Subject: {
                                Data: "Resumen de tus tareas - MateCode",
                                Charset: "UTF-8",
                            },
                            Body: {
                                Text: {
                                    Data: emailBody,
                                    Charset: "UTF-8",
                                },
                            },
                        },
                    },
                })
            );

            return Response.json({
                message: "Resumen enviado correctamente.",
                messageId: result.MessageId,
            });

        } catch (error) {
            console.error(
                "Error enviando correo:",
                error instanceof Error ? error.message : "Error desconocido  "
            );

            return Response.json(
                { error: "No se pudo enviar el resumen mediante AWS SES." },
                { status: 502 }
            );
        }
    },
};
