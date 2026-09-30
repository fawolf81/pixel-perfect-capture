import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <iframe
      src="/jogo.html"
      title="Técnico Brasil"
      className="h-screen w-full border-0"
    />
  );
}
