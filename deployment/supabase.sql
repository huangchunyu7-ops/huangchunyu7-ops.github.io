-- Run once in your own project's SQL Editor. Browser clients use a publishable key.
create table if not exists public.learning_snapshots (
 user_id uuid primary key references auth.users(id) on delete cascade,
 payload jsonb not null check (jsonb_typeof(payload) = 'object'),
 revision bigint not null default 1,
 updated_at timestamptz not null default now()
);
alter table public.learning_snapshots enable row level security;
drop policy if exists own_snapshot_read on public.learning_snapshots;
create policy own_snapshot_read on public.learning_snapshots for select to authenticated using ((select auth.uid()) = user_id);
-- Updates go only through the compare-and-swap function below.
revoke all on public.learning_snapshots from anon, authenticated;
grant select on public.learning_snapshots to authenticated;
create or replace function public.save_learning_snapshot(p_payload jsonb,p_revision bigint)
returns setof public.learning_snapshots
language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid();
begin
 if v_uid is null then raise exception 'Sign in required'; end if;
 if jsonb_typeof(p_payload) <> 'object' or octet_length(p_payload::text) > 2000000 then raise exception 'Invalid snapshot'; end if;
 if p_revision = 0 then
  return query insert into public.learning_snapshots(user_id,payload) values(v_uid,p_payload)
   on conflict(user_id) do nothing returning *;
 else
  return query update public.learning_snapshots set payload=p_payload,revision=revision+1,updated_at=now()
   where user_id=v_uid and revision=p_revision returning *;
 end if;
end;
$$;
revoke all on function public.save_learning_snapshot(jsonb,bigint) from public,anon;
grant execute on function public.save_learning_snapshot(jsonb,bigint) to authenticated;
create table if not exists public.study_notes (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 title text not null check(char_length(title) between 1 and 160),
 content text not null check(char_length(content)<=50000),
 updated_at timestamptz not null default now()
);
alter table public.study_notes enable row level security;
drop policy if exists own_notes on public.study_notes;
create policy own_notes on public.study_notes for all to authenticated
 using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
revoke all on public.study_notes from anon;
grant select,insert,update,delete on public.study_notes to authenticated;
