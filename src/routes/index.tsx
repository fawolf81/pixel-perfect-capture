import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { AuthScreen } from "@/components/AuthScreen";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Técnico Brasil — Jogo de Gerenciamento de Futebol" },
      {
        name: "description",
        content:
          "Assuma um clube brasileiro fictício, monte a escalação, jogue as 38 rodadas da Série A e administre elenco e finanças.",
      },
      { property: "og:title", content: "Técnico Brasil — Gerenciador de Futebol" },
      {
        property: "og:description",
        content:
          "Jogo de gerenciamento de futebol estilo clássico: 20 clubes fictícios, mercado, finanças e partidas narradas lance a lance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { loading, user } = useAuthState();
  const [plan, setPlan] = useState<"free" | "premium">("free");

  useEffect(() => {
    if (!user) return;
    let active = true;
    void supabase.from("account_entitlements").select("plan, premium_until").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (!active || data?.plan !== "premium") return;
      if (!data.premium_until || new Date(data.premium_until).getTime() > Date.now()) setPlan("premium");
    });
    return () => { active = false; };
  }, [user]);

  if (loading) {
    return <main className="auth-loading"><span className="auth-mark">TB</span><p>Preparando o vestiário…</p></main>;
  }

  if (!user) return <AuthScreen />;

  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="game-frame-shell">
      <div className="account-strip">
        <span><strong>{plan === "premium" ? "Premium" : "Free"}</strong><span className="account-email">{user.email}</span></span>
        {plan === "free" && <span className="account-limit">Clubes de até 2 estrelas</span>}
        <Button variant="ghost" size="sm" onClick={handleSignOut}>Sair</Button>
      </div>
      <iframe src={`/jogo.html?plano=${plan}`} title="Técnico Brasil" className="game-frame" />
    </div>
  );
}
