import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { AuthScreen } from "@/components/AuthScreen";
import { Button } from "@/components/ui/button";
import { useAuthState } from "@/lib/auth-context";
import { neon } from "@/integrations/neon/client";

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
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void neon.from("account_entitlements").select("plan, premium_until").eq("user_id", user.id).maybeSingle().then(({ data }) => {
      if (!active || data?.plan !== "premium") return;
      if (!data.premium_until || new Date(data.premium_until).getTime() > Date.now()) setPlan("premium");
    });
    return () => { active = false; };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    async function handleGameMessage(event: MessageEvent) {
      if (event.origin !== window.location.origin || event.source !== frameRef.current?.contentWindow) return;
      const message = event.data as { type?: string; requestId?: string; state?: unknown; screen?: string };
      if (!message.requestId || (message.type !== "tecnico-brasil:save" && message.type !== "tecnico-brasil:load")) return;

      let response: { ok: boolean; data?: unknown; error?: string };
      if (message.type === "tecnico-brasil:save") {
        if (!message.state || typeof message.state !== "object") {
          response = { ok: false, error: "Estado de jogo inválido." };
        } else {
          const { error } = await neon.from("game_saves").upsert({
            user_id: user.id,
            state: message.state,
            screen: message.screen || "painel",
            schema_version: 1,
            updated_at: new Date().toISOString(),
          });
          response = error ? { ok: false, error: error.message } : { ok: true };
        }
      } else {
        const { data, error } = await neon.from("game_saves").select("state, screen, schema_version").eq("user_id", user.id).maybeSingle();
        response = error ? { ok: false, error: error.message } : { ok: true, data };
      }

      (event.source as WindowProxy).postMessage({
        type: "tecnico-brasil:persistence-result",
        requestId: message.requestId,
        ...response,
      }, event.origin);
    }

    window.addEventListener("message", handleGameMessage);
    return () => window.removeEventListener("message", handleGameMessage);
  }, [user]);

  if (loading) {
    return <main className="auth-loading"><span className="auth-mark">TB</span><p>Preparando o vestiário…</p></main>;
  }

  if (!user) return <AuthScreen />;

  async function handleSignOut() {
    await neon.auth.signOut();
  }

  return (
    <div className="game-frame-shell">
      <div className="account-strip">
        <span><strong>{plan === "premium" ? "Premium" : "Free"}</strong><span className="account-email">{user.email}</span></span>
        {plan === "free" && <span className="account-limit">Clubes de até 2 estrelas</span>}
        <Button variant="ghost" size="sm" onClick={handleSignOut}>Sair</Button>
      </div>
      <iframe ref={frameRef} src={`/jogo.html?plano=${plan}`} title="Técnico Brasil" className="game-frame" />
    </div>
  );
}
