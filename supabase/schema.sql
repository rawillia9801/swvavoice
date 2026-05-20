create extension if not exists pgcrypto;

create table if not exists public.contacts (
  id uuid primary key default gen_random_uuid()
);

alter table public.contacts add column if not exists name text;
alter table public.contacts add column if not exists phone text;
alter table public.contacts add column if not exists phone_type text default 'Mobile';
alter table public.contacts add column if not exists email text;
alter table public.contacts add column if not exists contact_group text default 'Customer';
alter table public.contacts add column if not exists tags text[] default '{}';
alter table public.contacts add column if not exists favorite boolean default false;
alter table public.contacts add column if not exists location text;
alter table public.contacts add column if not exists notes text;
alter table public.contacts add column if not exists created_at timestamptz default now();
alter table public.contacts add column if not exists updated_at timestamptz default now();

update public.contacts set name = '' where name is null;
update public.contacts set phone = '' where phone is null;
update public.contacts set phone_type = 'Mobile' where phone_type is null;
update public.contacts set contact_group = 'Customer' where contact_group is null;
update public.contacts set tags = '{}' where tags is null;
update public.contacts set favorite = false where favorite is null;
update public.contacts set created_at = now() where created_at is null;
update public.contacts set updated_at = now() where updated_at is null;

alter table public.contacts alter column name set not null;
alter table public.contacts alter column phone set not null;
alter table public.contacts alter column phone_type set not null;
alter table public.contacts alter column phone_type set default 'Mobile';
alter table public.contacts alter column contact_group set not null;
alter table public.contacts alter column contact_group set default 'Customer';
alter table public.contacts alter column tags set not null;
alter table public.contacts alter column tags set default '{}';
alter table public.contacts alter column favorite set not null;
alter table public.contacts alter column favorite set default false;
alter table public.contacts alter column created_at set not null;
alter table public.contacts alter column created_at set default now();
alter table public.contacts alter column updated_at set not null;
alter table public.contacts alter column updated_at set default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'contacts_contact_group_check'
  ) then
    alter table public.contacts
      add constraint contacts_contact_group_check
      check (contact_group in ('Customer', 'Lead', 'Supplier'));
  end if;
end;
$$;

create index if not exists contacts_phone_idx on public.contacts (phone);
create index if not exists contacts_email_idx on public.contacts (email);
create index if not exists contacts_group_idx on public.contacts (contact_group);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid()
);

alter table public.conversations add column if not exists contact_id uuid;
alter table public.conversations add column if not exists contact_name text;
alter table public.conversations add column if not exists contact_phone text;
alter table public.conversations add column if not exists contact_phone_type text;
alter table public.conversations add column if not exists contact_email text;
alter table public.conversations add column if not exists contact_location text;
alter table public.conversations add column if not exists contact_added_at timestamptz;
alter table public.conversations add column if not exists contact_notes text;
alter table public.conversations add column if not exists contact_tags text[] default '{}';
alter table public.conversations add column if not exists channel text default 'sms';
alter table public.conversations add column if not exists status text default 'open';
alter table public.conversations add column if not exists unread_count integer default 0;
alter table public.conversations add column if not exists last_message_preview text;
alter table public.conversations add column if not exists last_message_at timestamptz;
alter table public.conversations add column if not exists created_at timestamptz default now();
alter table public.conversations add column if not exists updated_at timestamptz default now();

update public.conversations set contact_tags = '{}' where contact_tags is null;
update public.conversations set channel = 'sms' where channel is null;
update public.conversations set status = 'open' where status is null;
update public.conversations set unread_count = 0 where unread_count is null;
update public.conversations set created_at = now() where created_at is null;
update public.conversations set updated_at = now() where updated_at is null;

alter table public.conversations alter column contact_tags set not null;
alter table public.conversations alter column contact_tags set default '{}';
alter table public.conversations alter column channel set not null;
alter table public.conversations alter column channel set default 'sms';
alter table public.conversations alter column status set not null;
alter table public.conversations alter column status set default 'open';
alter table public.conversations alter column unread_count set not null;
alter table public.conversations alter column unread_count set default 0;
alter table public.conversations alter column created_at set not null;
alter table public.conversations alter column created_at set default now();
alter table public.conversations alter column updated_at set not null;
alter table public.conversations alter column updated_at set default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'conversations_contact_id_fkey'
  ) then
    alter table public.conversations
      add constraint conversations_contact_id_fkey
      foreign key (contact_id) references public.contacts(id) on delete set null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'conversations_channel_check'
  ) then
    alter table public.conversations
      add constraint conversations_channel_check
      check (channel in ('sms', 'whatsapp', 'chat', 'email', 'unknown'));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'conversations_status_check'
  ) then
    alter table public.conversations
      add constraint conversations_status_check
      check (status in ('open', 'unread', 'resolved', 'archived'));
  end if;
end;
$$;

create index if not exists conversations_status_idx on public.conversations (status);
create index if not exists conversations_channel_idx on public.conversations (channel);
create index if not exists conversations_last_message_at_idx on public.conversations (last_message_at desc);

create table if not exists public.conversation_messages (
  id uuid primary key default gen_random_uuid()
);

alter table public.conversation_messages add column if not exists conversation_id uuid;
alter table public.conversation_messages add column if not exists body text;
alter table public.conversation_messages add column if not exists direction text;
alter table public.conversation_messages add column if not exists sent_at timestamptz default now();
alter table public.conversation_messages add column if not exists read boolean default false;
alter table public.conversation_messages add column if not exists created_at timestamptz default now();

update public.conversation_messages set body = '' where body is null;
update public.conversation_messages set direction = 'incoming' where direction is null;
update public.conversation_messages set sent_at = now() where sent_at is null;
update public.conversation_messages set read = false where read is null;
update public.conversation_messages set created_at = now() where created_at is null;

alter table public.conversation_messages alter column body set not null;
alter table public.conversation_messages alter column direction set not null;
alter table public.conversation_messages alter column sent_at set not null;
alter table public.conversation_messages alter column sent_at set default now();
alter table public.conversation_messages alter column read set not null;
alter table public.conversation_messages alter column read set default false;
alter table public.conversation_messages alter column created_at set not null;
alter table public.conversation_messages alter column created_at set default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'conversation_messages_conversation_id_fkey'
  ) then
    alter table public.conversation_messages
      add constraint conversation_messages_conversation_id_fkey
      foreign key (conversation_id) references public.conversations(id) on delete cascade;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'conversation_messages_direction_check'
  ) then
    alter table public.conversation_messages
      add constraint conversation_messages_direction_check
      check (direction in ('incoming', 'outgoing'));
  end if;
end;
$$;

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
