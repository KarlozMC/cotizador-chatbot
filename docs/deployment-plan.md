# Plan De Despliegue - Cotizador Chatbot

Este documento concentra el estado actual del despliegue del proyecto `cotizador-chatbot`, las configuraciones necesarias, los errores resueltos y los siguientes pasos recomendados para mantener operativa una primera version profesional del chatbot y panel administrativo de VA Decoraciones.

## 1. Objetivo Del Despliegue

Publicar el chatbot de VA Decoraciones en URLs estables para que pueda:

- Recibir mensajes desde WhatsApp Cloud API.
- Procesar conversaciones automaticamente.
- Guardar prospectos, mensajes y conversaciones en Supabase.
- Responder por WhatsApp.
- Consultar prospectos desde un panel administrativo.
- Cambiar estados y registrar notas internas desde el panel.

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
- Panel desplegado en Azure App Service.
- Login simple funcionando.
- Listado de prospectos funcionando.
- Busqueda y filtros funcionando.
- Detalle del prospecto funcionando.
- Cambio de estado funcionando.
- Notas internas funcionando.
- Boton de contacto por WhatsApp funcionando.
- Logout funcionando.
- Interacciones del panel validadas en produccion.

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

## 5. Frontend Panel Desplegado En Azure

El panel administrativo quedo desplegado en Azure App Service.

URL base:

```text
https://cotizador-chatbot-panel-f0fcfya7ajbsb2bx.canadacentral-01.azurewebsites.net
```

Comando de inicio en Azure App Service:

```bash
npm start
```

Runtime recomendado:

```text
Node - 22 LTS
```

Script requerido en `frontend-panel/package.json`:

```json
{
  "scripts": {
    "start": "next start"
  }
}
```

## 6. Configuracion De Meta / WhatsApp

Configuracion actual:

- App de Meta: `VA Decoraciones Chatbot`
- Business Portfolio: `VA Decoraciones`
- Producto configurado: `Whatsapp Business Account`
- Webhook configurado contra Azure.
- Campo suscrito: `messages`.
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

## 7. Variables De Entorno Del Backend

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

- `SUPABASE_SERVICE_ROLE_KEY` no debe exponerse en frontend cliente.
- `WHATSAPP_ACCESS_TOKEN` puede expirar si es temporal.
- Si WhatsApp deja de enviar respuestas y aparece error `OAuthException` o codigo `190`, se debe renovar el token y actualizarlo en Azure.
- Despues de cambiar variables en Azure, reiniciar el App Service.

## 8. Variables De Entorno Del Frontend

Estas variables deben existir en dos lugares:

- Azure App Service del panel.
- GitHub Actions como Repository Secrets.

Variables necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
PANEL_ACCESS_KEY=
NODE_ENV=production
```

Notas:

- `NEXT_PUBLIC_SUPABASE_URL` puede ser publica.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` puede usarse del lado cliente si se requiere.
- `SUPABASE_SERVICE_ROLE_KEY` solo debe usarse del lado servidor.
- `PANEL_ACCESS_KEY` es la clave temporal para entrar al panel.
- En GitHub deben estar en `Settings > Secrets and variables > Actions > Secrets`, no en `Variables`.

## 9. Comandos Locales

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

Ejecutar compilado:

```bash
npm start
```

## 10. GitHub Actions Para Backend

El backend fue desplegado desde GitHub Actions hacia Azure App Service.

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

## 11. GitHub Actions Para Frontend Panel

El panel se despliega desde GitHub Actions hacia Azure App Service.

Puntos clave corregidos:

- El workflow debe compilar desde `frontend-panel`.
- Las variables de Supabase deben existir como GitHub Secrets para que `next build` pueda ejecutarse.
- El artifact debe incluir la carpeta `.next`.
- Como `.next` es una carpeta oculta, `actions/upload-artifact@v4` debe usar `include-hidden-files: true`.

Ejemplo de configuracion relevante:

```yaml
- name: Build frontend panel
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
    SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
    PANEL_ACCESS_KEY: ${{ secrets.PANEL_ACCESS_KEY }}
  run: npm run build
```

Preparacion correcta del artifact:

```yaml
- name: Prepare artifact for deployment
  run: |
    mkdir deploy
    cp -r .next deploy/.next
    cp -r public deploy/public
    cp package.json deploy/package.json
    cp package-lock.json deploy/package-lock.json
    cp next.config.ts deploy/next.config.ts
```

Upload correcto del artifact:

```yaml
- name: Upload artifact for deployment job
  uses: actions/upload-artifact@v4
  with:
    name: frontend-panel
    path: frontend-panel/deploy
    include-hidden-files: true
```

Error que resuelve esta configuracion:

```text
Could not find a production build in the '.next' directory.
Try building your app with 'next build' before starting the production server.
```

## 12. Logs En Azure

Para revisar actividad del backend o panel:

```text
Azure App Service > Supervision > Secuencia de registro
```

Logs esperados cuando llega un mensaje al backend:

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

Si el panel muestra `503 Service Unavailable`, revisar:

