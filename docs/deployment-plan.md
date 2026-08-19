# Plan De Despliegue - Cotizador Chatbot

Este documento concentra el estado actual del despliegue del proyecto `cotizador-chatbot`, las configuraciones necesarias y los siguientes pasos recomendados para dejar operativa una primera version profesional del chatbot y panel administrativo de VA Decoraciones.

## 1. Objetivo Del Despliegue

Publicar el chatbot de VA Decoraciones en una URL estable para que pueda:

- Recibir mensajes desde WhatsApp Cloud API.
- Procesar conversaciones automaticamente.
- Guardar prospectos, mensajes y conversaciones en Supabase.
- Responder por WhatsApp.
- Consultar prospectos desde un panel administrativo.

## 2. Componentes Del Proyecto

El repositorio esta organizado principalmente en:

```text
cotizador-chatbot/
  backend/
  frontend-panel/
  database/
  docs/
  public/
```

### Backend

El backend es la API principal del proyecto.

Responsabilidades:

- Recibir webhooks de WhatsApp.
- Validar el webhook de Meta.
- Procesar mensajes entrantes.
- Ejecutar el flujo conversacional de VA Decoraciones.
- Guardar leads, conversaciones y mensajes en Supabase.
- Enviar respuestas usando WhatsApp Cloud API.

### Frontend Panel

El frontend es el panel administrativo.

Responsabilidades:

- Iniciar sesion con una clave simple.
- Mostrar prospectos.
- Filtrar y buscar leads.
- Ver detalle de prospecto.
- Cambiar estado del prospecto.
- Guardar notas internas.
- Abrir contacto directo por WhatsApp.
- Cerrar sesion.

### Base De Datos

La base de datos esta en Supabase, usando PostgreSQL.

Tablas principales:

- `businesses`
- `leads`
- `conversations`
- `messages`
- `knowledge_base`

## 3. Estado Actual

### Backend

Estado actual:

- Backend local funcional.
- Backend desplegado en Azure App Service.
- `/health` responde correctamente en Azure.
- Webhook de WhatsApp verificado en Meta.
- Campo `messages` suscrito en Meta.
- Mensajes entrantes llegan al backend en Azure.
- Los mensajes se procesan correctamente.
- Supabase guarda conversaciones, mensajes y leads.
- El backend envia respuestas por WhatsApp.
- WhatsApp respondio correctamente despues de iniciar conversacion desde el telefono del usuario y ejecutar la prueba.

### Frontend Panel

Estado actual:

- Panel local funcional.
- Login simple funcionando.
- Listado de prospectos funcionando.
- Busqueda y filtros funcionando.
- Detalle del prospecto funcionando.
- Cambio de estado funcionando.
- Notas internas funcionando.
- Boton de contacto por WhatsApp funcionando.
- Logout funcionando.
- Pendiente desplegar panel en Azure.

## 4. Backend Desplegado En Azure

URL base:

```text
https://cotizador-chatbot-backend-ddhgcchkcheadrff.canadacentral-01.azurewebsites.net
```

Health check:

```text
https://cotizador-chatbot-backend-ddhgcchkcheadrff.canadacentral-01.azurewebsites.net/health
```

Respuesta esperada:

```json
{
  "ok": true,
  "service": "cotizador-chatbot-backend"
}
```

Webhook de WhatsApp:

```text
https://cotizador-chatbot-backend-ddhgcchkcheadrff.canadacentral-01.azurewebsites.net/webhooks/whatsapp
```

## 5. Configuracion De Meta / WhatsApp

Configuracion actual:

- App de Meta: `VA Decoraciones Chatbot`
- Business Portfolio: `VA Decoraciones`
- Producto configurado: `Whatsapp Business Account`
- Webhook configurado contra Azure.
- Campo suscrito: `messages`
- Numero de prueba autorizado.
- Respuesta por WhatsApp validada.

### Punto Importante Sobre WhatsApp

Para que WhatsApp permita respuestas de texto libre, normalmente debe existir una ventana de conversacion activa.

Esto significa:

