CREATE TABLE public.account_entitlements (
  user_id UUID PRIMARY KEY,
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium')),
  premium_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.account_entitlements TO authenticated;
GRANT ALL ON public.account_entitlements TO service_role;

ALTER TABLE public.account_entitlements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own entitlement"
ON public.account_entitlements
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

COMMENT ON TABLE public.account_entitlements IS 'Server-managed account plan entitlements; missing rows default to Free in the app.';