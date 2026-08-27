CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  business_name TEXT NOT NULL DEFAULT '',
  business_type TEXT NOT NULL DEFAULT 'other',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  completed_modules TEXT[] NOT NULL DEFAULT '{}',
  quiz_scores JSONB NOT NULL DEFAULT '{}'::jsonb,
  challenge_days INT[] NOT NULL DEFAULT '{}',
  task_done_on DATE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.progress TO authenticated;
GRANT ALL ON public.progress TO service_role;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own progress" ON public.progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, business_name, business_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data ->> 'business_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'business_type', 'other')
  )
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.progress (user_id) VALUES (NEW.id) ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();