- El usuario debe mandar primero un mensaje al numero de WhatsApp.
- Despues de eso, el bot puede responder dentro de la ventana permitida por WhatsApp.
- Si no hay ventana activa, Meta puede aceptar algunas pruebas pero no entregar la respuesta al telefono.
- Para iniciar conversaciones fuera de esa ventana, se requieren plantillas aprobadas por Meta.

Validacion realizada:

- Se mando mensaje desde WhatsApp.
- Se ejecuto prueba.
- El backend recibio el mensaje.
- El backend proceso la conversacion.
- El backend envio respuesta.
- La respuesta llego correctamente a WhatsApp.

## 6. Variables De Entorno Del Backend

Estas variables deben configurarse en Azure App Service, dentro de:

```text
Configuracion > Variables de entorno
```

Variables necesarias:

```env
NODE_ENV=production
PORT=8080
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_VERSION=v26.0
```

Notas:

- `SUPABASE_SERVICE_ROLE_KEY` no debe exponerse en frontend.
- `WHATSAPP_ACCESS_TOKEN` puede expirar si es temporal.
- Si WhatsApp deja de enviar respuestas y aparece error `OAuthException` o codigo `190`, se debe renovar el token y actualizarlo en Azure.
- Despues de cambiar variables en Azure, reiniciar el App Service.

## 7. Variables De Entorno Del Frontend

Estas variables se usaran al desplegar `frontend-panel`.

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PANEL_ACCESS_KEY=
```

Notas:

- `NEXT_PUBLIC_SUPABASE_URL` puede ser publica.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` puede usarse del lado cliente si se requiere.
- `SUPABASE_SERVICE_ROLE_KEY` solo debe usarse del lado servidor.
- `PANEL_ACCESS_KEY` es la clave temporal para entrar al panel.

## 8. Comandos Locales

### Backend

Entrar a la carpeta:

```bash
cd backend
```

Instalar dependencias:

```bash
npm install
```

Ejecutar en modo API local:

```bash
npm run api
```

Compilar:

```bash
npm run build
```

Ejecutar compilado:

```bash
npm start
```

### Frontend Panel

Entrar a la carpeta:

```bash
cd frontend-panel
```

Instalar dependencias:

```bash
npm install
```

Ejecutar local:

```bash
npm run dev
```

Compilar:

```bash
npm run build
```

## 9. GitHub Actions Para Backend

El backend ya fue desplegado desde GitHub Actions hacia Azure App Service.

Punto clave corregido:

- El workflow debe ejecutar `npm install`, `npm run build` y preparar el artifact dentro de `backend`.
- El error anterior ocurria porque GitHub Actions buscaba `package.json` en la raiz del repositorio.

Configuracion esperada:

```yaml
working-directory: backend
```

El artifact de despliegue debe salir desde:

```text
backend/
```

## 10. Logs En Azure

Para revisar actividad del backend:

```text
Azure App Service > Supervision > Secuencia de registro
```

Logs esperados cuando llega un mensaje:

```text
Mensaje WhatsApp procesado
Respuesta enviada por WhatsApp
```

Si aparece:

```text
Authentication Error
OAuthException
code 190
```

Accion recomendada:

1. Generar o renovar token en Meta.
2. Actualizar `WHATSAPP_ACCESS_TOKEN` en Azure.
3. Guardar cambios.
4. Reiniciar el App Service.
5. Probar de nuevo enviando primero un mensaje desde WhatsApp.

## 11. Application Insights

Application Insights no es obligatorio para validar el MVP.

Para este momento basta con:

- App Service Logs.
- Secuencia de registro.
- Logs del backend con `console.log`.

Application Insights se puede activar mas adelante cuando se quiera:

- Monitoreo mas completo.
- Trazabilidad de errores.
- Alertas.
- Metricas historicas.
- Diagnostico profesional para produccion.

## 12. Opciones De Hosting

### Opcion Recomendada Actual

```text
Backend: Azure App Service
Frontend: Azure Static Web Apps o Azure App Service
Base de datos: Supabase
```

