
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

NexoraApp es una plataforma web tipo red social dirigida a estudiantes de la UTP. Permite fomentar la interacción y colaboración entre la comunidad universitaria mediante un diseño editorial y moderno.

---

## 🛠️ Tecnologías

<ul>
	<li><b>Front-End:</b> <a href="https://angular.dev/">Angular (v17+)</a> <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="18"/></li>
	<li><b>Estado y Reactividad:</b> Angular Signals</li>
	<li><b>Back-End:</b> <a href="https://spring.io/projects/spring-boot">Spring Boot</a> <img src="https://spring.io/images/projects/spring-boot.svg" width="18"/></li>
	<li><b>API:</b> <a href="https://graphql.org/">GraphQL (Apollo)</a> & REST</li>
	<li><b>Autenticación & Storage:</b> Supabase</li>
</ul>

---

## 🏗️ Estándares de Ingeniería (AI Ready)

Este repositorio sigue estándares estrictos para garantizar un código limpio y mantenible, optimizados para el uso de asistentes de IA (Gemini, Cursor, Copilot):

- **Modularización:** Componentes divididos en subcomponentes (`components/`) y lógica extraída a servicios/helpers.
- **Control Flow Moderno:** Uso exclusivo de `@if`, `@for` y `@switch`.
- **Tipado Estricto:** Interfaces centralizadas en directorios `interfaces/`.
- **Data Mocking:** Datos estáticos aislados en directorios `mocks/`.
- **Límites de Código:** Archivos `.ts` mantenidos bajo las 200 líneas.
- **Validación Continua:** Mandato de Build y Tests exitosos para cada entrega.

*Consulta [GEMINI.md](./GEMINI.md) para más detalles.*

---

## 💡 Funcionalidades Principales

- **Investigación (Explorar):** Descubre hallazgos y papers de la comunidad UTP filtrados por facultad.
- **Pulso Universitario:** Feed en tiempo real de actividad y tendencias académicas.
- **Eventos:** Calendario de debates, talleres y ferias científicas.
- **Perfil de Usuario:** Gestión de identidad, carrera, intereses académicos y biografía.
- **Registro Institucional:** Validación estricta de correos `@utp.edu.pe` con normalización de mayúsculas para IDs de estudiante.

---

## 📦 Instalación y uso

1. Instala las dependencias:
	 ```bash
	 npm install
	 ```
2. Configura el entorno:
	 ```bash
	 cp .env.example .env
	 ```
3. Inicia el servidor de desarrollo:
	 ```bash
	 npm start
	 ```

---

## 🧪 Testing y Calidad

Para ejecutar la suite completa de pruebas unitarias (Vitest):

```bash
npm test
```

Para validar la integridad del bundle:

```bash
npm run build
```

---

## 👥 Equipo de Desarrollo

- <b><a href="https://github.com/Crismar12">@Crismar12</a></b>
- <b><a href="https://github.com/kath144">@kath144</a></b> (Katherine Salas)
- <b><a href="https://github.com/KennySth">@KennySth</a></b>

---

## 📄 Licencia

Proyecto académico para la UTP. Uso educativo.
