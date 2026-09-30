# Plano: contas Free e Premium

## O que será criado agora
- Tela moderna de entrada e cadastro, alinhada ao visual Campo Noturno do jogo.
- Cadastro por e-mail e senha com confirmação obrigatória enviada ao e-mail.
- Entrada com e-mail/senha e Google, recuperação de senha e saída segura.
- Acesso ao jogo somente após entrar; toda conta nova começa no plano Free.
- No Free, apenas clubes de porte 1 e 2 poderão ser escolhidos; clubes maiores aparecerão bloqueados como Premium.
- Avisos claros de confirmação pendente, senha inválida e recuperação concluída.

## Premium e ligas
- Preparar a interface para diferenciar Free e Premium sem liberar acesso pago indevidamente.
- Premium poderá liberar todos os clubes e a seleção de outras ligas.
- A cobrança será conectada em uma segunda etapa, após definir preço, periodicidade e quais ligas entram no lançamento.
- Para cobrança, a opção indicada é Paddle, que simplifica impostos e assinaturas globais; jogos podem passar por análise adicional e a aprovação não é garantida.

## Fluxo
```text
Cadastro → confirmação por e-mail → login → conta Free → clubes menores
                                      └→ futuro upgrade Premium → todos os clubes e ligas
```

## Detalhes técnicos
- Usar Lovable Cloud para autenticação e confirmação de e-mail.
- Manter o jogo atual e seu salvamento local, envolvendo-o com a nova área autenticada.
- Criar páginas públicas para entrar, cadastrar e redefinir senha.
- Manter o estado de sessão atualizado e limpar dados protegidos ao sair.
- Validar e-mail, senha e redirecionamentos antes de enviar qualquer dado.
- Validar o fluxo em computador e celular, incluindo confirmação pendente e bloqueio dos clubes Premium.
