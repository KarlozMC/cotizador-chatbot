# Cotizador Chatbot

Chatbot reutilizable para atención inicial, captura de prospectos y cotización preliminar de negocios que reciben solicitudes por WhatsApp, Facebook e Instagram.

El primer caso de uso es **VA Decoraciones**, un emprendimiento de decoración con globos ubicado en General Escobedo.

## Objetivo

Construir un chatbot profesional que pueda:

- Atender preguntas frecuentes.
- Guiar al cliente para recopilar datos de cotización.
- Clasificar solicitudes por complejidad.
- Detectar eventos urgentes.
- Guardar prospectos en Supabase.
- Registrar conversaciones y mensajes.
- Generar un resumen interno para seguimiento humano.

## Caso inicial: VA Decoraciones

Datos comerciales principales:

- Servicio: decoración con globos.
- Precio inicial: desde $1,800 MXN.
- Anticipo: 50%.
- Reservación recomendada: al menos 15 días de anticipación.
- Ubicación base: General Escobedo.
- Traslado: fuera de Escobedo se calcula por kilómetros recorridos.
- Métodos de pago: transferencia, efectivo, depósito y tarjeta.
- Tono del bot: amable y casual.

## Stack técnico

- Node.js
- TypeScript
- Supabase PostgreSQL
- Supabase JS Client
- dotenv
- tsx

## Estructura del proyecto

```text
cotizador-chatbot/
  backend/
    src/
      config/
      flows/
      services/
      simulator/
      types/
    data/
    package.json
    tsconfig.json
  database/
    supabase_va_decoraciones_schema.sql
  docs/
  README.md


## Configuración local

Entrar a la carpeta del backend:
- cd backend

Instalar dependencias:
- npm install

Crear archivo .env dentro de backend/:
- SUPABASE_URL=
- SUPABASE_SERVICE_ROLE_KEY=

Importante: SUPABASE_URL debe ser solo la URL base del proyecto, por ejemplo:
- SUPABASE_URL=https://xxxxx.supabase.co

No debe incluir /rest/v1.

## Base de datos

El script inicial de Supabase está en:
-database/supabase_va_decoraciones_schema.sql

Debe ejecutarse desde el SQL Editor de Supabase.
- Tablas principales:
- businesses
- leads
- conversations
- messages
- knowledge_base

## Scripts disponibles

Desde backend/:
Ejecutar simulador manual:
- npm run dev

Ejecutar escenario normal:
- npm run scenario:normal

Ejecutar escenario urgente:
- npm run scenario:urgente

Ejecutar escenario fuera de Escobedo:
- npm run scenario:fuera

Ejecutar escenario grande/personalizado:
- npm run scenario:grande

Compilar TypeScript:
- npm run build

## Funcionalidades actuales

- Flujo conversacional local.
- Respuestas a preguntas frecuentes.
- Captura de nombre del cliente.
- Captura de datos del evento.
- Clasificación de cotización.
- Detección de eventos urgentes.
- Guardado local de ficha JSON.
- Guardado de prospectos en Supabase.
- Guardado de conversaciones y mensajes.
- Generación de resumen interno.
- Escenarios automáticos de prueba.

## Próximas mejoras

- Evitar guardar duplicados si el simulador sigue activo.
- Mejorar parser de fechas.
- Crear pruebas automatizadas.
- Crear API HTTP para recibir mensajes.
- Preparar integración con WhatsApp Cloud API.
- Crear panel básico para revisar prospectos.
- Convertir configuración en multi-cliente.

## Nota de seguridad

El archivo .env no debe subirse a GitHub.

Debe estar ignorado en .gitignore:
- backend/.env
- backend/data/
- backend/node_modules/
- backend/dist/

## Flujo general del MVP

Cliente escribe mensaje
  -> Bot responde o pregunta siguiente dato
  -> Sistema guarda mensaje
  -> Bot actualiza estado de conversación
  -> Al completar datos, genera resumen
  -> Guarda prospecto en Supabase
  -> Guarda resumen interno
  -> Marca conversación como requiere_humano

## Estados principales del bot

inicio
esperando_nombre
esperando_tipo_evento
esperando_tipo_decoracion
esperando_fecha
esperando_zona
esperando_lugar
esperando_tamano
esperando_tematica
esperando_presupuesto
resumen_cotizacion
requiere_humano
cerrado

## Escenarios de prueba incluidos

- normal: cliente con evento regular dentro de Escobedo.
- vurgente: cliente con evento en menos de 15 días.
- fuera_escobedo: cliente fuera de la zona base.
- grande_personalizada: cliente con decoración grande o personalizada.

## Recomendación de desarrollo

El proyecto debe avanzar por etapas:
1. Consolidar flujo conversacional.
2. Mejorar validaciones y fechas.
3. Crear API HTTP.
4. Conectar WhatsApp Cloud API.
5. Crear panel básico.
6. Convertir el sistema en plantilla reutilizable para otros negocios.

## Integración Meta WhatsApp

La guía de configuración de Meta, ngrok y WhatsApp Cloud API está en:

```text
docs/meta-whatsapp-setup.md