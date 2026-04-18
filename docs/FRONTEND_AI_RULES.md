# Front-End AI Rules (Nexora)

Estas reglas son obligatorias cuando se usa IA para programar en Front-End del proyecto.

## 1) Estructura y tamaño
- Mantener archivos TypeScript en <= 150 lineas cuando sea practico.
- Si un componente crece, dividir en helpers, actions, state o subcomponentes.
- Priorizar componentes/paginas en carpetas dedicadas (no archivos sueltos grandes).

## 2) Estado y llamadas API
- No duplicar llamadas de sesion/perfil en varias vistas.
- Reutilizar estado global de autenticacion (`AuthSession`) para hidratar y consumir perfil.
- Para enriquecer datos de usuario, usar `AuthSession.mergeUser(...)`.

## 3) Contratos de datos
- Mantener DTO explicitos para respuestas backend.
- Mapear DTO -> modelo de UI en normalizers (no mezclar parsing en componentes).
- Evitar acoplar componentes a envelopes crudos del API.

## 4) Layout y responsive
- Usar `app-shell-layout` para vistas tipo feed/profile.
- Regla base de layout: sidebars fijos, centro con scroll en desktop.
- En mobile/tablet, permitir flujo natural (sin forzar alturas rigidas).
- Evitar ajustes ad-hoc por pagina; centralizar en estilos globales del shell.

## 5) Scroll UX
- Se puede ocultar visualmente la barra de scroll, pero el scroll debe seguir funcionando.
- Usar utilidades globales (`nexora-scrollbar-hidden`) en lugar de hacks locales repetidos.

## 6) Rutas y navegacion
- Perfil publico debe usar `/u/:handle` cuando exista `username`.
- Enlaces de perfil deben tener fallback valido (`/profile` o `/login`), nunca enlaces muertos.
- Para acciones criticas de menu, preferir navegacion programatica robusta.

## 7) UI consistency
- Respetar tokens de marca (`--brand-*`) y bordes/superficies existentes.
- Mantener consistencia de espaciado y tipografia en componentes hermanos.
- Si se agrega menu de acciones (ej. boton `...`), incluir estados activos por ruta cuando aplique.

## 8) Calidad minima antes de cerrar tarea
- Ejecutar build del front: `npm run build`.
- Corregir errores de compilacion antes de merge.
- Si hay warnings no bloqueantes, documentarlos en la PR.

## 9) Regla de cambios
- Preferir cambios pequenos y enfocados.
- No reformatear ni tocar partes no relacionadas.
- Cuando se detecte repeticion de patrones, extraer componente/utilidad compartida.

## 10) Checklist rapido para PR
- [ ] TS <= 150 lineas o dividido correctamente.
- [ ] Sin llamadas API redundantes de sesion/perfil.
- [ ] DTO + normalizer actualizados si cambio backend.
- [ ] Responsive validado en mobile y desktop.
- [ ] Layout shell aplicado (sin hacks por vista).
- [ ] `npm run build` ejecutado y en verde.