- Que el App Service este iniciado.
- Que el runtime sea Node 22 LTS.
- Que el comando de inicio sea `npm start`.
- Que el artifact desplegado incluya `.next`.
- Que existan variables de entorno del panel en Azure.

## 13. Application Insights

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

## 14. Hosting Elegido

Configuracion actual:

```text
Backend: Azure App Service
Frontend: Azure App Service
Base de datos: Supabase
WhatsApp: Meta WhatsApp Cloud API
```

Esta opcion quedo elegida porque:

- El backend ya estaba funcionando correctamente en Azure.
- Azure da URL publica HTTPS estable.
- El panel usa Next.js con comportamiento server-side, cookies y rutas dinamicas.
- Azure Static Web Apps presento problemas de warm up con Next.js.
- Azure App Service resulto mas compatible para el panel.

## 15. Checklist Backend

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

## 16. Checklist Frontend

- [x] Frontend corre localmente.
- [x] Frontend compila.
- [x] Login local funcional.
- [x] Listado de prospectos funcional.
- [x] Detalle de prospecto funcional.
- [x] Cambio de estado funcional.
- [x] Notas internas funcionales.
- [x] Contacto por WhatsApp funcional.
- [x] Logout funcional.
- [x] Azure App Service creado para el panel.
- [x] Variables de entorno configuradas en Azure.
- [x] GitHub Secrets configurados para build.
- [x] Workflow ajustado para `frontend-panel`.
- [x] Artifact corregido para incluir `.next`.
- [x] Panel desplegado en Azure.
- [x] Login validado desde URL publica.
- [x] Interacciones del panel validadas desde URL publica.

## 17. Errores Resueltos

### Error: Missing NEXT_PUBLIC_SUPABASE_URL

Mensaje:

```text
Missing NEXT_PUBLIC_SUPABASE_URL
```

Causa:

- GitHub Actions compilaba el frontend sin los secrets requeridos.

Solucion:

- Crear secrets en GitHub Actions.
- Pasarlos al paso de build mediante `env`.

### Error: Artifact Not Found

Mensaje:

```text
Artifact not found for name: frontend-panel
```

Causa:

- El workflow intentaba descargar un artifact que no se habia creado correctamente.

Solucion:

- Crear la carpeta `deploy`.
- Subirla con el nombre `frontend-panel`.
- Descargar el mismo nombre en el job de deploy.

### Error: Could Not Find Production Build

Mensaje:

```text
Could not find a production build in the '.next' directory
```

Causa:

- El artifact no incluia la carpeta `.next`.
- `actions/upload-artifact@v4` puede omitir archivos y carpetas ocultas si no se indica lo contrario.

Solucion:

- Agregar `include-hidden-files: true` al paso de upload del artifact.

### Error: 503 Service Unavailable

Mensaje:

```text
503 Service Unavailable
504 GatewayTimeout
```

Causas revisadas:

- App Service iniciado pero sin build `.next`.
- Posible cuota temporal del plan gratuito.
- Runtime Node no consistente.
- Comando de inicio pendiente de ajustar.

Solucion aplicada:

- Runtime ajustado a Node 22 LTS.
- Comando de inicio ajustado a `npm start`.
- Artifact corregido para incluir `.next`.
- Panel validado despues del despliegue correcto.

## 18. Seguridad Pendiente

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

## 19. Recomendacion Sobre Numero De WhatsApp

Para este momento no se recomienda migrar el numero personal o principal de VA Decoraciones.

Recomendacion:

- Seguir probando con numero de prueba de Meta.
- Para produccion, comprar o usar un numero nuevo dedicado al bot.
- Ese numero debe ser exclusivo para WhatsApp Cloud API.
- Evitar desconectar el WhatsApp principal mientras el flujo sigue en pruebas.

## 20. Notas Operativas

- Ngrok ya no es necesario como webhook principal porque el backend tiene URL estable en Azure.
- Ngrok puede seguir sirviendo para pruebas locales rapidas.
- Si se cambia la URL publica del backend, hay que actualizar el webhook en Meta.
- Si se cambia el token de verificacion, hay que volver a verificar el webhook.
- Si no llegan respuestas a WhatsApp pero el log dice que Meta acepto el envio, probar iniciar conversacion desde WhatsApp primero.
- Si el backend guarda en Supabase pero WhatsApp no responde, revisar token, ventana de conversacion y numero autorizado.
- En plan gratuito de Azure pueden aparecer limites temporales de cuota.
- Si Azure marca `Se ha excedido la cuota`, esperar un tiempo o considerar subir a un plan basico usando creditos gratuitos.

## 21. Proximo Hito

Preparar una demo controlada de punta a punta.

Objetivo del siguiente hito:

- Enviar mensaje desde WhatsApp.
- Completar flujo de cotizacion.
- Confirmar que el prospecto se guarda en Supabase.
- Entrar al panel publico.
- Ver el prospecto nuevo.
- Cambiar estado.
- Guardar nota interna.
- Abrir contacto por WhatsApp desde el panel.

Commit sugerido:

```text
Document completed Azure frontend and backend deployment
```
