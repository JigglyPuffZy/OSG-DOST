-- =============================================================================
-- OSG DOST — UPDATE ADMIN LOGIN
-- Run in Supabase SQL Editor if you already ran SETUP.sql with the old account.
-- Safe to re-run.
-- =============================================================================
-- Login:
--   Email:    admindost@gmail.com
--   Password: Admin123
--   Name:     Mary Ann D. Carpiso
-- =============================================================================

create extension if not exists "pgcrypto";

do $$
declare
  v_user_id uuid;
  v_old_id uuid;
  v_email text := 'admindost@gmail.com';
  v_password text := 'Admin123';
  v_display_name text := 'Mary Ann D. Carpiso';
begin
  if to_regclass('public.profiles') is null then
    raise exception 'Run SETUP.sql first.';
  end if;

  select id into v_old_id from auth.users where email = 'officer@osgdost.gov.ph';
  if v_old_id is not null then
    delete from auth.identities where user_id = v_old_id;
    delete from auth.users where id = v_old_id;
  end if;

  select id into v_user_id from auth.users where email = v_email;

  if v_user_id is null then
    v_user_id := gen_random_uuid();

    insert into auth.users (
      id, instance_id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      created_at, updated_at, confirmation_token, email_change,
      email_change_token_new, recovery_token
    ) values (
      v_user_id, '00000000-0000-0000-0000-000000000000',
      'authenticated', 'authenticated', v_email,
      crypt(v_password, gen_salt('bf')), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"display_name":"Mary Ann D. Carpiso","role":"Supervising Science Research Specialist"}'::jsonb,
      now(), now(), '', '', '', ''
    );

    begin
      insert into auth.identities (
        id, user_id, provider_id, identity_data, provider,
        last_sign_in_at, created_at, updated_at
      ) values (
        v_user_id, v_user_id, v_email,
        jsonb_build_object('sub', v_user_id::text, 'email', v_email, 'email_verified', true),
        'email', now(), now(), now()
      );
    exception when others then
      insert into auth.identities (provider_id, user_id, identity_data, provider)
      values (v_user_id::text, v_user_id,
        jsonb_build_object('sub', v_user_id::text, 'email', v_email), 'email');
    end;
  else
    update auth.users
    set
      encrypted_password = crypt(v_password, gen_salt('bf')),
      raw_user_meta_data = '{"display_name":"Mary Ann D. Carpiso","role":"Supervising Science Research Specialist"}'::jsonb,
      updated_at = now()
    where id = v_user_id;
  end if;

  update public.profiles
  set
    user_id = v_user_id,
    display_name = v_display_name,
    role = 'Supervising Science Research Specialist',
    organization = 'OSG DOST Task Force'
  where id = (select id from public.profiles order by created_at limit 1);

  raise notice 'LOGIN READY — % / Admin123 / %', v_email, v_display_name;
end $$;

select u.email, p.display_name, p.role
from auth.users u
left join public.profiles p on p.user_id = u.id
where u.email = 'admindost@gmail.com';
