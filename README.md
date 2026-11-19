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


## Arquitectura y estructura del proyecto

El proyecto utiliza una arquitectura por capas que separa componentes visuales, lógica de negocio, servicios externos y tipos compartidos.
```
Proyecto M4 - Mateo Zapata/
│
├── api/
│   └── send-summary.ts
│
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   └── tasks/
│   │       ├── TodoForm.tsx
│   │       ├── TodoItem.tsx
│   │       └── TodoList.tsx
│   │
│   ├── features/
│   │   └── auth/
│   │       └── AuthProvider.tsx
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useTasks.ts
│   │
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── TasksPage.tsx
│   │
│   ├── routes/
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/
│   │   ├── firebase/
│   │   │   ├── authService.ts
│   │   │   ├── firebaseConfig.ts
│   │   │   └── taskService.ts
│   │   └── emailService.ts
│   │
│   ├── types/
│   │   └── task.ts
│   │
│   ├── utils/
│   │   └── authErrors.ts
│   │
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
│
├── tests/
│   ├── components/
│   │   ├── TodoForm.test.tsx
│   │   └── TodoList.test.tsx
│   ├── hooks/
│   │   └── useTasks.test.tsx
│   └── setup.ts
│ 
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── vercel.json
└── vite.config.ts
```

### Decisiones arquitectónicas

- **AuthProvider y useAuth:** centralizan el estado de autenticación.
- **useTasks:** concentra las operaciones CRUD y la suscripción a tareas.
- **taskService.ts:** separa las consultas y operaciones de Firestore de los componentes.
- **ProtectedRoute:** controla el acceso a las rutas privadas.
- **emailService.ts:** comunica el frontend con la función serverless.
- **api/send-summary.ts:** verifica la sesión, consulta las tareas del usuario y solicita el envío mediante SES.
- **api/:** se utiliza en lugar de una carpeta functions/ porque Vercel reconoce automáticamente esta estructura para sus funciones serverless.


## Firebase Authentication y Cloud Firestore

### Autenticación
Se habilitaron los proveedores Email/Password y Google en Firebase Authentication.
La configuración de Firebase se centraliza en firebaseConfig.ts, utilizando variables de entorno.

### Modelo de datos
La colección utilizada es tasks, dentro de la base de datos (default) del proyecto Firebase.
Cada documento contiene los siguientes campos:

<div align="center">

| Campo | Tipo |
| :--- | :--- |
| `id` | `string` (ID del documento) |
| `userId` | `string` |
| `title` | `string` |
| `description` | `string` |
| `completed` | `boolean` |
| `createdAt` | `Timestamp` |
| `updatedAt` | `Timestamp` |

</div>

### Persistencia y sincronización
Las consultas filtran las tareas mediante:

```where("userId", "==", userId)```

Las operaciones CRUD se concentran en taskService.ts y se consumen mediante useTasks.ts.
Se utiliza onSnapshot para mantener la interfaz sincronizada con los cambios de Firestore y cancelar correctamente las suscripciones cuando dejan de ser necesarias.

### Seguridad de Firestore

Las reglas se configuran bajo el principio de denegación por defecto:

- Solo usuarios autenticados pueden acceder.
- El UID debe coincidir con el userId del documento.
- No se permite modificar el propietario de una tarea.
- Se validan los campos obligatorios y sus tipos básicos.
- Las operaciones de usuarios diferentes quedan aisladas.

Se realizaron simulaciones en Firebase Rules Playground con usuarios autenticados y no autenticados para comprobar las condiciones de acceso.

Las reglas aplicadas se deben mantener versionadas en el repositorio como firestore.rules para facilitar su revisión y despliegue.

## Integración con AWS SES y Vercel

Amazon SES se utiliza para enviar los resúmenes de tareas al correo electrónico del usuario autenticado.

### Configuración de infraestructura:

- Servicio: Amazon Simple Email Service.
- Región: us-east-2 (Ohio).
- Identidad remitente: dirección de correo verificada en SES.
- SDK: @aws-sdk/client-sesv2.
- Endpoint: POST /api/send-summary.
- Ejecución: Vercel Functions.

### Autenticación AWS mediante OIDC

Se configuró un proveedor OpenID Connect de Vercel y un rol IAM específico:

- Proveedor: oidc.vercel.com/proyectos-mateo-zapata.
- Proyecto Vercel: proyecto-m4-mateo-zapata.
- Rol IAM: MateCode-Vercel-SES-Role.
- Política: MateCode-SESSendEmail.

La política limita el permiso de envío a ses:SendEmail y a la identidad remitente autorizada.

La política de confianza del rol restringe la identidad OIDC al proyecto y al entorno production.

Esta arquitectura permite utilizar credenciales temporales de AWS y evita almacenar claves permanentes en el frontend.

