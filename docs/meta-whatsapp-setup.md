# Meta WhatsApp Cloud API Setup

Esta guia documenta la configuracion actual para probar el chatbot de VA Decoraciones con WhatsApp Cloud API.

## Estado Actual

- App de Meta creada: `VA Decoraciones Chatbot`.
- Business Portfolio creado: `VA Decoraciones`.
- Administradora del negocio agregada.
- Producto/caso de uso agregado: `Conectar en WhatsApp`.
- Numero de prueba de Meta disponible.
- Destinatario de prueba agregado.
- Webhook verificado con ngrok.
- Campo `messages` suscrito en `Whatsapp Business Account`.
- Envio de mensajes desde backend probado correctamente usando webhook simulado.

## Variables De Entorno

En `backend/.env` deben existir estas variables:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_API_VERSION=v26.0
```

Notas importantes:

- `SUPABASE_URL` debe ser la URL base del proyecto, sin `/rest/v1`.
- `WHATSAPP_ACCESS_TOKEN` es temporal durante pruebas y puede expirar.
- `WHATSAPP_PHONE_NUMBER_ID` corresponde al numero de prueba de Meta.
- `WHATSAPP_VERIFY_TOKEN` debe coincidir con el token usado al verificar el webhook en Meta.
- `.env` nunca debe subirse a GitHub.

## Ejecutar Backend Local

Desde la carpeta `backend/`:

```bash
npm run api
```

El backend debe responder en:

```text
http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "ok": true,
  "service": "cotizador-chatbot-backend"
}
```

## Exponer Backend Con Ngrok

En otra terminal:

```bash
ngrok http 3000
```

Ejemplo de URL generada:

```text
https://observing-clammy-petite.ngrok-free.dev
```

La URL cambia al reiniciar ngrok si se usa el plan gratuito.

Para validar que el tunel esta activo:

```powershell
Invoke-RestMethod `
  -Uri "https://TU-NGROK.ngrok-free.dev/health" `
  -Headers @{ "ngrok-skip-browser-warning" = "true" }
```

## Configurar Webhook En Meta

En Meta Developers, dentro de la app:

```text
Casos de uso > Conectar en WhatsApp > Webhooks
```

Producto seleccionado:

```text
Whatsapp Business Account
```

Callback URL:

```text
https://TU-NGROK.ngrok-free.dev/webhooks/whatsapp
```

Token de verificacion:

```text
El mismo valor de WHATSAPP_VERIFY_TOKEN
```

Campo suscrito:

```text
messages
```

## Probar Webhook Publico Manualmente

En PowerShell:

```powershell
$body = @{
  entry = @(
    @{
      changes = @(
        @{
          value = @{
            messages = @(
              @{
                from = "NUMERO_AUTORIZADO"
                id = "wamid.test123"
                type = "text"
                text = @{
                  body = "Hola"
                }
              }
            )
          }
        }
      )
    }
  )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod `
  -Uri "https://TU-NGROK.ngrok-free.dev/webhooks/whatsapp" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body $body
```

Si funciona, el backend debe imprimir:

```text
Mensaje WhatsApp procesado
```

Y el numero autorizado debe recibir respuesta por WhatsApp.

## Probar Conversacion Completa

Crear esta funcion temporal en PowerShell:

```powershell
function Send-TestWhatsappMessage {
  param (
    [string]$Text
  )

  $body = @{
    entry = @(
      @{
        changes = @(
          @{
            value = @{
              messages = @(
                @{
                  from = "NUMERO_AUTORIZADO"
                  id = "wamid.$([guid]::NewGuid().ToString())"
                  type = "text"
                  text = @{
                    body = $Text
                  }
                }
              )
            }
          }
        )
      }
    )
  } | ConvertTo-Json -Depth 10

  Invoke-RestMethod `
    -Uri "https://TU-NGROK.ngrok-free.dev/webhooks/whatsapp" `
    -Method Post `
    -Headers @{ "Content-Type" = "application/json" } `
    -Body $body
}
```

Ejemplo de conversacion completa:

```powershell
Send-TestWhatsappMessage "Hola"
Send-TestWhatsappMessage "Carlos"
Send-TestWhatsappMessage "Cumpleaños"
Send-TestWhatsappMessage "Arco organico"
Send-TestWhatsappMessage "20 de septiembre"
Send-TestWhatsappMessage "San Nicolas"
Send-TestWhatsappMessage "Salon"
Send-TestWhatsappMessage "Mediano"
Send-TestWhatsappMessage "Barbie rosa con dorado"
Send-TestWhatsappMessage "2500"
```

Resultado esperado:

- El backend imprime cada mensaje procesado.
- El numero autorizado recibe respuestas por WhatsApp.
- Supabase guarda conversacion, mensajes y lead final.
- La conversacion queda marcada como `requiere_humano`.

## Problema Conocido

Aunque el webhook de prueba y el webhook simulado funcionan, los mensajes reales enviados desde WhatsApp al numero de prueba de Meta pueden no disparar el webhook automaticamente en ciertas condiciones de configuracion o modo de prueba.

Diagnostico:

- Si ngrok no muestra `POST /webhooks/whatsapp`, Meta no esta enviando el evento.
- Si ngrok si muestra `POST`, pero WhatsApp no responde, revisar token, phone number id o destinatario autorizado.
- El backend ya fue validado usando webhook publico simulado.

## Errores Comunes

### Recipient phone number not in allowed list

Error:

```text
(#131030) Recipient phone number not in allowed list
```

Causa probable:

- El numero destino no esta agregado como destinatario de prueba en Meta.
- El payload de prueba de Meta trae un numero simulado no autorizado.
- El numero tiene formato incorrecto.

Formato recomendado:

```text
528182504414
```

Sin `+`, espacios ni guiones.

### Ngrok endpoint offline

Causa probable:

- Se uso el placeholder `TU-NGROK` en vez de la URL real.
- Ngrok se reinicio y cambio la URL.
- El backend local no esta corriendo en puerto `3000`.

Validar la URL actual en la terminal de ngrok:

```text
Forwarding https://URL-ACTUAL.ngrok-free.dev -> http://localhost:3000
```

### Meta no envia webhooks reales

Revisar:

- App publicada.
- Producto correcto: `Whatsapp Business Account`.
- Campo `messages` suscrito.
- URL de ngrok actualizada en Meta.
- Backend y ngrok corriendo.
- Numero autorizado como destinatario de prueba.

## Recomendacion Para Produccion

No migrar todavia el numero personal o principal de VA Decoraciones.

Opcion recomendada:

- Usar un numero nuevo para el chatbot.
- Mantener el numero actual para atencion humana.
- Migrar el numero principal solo cuando el bot este estable y haya un plan claro de operacion.

## Pendientes

- Resolver recepcion automatica de mensajes reales desde WhatsApp/Meta.
- Preparar numero nuevo para chatbot en produccion.
- Evaluar despliegue en hosting real para reemplazar ngrok.
- Crear panel basico para consultar prospectos.
- Convertir configuracion en multi-cliente.
