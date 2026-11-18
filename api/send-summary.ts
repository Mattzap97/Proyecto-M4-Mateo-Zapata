import type { VercelRequest, VercelResponse } from "@vercel/node";

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

// Tipado de los campos que necesitamos de Firestore
interface TaskSummary {
    title: string;
    description: string;
    completed: boolean;
}

// Obtener las claves públicas de Firebase
const firebaseJwks = createRemoteJWKSet(
    new URL(
        "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"
    )
);

// Comprobar objetos recibidos
function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

// Extraer campos de texto de Firestore REST
function getStringField(
    fields: Record<string, unknown>,
    fieldName: string
): string | null {
    const value = fields[fieldName];

    return isRecord(value) && typeof value.stringValue === "string"
        ? value.stringValue
        : null;
}

// Extraer campos booleanos de Firestore REST
function getBooleanField(
    fields: Record<string, unknown>,
    fieldName: string
): boolean | null {
    const value = fields[fieldName];

    return isRecord(value) && typeof value.booleanValue === "boolean"
        ? value.booleanValue
        : null;
}

export default async function handler(
    req: VercelRequest,
    res: VercelResponse
): Promise<void> {

    // Aceptar solamente solicitudes POST
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        res.status(405).json({
            error: "Método no permitido.",
        });
        return;
    }

    // Obtener variables de entorno
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    const region = process.env.AWS_REGION;
    const roleArn = process.env.AWS_ROLE_ARN;
    const sender = process.env.SES_FROM_EMAIL;

    if (!projectId || !region || !roleArn || !sender) {
        res.status(500).json({
            error: "Falta configuración del servidor.",
        });
        return;
    }

    // Recuperar token Firebase
    const authorization = req.headers.authorization;

    if (
        typeof authorization !== "string" ||
        !authorization.startsWith("Bearer ")
    ) {
        res.status(401).json({
            error: "Debes iniciar sesión.",
        });
        return;
    }

    const idToken = authorization.slice(7).trim();

    let uid: string;
    let email: string;

    // Verificar identidad del usuario
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
            throw new Error("Identidad no válida.");
        }

        uid = payload.sub;
        email = payload.email;

    } catch {
        res.status(401).json({
            error: "La sesión no es válida o ha expirado.",
        });
        return;
    }

    // Consultar únicamente las tareas del usuario autenticado
    try {
        const firestoreResponse = await fetch(
            `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents:runQuery`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${idToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    structuredQuery: {
                        from: [
                            {
                                collectionId: "tasks",
                            },
                        ],
                        where: {
                            fieldFilter: {
                                field: {
                                    fieldPath: "userId",
                                },
                                op: "EQUAL",
                                value: {
                                    stringValue: uid,
                                },
                            },
                        },
                    },
                }),
            }
        );

        if (!firestoreResponse.ok) {
            throw new Error("No se pudieron consultar las tareas.");
        }

        const queryResults: unknown = await firestoreResponse.json();

        if (!Array.isArray(queryResults)) {
            throw new Error("Respuesta de Firestore no válida.");
        }

        const tasks: TaskSummary[] = [];

        for (const result of queryResults) {
            if (!isRecord(result) || !isRecord(result.document)) {
                continue;
            }

            const document = result.document;

            if (!isRecord(document.fields)) {
                continue;
            }

            const fields = document.fields;

            const title = getStringField(fields, "title");
            const description = getStringField(fields, "description");
            const completed = getBooleanField(fields, "completed");

            if (
                title === null ||
                description === null ||
                completed === null
            ) {
                throw new Error("Existe una tarea con datos incompletos.");
            }

            tasks.push({
                title,
                description,
                completed,
            });
        }

        // Preparar el resumen
        const completedTasks = tasks.filter(task => task.completed);
        const pendingTasks = tasks.filter(task => !task.completed);

        const taskDetails = tasks.length > 0
            ? tasks.map((task, index) =>
                `${index + 1}. ${task.title}\n` +
                `Descripción: ${task.description}\n` +
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

        // Crear cliente AWS con credenciales temporales OIDC
        const sesClient = new SESv2Client({
            region,
            credentials: awsCredentialsProvider({
                roleArn,
            }),
        });

        // Enviar email
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

        res.status(200).json({
            message: "Resumen enviado correctamente.",
            messageId: result.MessageId,
        });

    } catch (error) {
        console.error(
            "Error en el envío del resumen:",
            error instanceof Error ? error.message : "Error desconocido"
        );

        res.status(502).json({
            error: "No se pudo enviar el resumen mediante AWS SES.",
        });
    }
}