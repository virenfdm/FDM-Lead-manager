-- MBA Admission Lead Manager: run this whole file once in Supabase -> SQL Editor.
create extension if not exists pgcrypto;

-- ============ USERS (profiles linked to Supabase Auth) ============
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  role text not null default 'counsellor' check (role in ('admin','counsellor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- First user to sign up becomes admin; everyone after is a counsellor.
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles(id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)),
          case when exists (select 1 from profiles) then 'counsellor' else 'admin' end);
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();

-- ============ HELPER FUNCTIONS ============
create or replace function is_admin() returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select role = 'admin' and active from profiles where id = auth.uid()), false) $$;
create or replace function is_active_user() returns boolean language sql security definer stable set search_path = public as $$
  select coalesce((select active from profiles where id = auth.uid()), false) $$;

-- ============ LEADS ============
create sequence if not exists lead_code_seq start 1001;
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  lead_code text unique not null default ('LD-' || nextval('lead_code_seq')),
  full_name text not null,
  mobile text not null,
  alt_mobile text, email text, city text, state text, lead_source text,
  lead_date date not null default current_date,
  program text, specialization text,
  locations text[] not null default '{}',
  total_budget numeric, annual_fee_budget numeric, preferred_college text,
  hostel text, study_mode text, study_abroad text,
  work_exp_years numeric, edu_gap text,
  lead_status text not null default 'New',
  priority text not null default 'Warm',
  assigned_to uuid references profiles(id) on delete set null,
  last_contact_date date, next_followup timestamptz, remarks text,
  application_status text, offer_status text, admission_status text,
  created_by uuid references profiles(id) default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists leads_mobile_idx on leads(mobile);
create index if not exists leads_assigned_idx on leads(assigned_to);
create index if not exists leads_status_idx on leads(lead_status);

create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists leads_touch on leads;
create trigger leads_touch before update on leads for each row execute function touch_updated_at();

-- ============ ACADEMIC RECORDS (class10 / class12 / graduation) ============
create table if not exists lead_academics (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  level text not null check (level in ('class10','class12','graduation')),
  qualification_type text, board text, stream text, passing_year int,
  result_type text check (result_type in ('Percentage','CGPA')), result_value numeric,
  degree text, other_degree text, institution text, specialization text,
  academic_status text, backlogs text, backlog_count int,
  unique (lead_id, level)
);

-- ============ ENTRANCE EXAMS (many per lead) ============
create table if not exists lead_exams (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  exam_name text not null, exam_year int, status text,
  score numeric, percentile numeric, target_percentile numeric
);
create index if not exists lead_exams_lead_idx on lead_exams(lead_id);

-- ============ FOLLOW-UPS ============
create table if not exists followups (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  due_at timestamptz not null,
  status text not null default 'pending' check (status in ('pending','completed')),
  outcome text, remarks text, completed_at timestamptz,
  created_by uuid references profiles(id) default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists followups_lead_idx on followups(lead_id);
create index if not exists followups_due_idx on followups(due_at);

-- ============ INTERACTION HISTORY ============
create table if not exists interactions (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type text not null check (type in ('Call','WhatsApp','Email','Counselling Session','College Recommendation','Application Update','Note')),
  notes text, occurred_at timestamptz not null default now(),
  created_by uuid references profiles(id) default auth.uid(),
  created_at timestamptz not null default now()
);
create index if not exists interactions_lead_idx on interactions(lead_id);

create or replace function can_access_lead(lid uuid) returns boolean language sql security definer stable set search_path = public as $$
  select is_active_user() and (is_admin() or exists (select 1 from leads where id = lid and assigned_to = auth.uid())) $$;

-- ============ DUPLICATE CHECK HELPERS (detect duplicates across ALL leads without exposing them) ============
create or replace function find_lead_by_mobile(m text, exclude_id uuid default null)
returns table(lead_id uuid, code text, name text, counsellor text) language sql security definer stable set search_path = public as $$
  select l.id, l.lead_code, l.full_name, p.full_name from leads l left join profiles p on p.id = l.assigned_to
  where is_active_user() and right(regexp_replace(l.mobile,'\D','','g'),10) = right(regexp_replace(m,'\D','','g'),10)
    and (exclude_id is null or l.id <> exclude_id) limit 3 $$;
create or replace function existing_mobiles(ms text[]) returns text[] language sql security definer stable set search_path = public as $$
  select case when is_active_user() then coalesce(array_agg(distinct right(regexp_replace(mobile,'\D','','g'),10)), '{}') else '{}' end
  from leads where right(regexp_replace(mobile,'\D','','g'),10) = any(ms) $$;

-- ============ ROW LEVEL SECURITY ============
alter table profiles enable row level security;
alter table leads enable row level security;
alter table lead_academics enable row level security;
alter table lead_exams enable row level security;
alter table followups enable row level security;
alter table interactions enable row level security;

-- profiles: every signed-in user can read names (needed for assignment); only admins change roles.
create policy profiles_read on profiles for select to authenticated using (true);
create policy profiles_admin_update on profiles for update to authenticated using (is_admin()) with check (is_admin());

-- leads: admin = everything. counsellor = only their assigned leads. Delete is admin-only.
create policy leads_select on leads for select to authenticated using (is_active_user() and (is_admin() or assigned_to = auth.uid()));
create policy leads_insert on leads for insert to authenticated with check (is_active_user() and (is_admin() or assigned_to = auth.uid()));
create policy leads_update on leads for update to authenticated using (is_active_user() and (is_admin() or assigned_to = auth.uid())) with check (is_admin() or assigned_to = auth.uid());
create policy leads_delete on leads for delete to authenticated using (is_admin());

-- child tables follow access to the parent lead
create policy acad_all on lead_academics for all to authenticated using (can_access_lead(lead_id)) with check (can_access_lead(lead_id));
create policy exams_all on lead_exams for all to authenticated using (can_access_lead(lead_id)) with check (can_access_lead(lead_id));
create policy fu_all on followups for all to authenticated using (can_access_lead(lead_id)) with check (can_access_lead(lead_id));
create policy inter_all on interactions for all to authenticated using (can_access_lead(lead_id)) with check (can_access_lead(lead_id));
