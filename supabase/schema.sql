create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  phone_type text not null default 'Mobile',
  email text,
  contact_group text not null default 'Customer'
    check (contact_group in ('Customer', 'Lead', 'Supplier')),
  tags text[] not null default '{}',
  favorite boolean not null default false,
  location text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_phone_idx on public.contacts (phone);
create index if not exists contacts_email_idx on public.contacts (email);
create index if not exists contacts_group_idx on public.contacts (contact_group);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  contact_id uuid references public.contacts(id) on delete set null,
  contact_name text,
  contact_phone text,
  contact_phone_type text,
  contact_email text,
  contact_location text,
  contact_added_at timestamptz,
  contact_notes text,
  contact_tags text[] not null default '{}',
  channel text not null default 'sms'
    check (channel in ('sms', 'whatsapp', 'chat', 'email', 'unknown')),
  status text not null default 'open'
    check (status in ('open', 'unread', 'resolved', 'archived')),
  unread_count integer not null default 0,
  last_message_preview text,
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists conversations_status_idx on public.conversations (status);
create index if not exists conversations_channel_idx on public.conversations (channel);
create index if not exists conversations_last_message_at_idx on public.conversations (last_message_at desc);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  body text not null,
  direction text not null check (direction in ('incoming', 'outgoing')),
  sent_at timestamptz not null default now(),
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists conversation_messages_conversation_id_idx
  on public.conversation_messages (conversation_id, sent_at);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists contacts_set_updated_at on public.contacts;
create trigger contacts_set_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

drop trigger if exists conversations_set_updated_at on public.conversations;
create trigger conversations_set_updated_at
before update on public.conversations
for each row execute function public.set_updated_at();
