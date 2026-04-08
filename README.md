
<div align="center">
	<h1>Nexora - Red Social Universitaria</h1>
	<p>
		<b>Red Social Universitaria para la UTP</b><br>
		Plataforma web inspirada en Twitter, creada para estudiantes de la <br>
		<b>Universidad Tecnológica del Perú</b>.<br>
	</p>
	<img src="https://img.shields.io/badge/Front--End-Angular-DD0031?logo=angular&logoColor=white"/>
	<img src="https://img.shields.io/badge/Back--End-Spring%20Boot-6DB33F?logo=springboot&logoColor=white"/>
	<img src="https://img.shields.io/badge/Status-En%20Desarrollo-yellow"/>
</div>

---

## 🚀 Descripción

NexoraApp es una plataforma web tipo red social dirigida a estudiantes de la UTP. Permite:

- Publicar mensajes
- Comentar publicaciones
- Dar like
- Compartir publicaciones

Inspirada en la experiencia de Twitter, busca fomentar la interacción y colaboración entre la comunidad universitaria.

---

## 🛠️ Tecnologías


<ul>
	<li><b>Front-End:</b> <a href="https://angular.dev/">Angular</a> <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="18"/></li>
	<li><b>Back-End:</b> <a href="https://spring.io/projects/spring-boot">Spring Boot</a> <img src="https://spring.io/images/projects/spring-boot.svg" width="18"/></li>
	<li><b>API:</b> <a href="https://graphql.org/">GraphQL</a> <img src="https://graphql.org/img/logo.svg" width="18"/></li>
	<li><b>Base de datos:</b> <a href="https://www.postgresql.org/">PostgreSQL</a> <img src="https://www.postgresql.org/media/img/about/press/elephant.png" width="18"/></li>
</ul>

---

## 📦 Instalación y uso

### Front-End (Angular)

1. Clona el repositorio y entra a la carpeta del proyecto:
	 ```bash
	 git clone [URL_DEL_REPO]
	 cd nexora-app
	 ```
2. Instala las dependencias:
	 ```bash
	 npm install
	 ```
3. Inicia el servidor de desarrollo:
	 ```bash
	 ng serve
	 ```
4. Abre tu navegador en [http://localhost:4200](http://localhost:4200)

### Back-End (Spring Boot)

Próximamente: El backend será desarrollado con Spring Boot y se integrará con el frontend para gestionar usuarios, publicaciones y más.

---

## 🧪 Testing

Para ejecutar los tests unitarios del frontend:

```bash
ng test
```

---

## 🔌 Configuración dinámica del Back-End

La URL del backend ya no está hardcodeada en el frontend.

1. Edita [public/config/app-config.json](public/config/app-config.json) con las URLs de tu entorno:
	```json
	{
	  "apiBaseUrl": "http://localhost:8080/api",
	  "graphqlUrl": "http://localhost:8080/graphql",
	  "microsoftAuthStartUrl": "http://localhost:8080/api/auth/microsoft/authorize",
	  "microsoftAuthCallbackPath": "/auth/microsoft/callback",
	  "microsoftAllowedDomain": "utp.edu.pe"
	}
	```
2. Angular carga esta configuración al iniciar la app desde:
	- [src/app/core/config/runtime-config.service.ts](src/app/core/config/runtime-config.service.ts)
	- [src/app/app.config.ts](src/app/app.config.ts)
3. Para peticiones REST, usa el cliente base reutilizable:
	- [src/app/shared/services/api-client.service.ts](src/app/shared/services/api-client.service.ts)
4. Para GraphQL, Apollo toma automáticamente `graphqlUrl` en:
	- [src/app/app.config.ts](src/app/app.config.ts)

### Login Microsoft (UTP)

Frontend listo en:

- Botón de inicio: [src/app/features/auth/login/login.ts](src/app/features/auth/login/login.ts)
- Callback OAuth: [src/app/features/auth/microsoft-callback/microsoft-callback.ts](src/app/features/auth/microsoft-callback/microsoft-callback.ts)
- Servicio auth: [src/app/features/auth/services/auth-api.service.ts](src/app/features/auth/services/auth-api.service.ts)

Contrato esperado del backend en callback (`POST /auth/microsoft/callback`):

```json
{
  "email": "usuario@utp.edu.pe"
}
```

El frontend valida adicionalmente que el dominio sea `utp.edu.pe` antes de permitir el acceso.

### Flujo recomendado para conectar con Spring Boot

1. Define endpoints REST en Spring Boot (ejemplo: `/api/auth/login`, `/api/auth/register`).
 2. Crea servicios por feature en Angular usando `ApiClientService`.
	Ejemplo implementado: [src/app/features/auth/services/auth-api.service.ts](src/app/features/auth/services/auth-api.service.ts)
3. Mantén DTOs/interfaces en `src/app/interfaces`.
4. Cambia solo `public/config/app-config.json` por ambiente (dev, qa, prod) sin recompilar código.

---


---

## 👥 Equipo de Desarrollo

- <b><a href="https://github.com/Crismar12">@Crismar12</a></b>
- <b><a href="https://github.com/kath144">@kath144</a></b> (Katherine Salas)
- <b><a href="https://github.com/KennySth">@KennySth</a></b>

---


## 💡 Funcionalidades Presentes

- Perfil de usuario: cada usuario puede ver su perfil, publicaciones y multimedia.
- Publicaciones con multimedia: imágenes, videos o archivos junto a los posts.
- Likes y comentarios en publicaciones.
- Visualización de publicaciones propias y de otros usuarios.
- Integración con <b>GraphQL</b> para la gestión eficiente de datos.

---

## 📄 Licencia

Proyecto académico para la UTP. Uso educativo.
