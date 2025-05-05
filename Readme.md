# TodoAPP – Gestión de Usuarios y Autenticación con Vue 3

Una aplicación web moderna con Vue 3 y JWT que permite gestionar usuarios, autenticación y roles de acceso a través de una interfaz intuitiva. Este frontend se conecta con una API RESTful separada y utiliza JWT para manejar sesiones seguras.

---

## 🚀 Características

- Registro de usuarios
- Inicio de sesión con validación
- Verificación por código de autenticación
- Gestión de sesión vía JWT
- Panel de administración con layout separado
- Estado global con Pinia
- Estilos SASS

---

## 🛠️ Tecnologías

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [SASS (SCSS)](https://sass-lang.com/)
- [Axios](https://axios-http.com/)

---

## 📁 Estructura del Proyecto

src/
├── components/         # Componentes reutilizables
│ └── utils/            # Ej. mensajes o validaciones comunes
├── views/              # Vistas: login, registro, dashboard, etc.
├── assets/             # Imágenes, logos, etc.
├── stores/             # Pinia stores para login, usuario, etc.
├── router/             # Rutas protegidas y públicas
├── api/                # Configuración de Axios y endpoints
├── styles/             # Variables, mixins y estilos globales
├── global/             # Constantes, URL base, manejo de errores
│ └── index.ts
├── auth.ts             # Funciones de autenticación
├── main.ts             # Entrada principal de la app
└── App.vue

---

## ⚙️ Configuración

La URL base del backend se define manualmente en el archivo:

src/global/index.ts

Si vas a desplegar la aplicación, recuerda actualizar el valor de local con la URL de tu servidor.

---

## 🧪 Instalación y ejecución
npm install
npm run dev

---

## 📌 Notas
- La autenticación se maneja mediante JWT.

- Las rutas protegidas solo se pueden acceder con sesión activa.

- Este proyecto es la parte frontend. El backend está desarrollado y mantenido por separado.

