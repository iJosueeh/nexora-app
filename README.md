
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

## 🔌 Configuración de entorno (Front-End + Supabase)

Las URLs del backend y los valores públicos de Supabase se controlan desde Angular environment files.

1. Crea tu archivo local `.env` a partir de `.env.example`:
	```bash
	cp .env.example .env
	```
2. Completa los valores en `.env` para desarrollo local. En producción, define esas mismas variables en tu plataforma de despliegue o en tu CI:
	```env
	API_BASE_URL=http://localhost:8080/api
	GRAPHQL_URL=http://localhost:8080/graphql
	SUPABASE_URL=https://your-project-ref.supabase.co
	SUPABASE_ANON_KEY=your-public-anon-key
	```
3. El desarrollo local usa [src/environments/environment.ts](src/environments/environment.ts).
4. El build de producción usa [src/environments/environment.prod.ts](src/environments/environment.prod.ts) mediante file replacement en [angular.json](angular.json).
5. Antes de `npm run build`, se genera automáticamente `src/environments/environment.prod.ts` desde `.env` local o desde `process.env` en CI/CD.
6. Para peticiones REST, usa el cliente base reutilizable:
	- [src/app/shared/services/api-client.service.ts](src/app/shared/services/api-client.service.ts)
7. Para GraphQL, Apollo toma automáticamente `graphqlUrl` desde [src/app/app.config.ts](src/app/app.config.ts).

### Seguridad de claves Supabase

- `SUPABASE_ANON_KEY` es pública por diseño y puede vivir en frontend.
- Nunca publiques ni uses en frontend la `service_role` key de Supabase.
- `.env` está ignorado en [nexora-app/.gitignore](.gitignore), y solo se versiona `.env.example`.
- En producción no subas `.env`; inyecta las variables en Vercel, Render, GitHub Actions u otro pipeline.

### Flujo recomendado para conectar con Spring Boot

1. Define endpoints REST en Spring Boot (ejemplo: `/api/auth/login`, `/api/auth/register`).
2. Crea servicios por feature en Angular usando `ApiClientService`.
	Ejemplo implementado: [src/app/features/auth/services/auth-api.service.ts](src/app/features/auth/services/auth-api.service.ts)
3. Mantén DTOs/interfaces en `src/app/interfaces`.
4. Ajusta solo los environment files cuando cambie el backend o Supabase.

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