Esta opcion es la mas alineada con el objetivo actual porque:

- Ya se logro desplegar el backend en Azure.
- Azure da URL publica HTTPS estable.
- Es buen entrenamiento para proyectos profesionales.
- Permite crecer despues hacia dominios, monitoreo y ambientes separados.

### Alternativa Para Frontend

Primera opcion:

```text
Azure Static Web Apps
```

Alternativa si hay problemas con Next.js, server actions o cookies:

```text
Azure App Service
```

## 13. Checklist Backend

- [x] Backend corre localmente.
- [x] Backend compila.
- [x] Script `start` ejecuta `node dist/server.js`.
- [x] Azure App Service creado.
- [x] GitHub Actions configurado para backend.
- [x] Despliegue en Azure exitoso.
- [x] `/health` responde en Azure.
- [x] Variables de entorno configuradas en Azure.
- [x] Webhook configurado en Meta.
- [x] Webhook verificado.
- [x] Campo `messages` suscrito.
- [x] Mensaje entrante llega a Azure.
- [x] Mensaje se guarda en Supabase.
- [x] Respuesta enviada por WhatsApp.
- [x] Respuesta recibida en WhatsApp.

## 14. Checklist Frontend

- [x] Frontend corre localmente.
- [x] Frontend compila.
- [x] Login local funcional.
- [x] Listado de prospectos funcional.
- [x] Detalle de prospecto funcional.
- [x] Cambio de estado funcional.
- [x] Notas internas funcionales.
- [x] Contacto por WhatsApp funcional.
- [x] Logout funcional.
- [ ] Desplegar `frontend-panel` en Azure.
- [ ] Configurar variables de entorno del frontend en Azure.
- [ ] Validar login desde URL publica.
- [ ] Validar listado de prospectos desde URL publica.
- [ ] Validar detalle de prospecto desde URL publica.
- [ ] Validar cambio de estado desde URL publica.
- [ ] Validar notas internas desde URL publica.

## 15. Seguridad Pendiente

Pendientes antes de una version mas formal:

- Cambiar login simple por autenticacion real.
- Definir usuarios administradores.
- Revisar politicas RLS definitivas.
- Mantener `SUPABASE_SERVICE_ROLE_KEY` solo en backend o server side.
- Usar token permanente de WhatsApp para produccion.
- Rotar tokens temporales cuando expiren.
- No subir `.env` al repositorio.
- No publicar tokens en capturas ni documentos.
- Reducir logs sensibles antes de trabajar con clientes reales.

## 16. Recomendacion Sobre Numero De WhatsApp

Para este momento no se recomienda migrar el numero personal o principal de VA Decoraciones.

Recomendacion:

- Seguir probando con numero de prueba de Meta.
- Para produccion, comprar o usar un numero nuevo dedicado al bot.
- Ese numero debe ser exclusivo para WhatsApp Cloud API.
- Evitar desconectar el WhatsApp principal mientras el flujo sigue en pruebas.

## 17. Notas Operativas

- Ngrok ya no es necesario como webhook principal porque el backend tiene URL estable en Azure.
- Ngrok puede seguir sirviendo para pruebas locales rapidas.
- Si se cambia la URL publica del backend, hay que actualizar el webhook en Meta.
- Si se cambia el token de verificacion, hay que volver a verificar el webhook.
- Si no llegan respuestas a WhatsApp pero el log dice que Meta acepto el envio, probar iniciar conversacion desde WhatsApp primero.
- Si el backend guarda en Supabase pero WhatsApp no responde, revisar token, ventana de conversacion y numero autorizado.

## 18. Proximo Hito

Desplegar el `frontend-panel` en Azure para tener una URL publica del panel administrativo.

Objetivo del siguiente hito:

- Publicar panel administrativo.
- Configurar variables de entorno.
- Entrar con `PANEL_ACCESS_KEY`.
- Ver leads reales creados desde WhatsApp.
- Cambiar estado y guardar notas desde la URL publica.

Commit sugerido:

```text
Document Azure backend deployment
```
