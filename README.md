# MateCode — Gestor Estratégico de Tareas 📗✍🏻

Proyecto Integrador M4 · Henry Bootcamp

Aplicación web SPA desarrollada con React y TypeScript para gestionar tareas de manera organizada, segura y persistente. Permite registrar usuarios, iniciar sesión, administrar tareas personales y recibir resúmenes por correo electrónico mediante AWS SES.

Demo en producción: https://proyecto-m4-mateo-zapata.vercel.app

Repositorio GitHub: https://github.com/Mattzap97/Proyecto-M4-Mateo-Zapata

## Funcionalidades 💯

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

## Tecnologías utilizadas 📶

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


## Arquitectura y estructura del proyecto 📐

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


## Firebase Authentication y Cloud Firestore 🚨

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

## Integración con AWS SES y Vercel 🔂

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


## Flujo de envío de emails 📩

El proceso se encuentra desacoplado de React para proteger las credenciales del servidor.

```
Usuario autenticado
       │
       ▼
TasksPage.tsx
       │
       ▼
emailService.ts
       │
       │ POST /api/send-summary
       │ Authorization: Bearer <ID_TOKEN>
       ▼
Vercel Function
api/send-summary.ts
       │
       ├── Verifica el Firebase ID Token
       ├── Obtiene el UID y correo del usuario
       ├── Consulta Firestore filtrando por userId
       └── Prepara el resumen de tareas
       │
       ▼
AWS SES (us-east-2)
       │
       │ Credenciales temporales mediante OIDC + IAM
       ▼
Correo electrónico del usuario
       │
       ▼
Confirmación o error en la interfaz
```

El frontend no se comunica directamente con AWS. La función serverless verifica la identidad del usuario, recupera sus tareas y utiliza SES para efectuar el envío.

**Nota:** Amazon SES puede operar en Sandbox. En ese estado, los destinatarios también deben estar verificados. Para enviar a otros correos sin esa verificación individual se requiere aprobación de acceso de producción por parte de AWS. La recepción del correo de prueba en producción fue comprobada durante el desarrollo.


## Variables de entorno 💬

El proyecto utiliza .env para desarrollo local y .env.example como plantilla sin valores reales.

### Firebase — Frontend
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
### AWS — Backend
```
AWS_REGION=us-east-2
AWS_ROLE_ARN=
SES_FROM_EMAIL=
```
Las variables VITE_FIREBASE_* corresponden a la configuración web pública de Firebase. Las variables de AWS se utilizan exclusivamente en el servidor.

No se utilizan AWS_ACCESS_KEY_ID ni AWS_SECRET_ACCESS_KEY permanentes para la integración OIDC.

### Seguridad:

- .env debe estar incluido en .gitignore.
- .env.example se versiona sin valores reales.
- No se deben publicar tokens, secretos ni credenciales AWS.
- Las variables deben configurarse también en Vercel.
- Después de modificar variables en Vercel debe realizarse un nuevo deployment.


## Instalación y ejecución local 💻

### Requisitos

- Node.js compatible con Vite.
- npm.
- Acceso al proyecto de Firebase.
- Configuración AWS y Vercel para probar el endpoint de correo.

### Instalación
```bash
git clone https://github.com/Mattzap97/Proyecto-M4-Mateo-Zapata "Proyecto M4 - Mateo Zapata"

cd "Proyecto M4 - Mateo Zapata"

npm install
```
Crear el archivo local:
```bash
Copy-Item .env.example .env
```
Completar las variables correspondientes y ejecutar el frontend:
```bash
npm run dev
```
Vite ejecuta el frontend, pero no las funciones serverless de Vercel.

Para ejecutar localmente el frontend y las funciones API se utiliza:
```bash
npx vercel dev
```
La prueba del envío AWS también requiere que la política de confianza OIDC autorice el entorno de ejecución utilizado.



## Testing con Vitest y React Testing Library 🧪

Se implementaron pruebas automatizadas para comprobar el comportamiento de los componentes principales y el Hook de tareas.

### Herramientas:

- Vitest 5.
- React Testing Library.
- Testing Library DOM.
- jest-dom.
- user-event.
- jsdom.

La configuración se centraliza en vite.config.ts y tests/setup.ts.

### Suite de pruebas

<div align="center">

| Archivo | Pruebas | Cobertura funcional |
| :--- | :---: | :--- |
| `TodoForm.test.tsx` | 3 | Creación, validación y cancelación de edición |
| `TodoList.test.tsx` | 3 | Visualización, estado vacío y acciones CRUD |
| `useTasks.test.tsx` | 3 | Suscripción, creación y manejo de errores |
| **Total** | **9** | **9 aprobadas** |

</div>

Los servicios externos se simulan mediante mocks para evitar operaciones reales en Firebase durante las pruebas.

### Comandos
```bash
# Ejecución interactiva
npm run test

# Ejecutar todas las pruebas una sola vez
npm run test:run

# Compilación de producción
npm run build
```
Resultado verificado: 3 archivos de pruebas aprobados y 9 tests exitosos.


## Reglas de seguridad de Cloud Firestore 🛡

El archivo [`firestore.rules`](./firestore.rules)  garantiza el principio de mínimo privilegio:

```javascript
// REGLAS PARA FIREBASE CONSOLE
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Todo cerrado por defecto
    match /{document=**} {
      allow read, write: if false;
    }

    match /tasks/{taskId} {

      function isSignedIn() {
        return request.auth != null;
      }

      function isOwnerExisting() {
        return isSignedIn()
          && request.auth.uid == resource.data.userId;
      }

      function isOwnerIncoming() {
        return isSignedIn()
          && request.auth.uid == request.resource.data.userId;
      }

      // Validar estructura y tipos de datos
      function hasValidShape() {
        return request.resource.data.keys().hasAll([
          'title',
          'description',
          'completed',
          'userId',
          'createdAt',
          'updatedAt'
        ])
        && request.resource.data.title is string
        && request.resource.data.description is string
        && request.resource.data.completed is bool
        && request.resource.data.userId is string
        && request.resource.data.createdAt is timestamp
        && request.resource.data.updatedAt is timestamp;
      }

      // Consultar únicamente tareas propias
      allow get, list: if isOwnerExisting();

      // Crear tareas propias con fechas del servidor
      allow create: if isOwnerIncoming()
        && hasValidShape()
        && request.resource.data.createdAt == request.time
        && request.resource.data.updatedAt == request.time;

      // Actualizar tareas propias sin cambiar propietario
      // ni fecha de creación
      allow update: if isOwnerExisting()
        && request.resource.data.userId == resource.data.userId
        && request.resource.data.createdAt == resource.data.createdAt
        && request.resource.data.updatedAt == request.time
        && hasValidShape();

      // Eliminar únicamente tareas propias
      allow delete: if isOwnerExisting();
    }
  }
}
```

## Uso de inteligencia artificial 🤖

Se utilizaron ChatGPT y Gemini mediante Antigravity IDE como herramientas de apoyo durante el desarrollo.

### La IA fue especialmente útil en:

- Comprender React, TypeScript, Hooks y Context API.
- Diseñar la separación de responsabilidades.
- Diagnosticar errores de Firebase, Firestore y Vercel.
- Configurar AWS SES, IAM y OIDC.
- Diseñar pruebas con Vitest y React Testing Library.
- Mejorar el diseño responsive sin romper las reglas CSS para Mobile-first previamente desarrolladas.

