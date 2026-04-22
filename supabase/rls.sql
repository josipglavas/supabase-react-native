-- RLS policies for the Prisma-created tables used by the app.
-- Run this in Supabase SQL editor (or `supabase db reset`/migration pipeline if you have one).
--
-- Assumptions:
-- - `User.id` matches `auth.uid()`
-- - `User.groupId` is the group membership used by the app

-- IMPORTANT:
-- Prisma-created tables often don't get Supabase's default GRANTs.
-- If you see `permission denied for table ...` (not "violates row-level security"),
-- you must grant privileges to the API roles.
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table
  "Pet",
  "ScheduleType",
  "SchedulePreset",
  "PetSchedule",
  "PetScheduleCompletion"
to anon, authenticated;

-- Helper: app user row for current auth user
create or replace view public._current_app_user as
select u.*
from "User" u
where u.id = auth.uid();

-- PET
alter table "Pet" enable row level security;
create policy "pet_select_in_group"
on "Pet"
for select
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "Pet"."groupId"));

create policy "pet_insert_in_group"
on "Pet"
for insert
with check (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "Pet"."groupId"));

create policy "pet_update_in_group"
on "Pet"
for update
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "Pet"."groupId"))
with check (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "Pet"."groupId"));

-- Delete pet should be restricted by role in your app layer; keep DB conservative (deny by default).

-- SCHEDULE TYPE
alter table "ScheduleType" enable row level security;
create policy "schedule_type_select_in_group"
on "ScheduleType"
for select
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "ScheduleType"."groupId"));

create policy "schedule_type_write_in_group"
on "ScheduleType"
for insert
with check (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "ScheduleType"."groupId"));

create policy "schedule_type_update_in_group"
on "ScheduleType"
for update
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "ScheduleType"."groupId"))
with check (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "ScheduleType"."groupId"));

create policy "schedule_type_delete_in_group"
on "ScheduleType"
for delete
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "ScheduleType"."groupId"));

-- SCHEDULE PRESET
alter table "SchedulePreset" enable row level security;
create policy "schedule_preset_select_in_group"
on "SchedulePreset"
for select
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "SchedulePreset"."groupId"));

create policy "schedule_preset_write_in_group"
on "SchedulePreset"
for insert
with check (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "SchedulePreset"."groupId"));

create policy "schedule_preset_update_in_group"
on "SchedulePreset"
for update
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "SchedulePreset"."groupId"))
with check (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "SchedulePreset"."groupId"));

create policy "schedule_preset_delete_in_group"
on "SchedulePreset"
for delete
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "SchedulePreset"."groupId"));

-- PET SCHEDULE
alter table "PetSchedule" enable row level security;
create policy "pet_schedule_select_in_group"
on "PetSchedule"
for select
using (
  exists (
    select 1
    from "Pet" p
    join "User" u on u.id = auth.uid()
    where p.id = "PetSchedule"."petId"
      and p."groupId" = u."groupId"
  )
);

create policy "pet_schedule_write_in_group"
on "PetSchedule"
for insert
with check (
  exists (
    select 1
    from "Pet" p
    join "User" u on u.id = auth.uid()
    where p.id = "PetSchedule"."petId"
      and p."groupId" = u."groupId"
  )
);

create policy "pet_schedule_update_in_group"
on "PetSchedule"
for update
using (
  exists (
    select 1
    from "Pet" p
    join "User" u on u.id = auth.uid()
    where p.id = "PetSchedule"."petId"
      and p."groupId" = u."groupId"
  )
)
with check (
  exists (
    select 1
    from "Pet" p
    join "User" u on u.id = auth.uid()
    where p.id = "PetSchedule"."petId"
      and p."groupId" = u."groupId"
  )
);

create policy "pet_schedule_delete_in_group"
on "PetSchedule"
for delete
using (
  exists (
    select 1
    from "Pet" p
    join "User" u on u.id = auth.uid()
    where p.id = "PetSchedule"."petId"
      and p."groupId" = u."groupId"
  )
);

-- PET SCHEDULE COMPLETION HISTORY
alter table "PetScheduleCompletion" enable row level security;
create policy "pet_schedule_completion_select_in_group"
on "PetScheduleCompletion"
for select
using (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "PetScheduleCompletion"."groupId"));

create policy "pet_schedule_completion_write_in_group"
on "PetScheduleCompletion"
for insert
with check (exists (select 1 from "User" u where u.id = auth.uid() and u."groupId" = "PetScheduleCompletion"."groupId"));

