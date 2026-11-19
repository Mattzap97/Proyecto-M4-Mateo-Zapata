# MateCode — Gestor Estratégico de Tareas 📗✍🏻

Proyecto Integrador M4 · Henry Bootcamp

Aplicación web SPA desarrollada con React y TypeScript para gestionar tareas de manera organizada, segura y persistente. Permite registrar usuarios, iniciar sesión, administrar tareas personales y recibir resúmenes por correo electrónico mediante AWS SES.

Demo en producción: https://proyecto-m4-mateo-zapata.vercel.app

Repositorio GitHub: https://github.com/Mattzap97/Proyecto-M4-Mateo-Zapata

## Funcionalidades

### Autenticación

1. Registro e inicio de sesión con email y contraseña.
2. Inicio de sesión mediante Google.
3. Cierre de sesión.
4. Persistencia de sesión con Firebase Authentication.
5. Protección de rutas privadas mediante React Router.
6. Validaciones de formularios y mensajes de error en español.

### Gestión de tareas

1. Crear tareas con título y descripción.
2. Consultar, editar y eliminar tareas.
3. Marcar tareas como completadas o pendientes.
4. Consultar estadísticas de tareas totales, pendientes y completadas.
5. Actualización automática de la interfaz mediante suscripciones a Firestore.
6. Aislamiento de información: cada usuario accede únicamente a sus propias tareas.

### Notificaciones por email

1. Botón para solicitar el resumen de las tareas.
2. Envío mediante Amazon SES.
3. Ejecución a través de Vercel Functions.
4. Confirmaciones y mensajes de error en la interfaz.
5. Credenciales de AWS protegidas en el entorno backend.

## Tecnologías utilizadas

<div align="center">
  
| Tecnología | Función |
| :--- | :--- |
| **React 19 + TypeScript** | Interfaz y tipado estático |
| **Vite 8** | Desarrollo y compilación |
| **React Router** | Navegación SPA y rutas protegidas |
| **Firebase Authentication** | Autenticación de usuarios |
| **Cloud Firestore** | Base de datos NoSQL y sincronización |
| **AWS SES** | Envío de correos electrónicos |
| **AWS SDK v3 (client-sesv2)** | Comunicación con SES |
| **Vercel Functions** | Backend serverless |
| **Vercel OIDC + IAM** | Credenciales temporales para AWS |
| **jose** | Verificación de tokens JWT |
| **Vitest 5** | Pruebas automatizadas |
| **React Testing Library** | Pruebas de componentes |
| **jsdom** | Simulación del entorno DOM |
| **CSS nativo** | Diseño responsive Mobile First |
| **Git y GitHub** | Control de versiones |
  
</div>

