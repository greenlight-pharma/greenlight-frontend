// vytalacademico.com.br: mostra a página do Acadêmico na raiz sem trocar o endereço.
export const config = { matcher: '/' };

export default function middleware(request) {
  const url = new URL(request.url);
  if (url.hostname === 'vytalacademico.com.br' || url.hostname === 'www.vytalacademico.com.br') {
    return new Response(null, {
      headers: { 'x-middleware-rewrite': new URL('/academico/', url).toString() },
    });
  }
}
