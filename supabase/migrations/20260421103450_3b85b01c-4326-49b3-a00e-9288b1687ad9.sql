
-- Tabel pengaturan aplikasi
CREATE TABLE IF NOT EXISTS public.app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings: admin read"
ON public.app_settings FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Settings: admin write"
ON public.app_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.app_settings (key, value)
VALUES ('admin_signup_code', 'SMARTFEED-ADMIN-2026')
ON CONFLICT (key) DO NOTHING;

-- Trigger handle_new_user: cek kode admin dari metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _admin_code TEXT;
  _provided_code TEXT;
  _role public.app_role := 'student';
BEGIN
  INSERT INTO public.profiles (id, full_name, nim)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Mahasiswa'),
    COALESCE(NEW.raw_user_meta_data->>'nim', NEW.id::text)
  );

  SELECT value INTO _admin_code FROM public.app_settings WHERE key = 'admin_signup_code';
  _provided_code := NEW.raw_user_meta_data->>'admin_code';

  IF _admin_code IS NOT NULL AND _admin_code <> '' AND _provided_code = _admin_code THEN
    _role := 'admin';
  END IF;

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS: admin boleh kelola roles user lain (tidak boleh diri sendiri)
CREATE POLICY "Roles: admin insert others"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());

CREATE POLICY "Roles: admin update others"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid())
WITH CHECK (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());

CREATE POLICY "Roles: admin delete others"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') AND user_id <> auth.uid());
