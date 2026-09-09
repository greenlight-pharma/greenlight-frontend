// [ICONES] Ícones de traço no lugar dos emoji do menu.
//
// Emoji são coloridos e cada sistema desenha o seu: no painel claro eles
// pareciam adesivos colados sobre a interface, e mudavam de cara entre
// Mac, Windows e Android. Aqui são traços que herdam `currentColor`, então
// o ícone do item ativo fica azul junto com o texto, sem regra extra.
//
// Desenhados à mão, e não importados de uma biblioteca, porque são dez e
// uma dependência de ícones traria centenas — mais bytes que o painel todo.
const CAMINHOS = {
  inicio: "M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5",
  pacientes: "M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20M9.5 10.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M21 20v-1.5a4 4 0 0 0-3-3.87M16.5 3.6a4 4 0 0 1 0 7.75",
  medicoes: "M3 12h3.5l2-5.5 3 11 2.5-7 1.5 3H21",
  agenda: "M7 3v3M17 3v3M3.5 9.5h17M4 6.5h16a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7.5a1 1 0 0 1 1-1Z",
  unidade: "M4 21V6.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1V21M15 11h4a1 1 0 0 1 1 1v9M2.5 21h19M7.5 9.5h4M9.5 7.5v4M8 21v-4h3v4",
  consultas: "M8 3v5a4 4 0 0 0 8 0V3M6 3h2M14 3h2M12 12v3a4 4 0 0 0 8 0v-1M20 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
  assistente: "M20 14.5a2 2 0 0 1-2 2H8l-4 3.5v-14a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z",
  calculadoras: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1ZM8 7h8M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01M8.5 15.5h.01M12 15.5h.01M15.5 15.5h.01",
  plano: "M3 8.5h18M3 7a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 21 7v10a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17ZM6.5 13.5h3",
  senha: "M7 10.5V8a5 5 0 0 1 10 0v2.5M5.5 10.5h13a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-8.5a1 1 0 0 1 1-1Z",
  medicacoes: "M10.5 3.5a5 5 0 0 1 7 7l-7 7a5 5 0 0 1-7-7ZM7 7l7 7",
  lista: "M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01",
  bot: "M12 3v3M7.5 6.5h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2ZM9.5 11.5h.01M14.5 11.5h.01M9.5 15h5",
  qr: "M4 4h6v6H4ZM14 4h6v6h-6ZM4 14h6v6H4ZM14 14h2.5v2.5H14ZM17.5 17.5H20V20h-2.5ZM14 20h.01M20 14h.01",
  lixeira: "M4 6.5h16M9.5 6.5V4.5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v2M6.5 6.5 7.4 20a1 1 0 0 0 1 1h7.2a1 1 0 0 0 1-1l.9-13.5M10 10.5v6.5M14 10.5v6.5",
  ambulancia: "M2.5 16.5V8a1 1 0 0 1 1-1h10v9.5M13.5 10h3.5l3 3.5v3h-2M6.5 16.5h5M7.5 20a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM17 20a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM8 10v3M6.5 11.5h3",
};

export default function Icone({ nome, tamanho = 19 }) {
  const d = CAMINHOS[nome];
  if (!d) return null;
  return (
    <svg
      className="nav-icon"
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {d.split("M").filter(Boolean).map((p, i) => (
        <path key={i} d={`M${p}`} />
      ))}
    </svg>
  );
}
