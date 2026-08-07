-- Supabase initial schema for VA Decoraciones chatbot MVP
-- Run this in Supabase SQL Editor.

create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  base_city text not null,
  tone text not null default 'amable y casual',
  starting_price numeric(10, 2) not null default 0,
  deposit_percentage numeric(5, 2) not null default 0,
  reservation_days integer not null default 0,
  transport_policy text,
  payment_methods text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  channel text not null check (channel in ('whatsapp', 'facebook', 'instagram', 'web', 'manual')),
  customer_name text,
  customer_phone text,
  customer_username text,
  event_type text,
  event_date date,
  event_zone text,
  event_place text,
  decoration_type text,
  decoration_size text check (decoration_size is null or decoration_size in ('sencillo', 'mediano', 'grande', 'no_definido')),
  theme_or_colors text,
  budget numeric(10, 2),
  has_reference_image boolean not null default false,
  reference_image_url text,
  quote_category text check (quote_category is null or quote_category in ('sencilla', 'mediana', 'grande_personalizada', 'requiere_revision')),
  requires_transport boolean,
  status text not null default 'nuevo' check (status in ('nuevo', 'recopilando_datos', 'listo_para_revision', 'cotizado', 'apartado', 'perdido', 'cerrado')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  channel text not null check (channel in ('whatsapp', 'facebook', 'instagram', 'web', 'manual')),
  external_conversation_id text,
  current_state text not null default 'inicio',
  status text not null default 'activa' check (status in ('activa', 'requiere_humano', 'cerrada')),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender text not null check (sender in ('cliente', 'bot', 'humano', 'sistema')),
  message_text text,
  message_type text not null default 'text' check (message_type in ('text', 'image', 'audio', 'video', 'file', 'system')),
  external_message_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.knowledge_base (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category text not null,
  question text,
  answer text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_leads_business_status on public.leads(business_id, status);
create index if not exists idx_leads_created_at on public.leads(created_at desc);
create index if not exists idx_conversations_business_status on public.conversations(business_id, status);
create index if not exists idx_messages_conversation_created_at on public.messages(conversation_id, created_at);
create index if not exists idx_knowledge_base_business_category on public.knowledge_base(business_id, category);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_businesses_updated_at on public.businesses;
create trigger set_businesses_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

drop trigger if exists set_leads_updated_at on public.leads;
create trigger set_leads_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

drop trigger if exists set_conversations_updated_at on public.conversations;
create trigger set_conversations_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists set_knowledge_base_updated_at on public.knowledge_base;
create trigger set_knowledge_base_updated_at
before update on public.knowledge_base
for each row execute function public.set_updated_at();

insert into public.businesses (
  name,
  base_city,
  tone,
  starting_price,
  deposit_percentage,
  reservation_days,
  transport_policy,
  payment_methods
)
values (
  'VA Decoraciones',
  'General Escobedo',
  'amable y casual',
  1800,
  50,
  15,
  'Fuera de Escobedo, el traslado se calcula segun los kilometros recorridos.',
  array['transferencia', 'efectivo', 'deposito', 'tarjeta']
)
on conflict do nothing;

insert into public.knowledge_base (business_id, category, question, answer)
select
  b.id,
  item.category,
  item.question,
  item.answer
from public.businesses b
cross join (
  values
    (
      'precios',
      'Cuanto cuesta una decoracion?',
      'Nuestras decoraciones comienzan desde $1,800 MXN. El precio final depende del tamano, complejidad, tematica, zona y detalles del montaje.'
    ),
    (
      'paquetes',
      'Manejan paquetes?',
      'Si, manejamos opciones segun el tipo de evento y decoracion. Podemos cotizar una opcion sencilla, mediana o mas elaborada de acuerdo con lo que necesites.'
    ),
    (
      'tematicas',
      'Que tematicas manejan?',
      'Trabajamos decoraciones personalizadas. Podemos basarnos en colores, personajes, estilos, fotos de referencia o ideas especificas para el evento.'
    ),
    (
      'reservacion',
      'Con cuanto tiempo debo apartar?',
      'Recomendamos apartar con al menos 15 dias de anticipacion para coordinar disponibilidad, materiales y logistica. Para eventos proximos, se puede revisar disponibilidad.'
    ),
    (
      'anticipo',
      'Cuanto se pide de anticipo?',
      'Para apartar fecha se requiere el 50% de anticipo.'
    ),
    (
      'pagos',
      'Aceptan tarjeta?',
      'Si, aceptamos transferencia, efectivo, deposito y tarjeta.'
    ),
    (
      'traslado',
      'Cobran envio o traslado?',
      'Para eventos fuera de Escobedo, el traslado se calcula segun los kilometros recorridos.'
    ),
    (
      'escalamiento',
      'Mensaje para pasar a revision humana',
      'Gracias, ya tenemos la informacion principal. En breve revisaran tu cotizacion y te atenderan para darte mas detalle sobre precio, disponibilidad y logistica.'
    )
) as item(category, question, answer)
where b.name = 'VA Decoraciones'
and not exists (
  select 1
  from public.knowledge_base kb
  where kb.business_id = b.id
    and kb.category = item.category
    and kb.question = item.question
);
