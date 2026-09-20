import { afterEach, describe, expect, it, vi } from 'vitest';
const store = new Map<string, string>();
vi.stubGlobal('location', { search: '', pathname: '/vytal-care2/app/' });
vi.stubGlobal('localStorage', { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value), removeItem: (key: string) => store.delete(key) });
const { api, session, BASE_URL } = await import('./api');
afterEach(() => { session.logout(); vi.restoreAllMocks(); });
describe('Care2 conectado ao contrato existente', () => {
  it('envia sessão para assinatura sem expor dados de cartão', async () => {
    session.save('test-session', { name: 'Teste', tipoConta: 'pessoal' });
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ disponivel: true }), { status: 200 }));
    await api('/assinatura/web/config');
    expect(fetcher).toHaveBeenCalledWith(BASE_URL + '/assinatura/web/config', expect.objectContaining({ headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test-session' } }));
    expect(store.has('vytal-care.sessao')).toBe(false);
    expect(store.has('vytal-care2.sessao')).toBe(true);
  });
  it('cadastro usa endpoint pessoal e não envia token', async () => {
    const fetcher = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 200 }));
    await api('/auth/signup-pessoal', { method: 'POST', body: { email: 'test@example.invalid' }, authenticated: false });
    expect(fetcher).toHaveBeenCalledWith(BASE_URL + '/auth/signup-pessoal', expect.objectContaining({ method: 'POST', headers: { 'Content-Type': 'application/json' } }));
  });
  it('expiração encerra sessão e não deixa dados autenticados acessíveis', async () => {
    session.save('expired-test-session', { tipoConta: 'pessoal' });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response('{}', { status: 401 }));
    await expect(api('/my-patients')).rejects.toThrow('Sua sessão expirou');
    expect(session.get()).toBeNull();
  });
  it('erro da assinatura é apresentado sem simular sucesso', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ error: 'Pagamento não aprovado' }), { status: 422 }));
    await expect(api('/assinatura/web', { method: 'POST', body: { cardToken: 'tok_test' } })).rejects.toThrow('Pagamento não aprovado');
  });
});
