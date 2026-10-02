ALTER TABLE "account_entitlements" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "game_saves" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "account_entitlements" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "account_entitlements"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "account_entitlements" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "account_entitlements" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (false) WITH CHECK (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "account_entitlements" AS PERMISSIVE FOR DELETE TO "authenticated" USING (false);--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-select" ON "game_saves" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select auth.user_id() = "game_saves"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-insert" ON "game_saves" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((select auth.user_id() = "game_saves"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-update" ON "game_saves" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((select auth.user_id() = "game_saves"."user_id")) WITH CHECK ((select auth.user_id() = "game_saves"."user_id"));--> statement-breakpoint
CREATE POLICY "crud-authenticated-policy-delete" ON "game_saves" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((select auth.user_id() = "game_saves"."user_id"));