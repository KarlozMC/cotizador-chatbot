# Plan De Despliegue

Este documento describe como desplegar el proyecto `cotizador-chatbot` para una demo real o primera version operativa.

## Componentes

El proyecto tiene dos aplicaciones principales:

```text
backend/
frontend-panel/
```

## Backend

Responsabilidades:

- Recibir webhooks de WhatsApp.
- Procesar mensajes con el motor conversacional.
- Guardar conversaciones, mensajes y leads en Supabase.
- Enviar respuestas por WhatsApp Cloud API.

Comando local:

```bash
npm run api
```

Puerto local:

```text
3000
```

Variables de entorno necesarias:

```env
PORT=3000
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_VERSION=v26.0
```

## Frontend Panel

Responsabilidades:

- Mostrar prospectos.
- Filtrar y buscar leads.
- Ver detalle de prospecto.
- Cambiar estado.
- Guardar notas internas.
- Abrir contacto por WhatsApp.
- Proteger acceso con clave simple.

Comando local:

```bash
npm run dev
```

Variables de entorno necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PANEL_ACCESS_KEY=
```

## Opciones De Hosting

### Opcion 1: Render + Vercel

Backend:

- Render Web Service.
- Node.js.
- Start command: `npm run api`.
- Root directory: `backend`.

Frontend:

- Vercel.
- Framework: Next.js.
- Root directory: `frontend-panel`.

Ventajas:

- Facil de configurar.
- Buena opcion para demo.
- Vercel funciona muy bien con Next.js.

Consideraciones:

- En planes gratis puede haber cold starts.
- Revisar limites de ejecucion y disponibilidad.

### Opcion 2: Railway

Backend y frontend pueden vivir en Railway como servicios separados.

Ventajas:

- Manejo simple de variables.
- Facil conectar repositorio.
- Buena experiencia para proyectos Node.

Consideraciones:

- Revisar costos y limites actuales.

### Opcion 3: VPS

Backend y frontend desplegados en un servidor propio.

Ventajas:

- Mayor control.
- Puede alojar varios clientes en el futuro.

Consideraciones:

- Requiere configurar servidor, dominio, SSL, procesos y monitoreo.

## Recomendacion Actual

Para demo y primera version:

```text
Backend: Render
Frontend: Vercel
Base de datos: Supabase
```

## Pasos De Despliegue Recomendados

1. Confirmar que backend compila y corre localmente.
2. Confirmar que frontend compila y corre localmente.
3. Subir cambios a GitHub.
4. Desplegar backend.
5. Configurar variables de entorno del backend.
6. Obtener URL publica del backend.
7. Actualizar webhook de Meta con URL publica del backend.
8. Desplegar frontend.
9. Configurar variables de entorno del frontend.
10. Probar flujo completo.
11. Reemplazar ngrok por URL publica del backend.
12. Documentar URL final de demo.

## Checklist Backend

- [ ] `npm install` funciona.
- [ ] `npm run build` funciona si aplica.
- [ ] `npm run api` inicia correctamente.
- [ ] `/health` responde.
- [ ] `/webhooks/whatsapp` verifica correctamente.
- [ ] WhatsApp sender usa token actual.
- [ ] Supabase guarda leads, conversaciones y mensajes.

## Checklist Frontend

- [ ] `npm install` funciona.
- [ ] `npm run build` funciona.
- [ ] Login funciona.
- [ ] Listado de prospectos funciona.
- [ ] Detalle de prospecto funciona.
- [ ] Cambio de estado funciona.
- [ ] Notas internas funcionan.
- [ ] Logout funciona.

## Seguridad Pendiente

- Reemplazar clave simple por autenticacion real.
- Definir usuarios administradores.
- Revisar politicas RLS completas.
- Rotar tokens temporales de WhatsApp.
- Usar token permanente para produccion.
- Evitar exponer informacion sensible en logs.

## Notas Operativas

- La URL de ngrok cambia al reiniciar el tunel en plan gratuito.
- Para demo estable, conviene reemplazar ngrok por una URL publica de backend desplegado.
- No migrar todavia el numero principal de VA Decoraciones a Cloud API.
- Para produccion se recomienda usar un numero nuevo dedicado al chatbot.

## Estado Actual Del Proyecto

- Backend local funcional.
- Webhook de WhatsApp probado con ngrok.
- Envio de respuesta por WhatsApp probado con payload simulado.
- Supabase funcionando como base de datos.
- Panel local funcional con login simple.
- Prospectos visibles en tabla y detalle.
- Estados y notas internas editables desde panel.

## Proximo Hito

Desplegar primero el backend para obtener una URL publica estable y reemplazar ngrok en Meta Developers.