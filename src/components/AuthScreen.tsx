import { useState, type FormEvent } from "react";
import { Check, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";

import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "login" | "signup" | "forgot";

export function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      toast.error("Digite um e-mail válido.");
      return;
    }
    if (mode !== "forgot" && password.length < 8) {
      toast.error("Use uma senha com pelo menos 8 caracteres.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setConfirmationSent(true);
          return;
        }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        toast.success("Enviamos o link para redefinir sua senha.");
        setMode("login");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (error) throw error;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível continuar.";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) toast.error(result.error.message);
    setBusy(false);
  }

  if (confirmationSent) {
    return (
      <main className="auth-shell">
        <section className="auth-panel auth-confirmation">
          <span className="auth-mark">TB</span>
          <div className="auth-success"><Check aria-hidden="true" /></div>
          <p className="auth-kicker">Cadastro recebido</p>
          <h1>Confirme seu e-mail</h1>
          <p>Enviamos um link para <strong>{email.trim()}</strong>. Abra-o para ativar sua conta Free.</p>
          <Button className="w-full" onClick={() => { setConfirmationSent(false); setMode("login"); }}>
            Voltar para entrar
          </Button>
        </section>
      </main>
    );
  }

  const title = mode === "signup" ? "Crie sua conta" : mode === "forgot" ? "Recupere sua senha" : "Entre em campo";
  const intro = mode === "signup"
    ? "Comece grátis com os clubes menores e construa sua história."
    : mode === "forgot"
      ? "Receba um link seguro para escolher uma nova senha."
      : "Sua carreira de técnico continua de onde parou.";

  return (
    <main className="auth-shell">
      <section className="auth-story" aria-label="Técnico Brasil">
        <div className="auth-brand"><span className="auth-mark">TB</span><span>Técnico Brasil</span></div>
        <div>
          <p className="auth-kicker">Sua carreira. Suas decisões.</p>
          <h2>Do banco de reservas ao título nacional.</h2>
          <ul>
            <li><Check aria-hidden="true" /> 20 clubes fictícios e 38 rodadas</li>
            <li><Check aria-hidden="true" /> Escalação, mercado e finanças</li>
            <li><Check aria-hidden="true" /> Conta Free para começar agora</li>
          </ul>
        </div>
        <p className="auth-season">Temporada 2026 · Série A</p>
      </section>

      <section className="auth-panel">
        <div className="auth-mobile-brand"><span className="auth-mark">TB</span><b>Técnico Brasil</b></div>
        <p className="auth-kicker">Área do técnico</p>
        <h1>{title}</h1>
        <p className="auth-intro">{intro}</p>

        {mode !== "forgot" && (
          <div className="auth-tabs" role="tablist" aria-label="Acesso">
            <Button type="button" variant={mode === "login" ? "default" : "ghost"} onClick={() => setMode("login")}>Entrar</Button>
            <Button type="button" variant={mode === "signup" ? "default" : "ghost"} onClick={() => setMode("signup")}>Criar conta</Button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <Label htmlFor="email">E-mail</Label>
            <div className="auth-input-wrap"><Mail aria-hidden="true" /><Input id="email" type="email" autoComplete="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="voce@exemplo.com" required /></div>
          </div>
          {mode !== "forgot" && (
            <div className="auth-field">
              <Label htmlFor="password">Senha</Label>
              <div className="auth-input-wrap"><LockKeyhole aria-hidden="true" /><Input id="password" type={showPassword ? "text" : "password"} autoComplete={mode === "signup" ? "new-password" : "current-password"} minLength={8} maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo de 8 caracteres" required /><Button type="button" variant="ghost" size="icon" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff /> : <Eye />}</Button></div>
            </div>
          )}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy && <LoaderCircle className="animate-spin" />}{mode === "signup" ? "Criar conta Free" : mode === "forgot" ? "Enviar link" : "Entrar"}</Button>
        </form>

        {mode === "login" && <Button type="button" variant="link" className="auth-link" onClick={() => setMode("forgot")}>Esqueci minha senha</Button>}
        {mode !== "forgot" && <><div className="auth-divider"><span>ou</span></div><Button type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogle} disabled={busy}><span className="google-mark">G</span>Continuar com Google</Button></>}
        {mode === "forgot" && <Button type="button" variant="ghost" className="w-full" onClick={() => setMode("login")}>Voltar para entrar</Button>}
        {mode === "signup" && <p className="auth-terms">Ao criar sua conta, você receberá um e-mail para confirmar o acesso.</p>}
      </section>
    </main>
  );
}