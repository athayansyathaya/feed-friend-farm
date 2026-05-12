-- Roles enum + table
CREATE TYPE public.app_role AS ENUM ('admin', 'student');

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  nim TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role security definer
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Calculations table
CREATE TABLE public.calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  livestock_id TEXT NOT NULL,
  livestock_name TEXT NOT NULL,

  count INTEGER NOT NULL,
  weight_kg NUMERIC NOT NULL,
  health TEXT NOT NULL,
  total_kg NUMERIC NOT NULL,
  hijauan_kg NUMERIC NOT NULL,
  konsentrat_kg NUMERIC NOT NULL,
  protein_g NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Profiles: own read" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Profiles: admin read all" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Profiles: own insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Profiles: own update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Roles: own read" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Roles: admin read" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Calc: own all" ON public.calculations FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Calc: admin read" ON public.calculations FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Trigger: on signup create profile + assign student role using metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, nim)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Mahasiswa'),
    COALESCE(NEW.raw_user_meta_data->>'nim', NEW.id::text)
  );
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'student');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();