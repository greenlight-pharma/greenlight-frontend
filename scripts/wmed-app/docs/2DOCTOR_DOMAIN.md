# Domínio 2Doctor

## 25/09/2026 — Domínio 2doctor.ai: preparação, login GoDaddy pendente

Solicitação direta do usuário: configurar domínio liberado via Chrome/GoDaddy e colocar online. Chrome aberto no portfólio redirecionou ao login (aba1509158570, marcada handoff); sessão não estava ativa. Pergunta assíncrona enviada para usuário entrar, sem senha porchat. DNS público atual: NSns09/ns10.domaincontrol.com, apexA3.33.130.190/15.197.148.33, wwwCNAME2doctor.ai. Nenhum registro GoDaddy alterado, nenhum nameserver/email modificado.

Railway custom domain www.2doctor.ai criado no projeto2doctor/serviço2doctor-web, port8080, IDc16c28e4-7a69-4203-b562-d2661337b920. CNAMEwww precisa apontari6c1llix.up.railway.app; TXT_host_railway-verify.www e valor de verificação devem ser recuperados com railway domain status www.2doctor.ai --json (token destinado a DNS público, não credencial). Statusnãoverificado/certificadoaguardandoDNS. Tentativa inicial paraapex com --project sem --environment falhou sem criar apex; corrigida chamada parawww com environmentproduction.

Docs oficiais Railway working-with-domains confirmam GoDaddy sem flattening/apexALIAS. Plano: www canônico + encaminhamento301 GoDaddy de2doctor.ai parahttps://www.2doctor.ai, sem máscara e preservando registros de e-mail. GoDaddy forward-my-godaddy-domain confirma HTTPSautomático paraforwarding. Não resolverCNAMEparaIP efixarA: não suportado como substituto estável. Sem novo provedor/compra.

Servidor atualPUBLIC_ORIGIN=https://2doctor-web-production.up.railway.app validaHost/origem. Ainda NÃO alterado para não derrubar aURLatual antesdeDNS/TLS. Apóslogin: capturarbackupdosregistros; editarwwwCNAME eadicionarTXT; configurar301doapex; confirmarDNSautoritativo/certificadoRailway; definirPUBLIC_ORIGIN=https://www.2doctor.ai no serviço isolado, verificarsubidasaúde/host/origem/login e UI. Considerar redirecionamento estrito daURLlegada para preservar links; não relaxarCORSnemhostglobalmente. Raiz/ járedireciona/2doctor/. CookiesHttpOnlySecureSameSiteStrict sãohost-only, novo domínio exige novo login; não copiarcookies/tokens.

Semdeploy/código/testes/build nestaetapaDNS; inspeçãoRailwayeDNS e servidor concluída. Appprévio permaneceonline. Não testadosnovodomínioHTTPS/login/UIporqueDNSnãoaplicado. Próximo executáveldependeapenasdeusuáriologarnaGoDaddy; não repetirpedidosemnovofato.
