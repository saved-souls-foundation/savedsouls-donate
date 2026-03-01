-- Fix: infinite recursion in RLS policies on profiles
-- De admin-policies lazen zelf uit profiles, wat RLS weer aanroept → recursie.
-- Oplossing: SECURITY DEFINER functie die de admin-check doet (bypass RLS).

-- 1. Functie: is de huidige gebruiker admin? (leest profiles zonder RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND (role = 'admin' OR is_admin = true)
  );
$$;

-- 2. Verwijder de oude admin-policies (die SELECT op profiles deden)
DROP POLICY IF EXISTS "Admin leest alle profielen" ON profiles;
DROP POLICY IF EXISTS "Admin updatet alle profielen" ON profiles;

-- 3. Nieuwe admin-policies: gebruiken is_admin() in plaats van SELECT op profiles
CREATE POLICY "Admin leest alle profielen"
ON profiles FOR SELECT
USING (public.is_admin());

CREATE POLICY "Admin updatet alle profielen"
ON profiles FOR UPDATE
USING (public.is_admin());
