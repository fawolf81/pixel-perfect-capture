import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Check, LoaderCircle, LockKeyhole } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Redefinir senha — Técnico Brasil" },
    { name: "description", content: "Escolha uma nova senha para sua conta do Técnico Brasil." },
    { property: "og:title", content: "Redefinir senha — Técnico Brasil" },
    { property: "og:description", content: "Recupere com segurança o acesso à sua carreira de técnico." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ResetPassword,
});

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRecovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    void supabase.auth.getSession().then(({ data }) => setReady(isRecovery || Boolean(data.session)));
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8 || password.length > 72) { toast.error("Use uma senha entre 8 e 72 caracteres."); return; }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setDone(true);
  }

  return <main className="auth-shell"><section className="auth-panel auth-confirmation">
    <span className="auth-mark">TB</span>
    {done ? <><div className="auth-success"><Check /></div><p className="auth-kicker">Senha atualizada</p><h1>Tudo pronto</h1><p>Sua nova senha já está valendo.</p><Button className="w-full" onClick={() => navigate({ to: "/" })}>Entrar no jogo</Button></> : <><p className="auth-kicker">Recuperação de acesso</p><h1>Crie uma nova senha</h1><p>{ready ? "Escolha uma senha forte para proteger sua carreira." : "Abra esta página pelo link enviado ao seu e-mail."}</p>{ready && <form onSubmit={submit} className="auth-form"><div className="auth-field"><Label htmlFor="new-password">Nova senha</Label><div className="auth-input-wrap"><LockKeyhole /><Input id="new-password" type="password" minLength={8} maxLength={72} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div></div><Button type="submit" size="lg" className="w-full" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />}Salvar nova senha</Button></form>}</>}
  </section></main>;
}