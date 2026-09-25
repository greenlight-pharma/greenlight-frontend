# 2Doctor Scribe — proposta, 25/09/2026

Status: especificação de produto. Não implementado, não validado para atendimento. Prioridade proposta após abandono completo dos desafios pelo usuário.

## Experiência recomendada

Chat permanece como início. Ação “Documentar atendimento” abre um espaço simples: Relato → Nota → Revisar e copiar. Primeiro ciclo com texto ou ditado curto do profissional APÓS o atendimento. Não iniciar com gravação ambiente de consultas.

1. Profissional relata história, achados e o plano que efetivamente decidiu.
2. Scribe organiza em SOAP ou evolução livre com subtítulos claros, mantendo negações, valores, unidades, cronologia e autoria das informações.
3. Cada trecho pode ser comparado com a transcrição. Informação ausente permanece ausente ou marcada “Não informado”; nunca preencher exame normal, diagnóstico ou prescrição por inferência.
4. Profissional edita e confirma antes de copiar. Rascunho não equivale a registro assinado ou integração com prontuário.
5. A partir da nota confirmada, pode solicitar passagem de caso SBAR, encaminhamento ou orientações em linguagem simples. Estes são documentos distintos do raciocínio clínico sugerido pelo chat.

## Utilidades seguintes (propostas)

- Passagem de plantão: situação, contexto, avaliação e recomendações já informadas; pendências explicitadas, sem envio automático.
- Evidência no contexto: pergunta do profissional gera consulta bibliográfica com fonte verificável e data; não anexar recomendações à nota como se tivessem sido feitas.
- Explicação visual: abrir modelo 3D relevante para ensino, com controle do profissional; sem atribuir diagnóstico à imagem demonstrativa.
- Estudantes: organizar casos fictícios e apresentações orais, com explicação de campos e lacunas. Sem desafios, rankings ou pontuação competitiva.

## Base existente e o que falta

ClinicalCase.jsx já captura MediaRecorder, trata formatos, limita áudio a 3min/2,9MB e permite revisão. server/academic.mjs encaminha transcrição e estruturação a endpoints autenticados Vytal. Isso é uma base de reaproveitamento, não um Scribe clínico pronto. Nenhuma chamada paga, gravação ou alteração de API foi feita nesta rodada.

O endpoint atual de feedback gera hipóteses/condutas e não deve ser reutilizado como gerador fiel de documentação. Implementar contrato separado para fatos documentados, trechos de origem, informações ausentes e edição. Não afirmar processamento local/no Brasil: localização, retenção e fornecedores ainda precisam ser mapeados antes de atendimento real.

## Próximo passo executável

Construir protótipo claramente identificado com relatos fictícios em PT/EN/ES e nota editável. Avaliar com conjunto sintético incluindo negações, medicamentos/doses, unidades, incerteza, correções verbais e dados ausentes. Primeiro validar fluxo móvel e documentação por regras/fixtures; integração gerativa exige avaliação própria, sem mudar a API Vytal nesta trilha.

Critérios antes de habilitar uso clínico: rastreabilidade de cada afirmação ao relato, taxa de omissões/invenções revisada por profissional, fidelidade de negações/doses e erros críticos, revisão por idioma, autorização/consentimento, retenção e controles de acesso definidos, comportamento em falhas e cancelamento, exportação só após revisão. Teste simulado não é validação clínica. Dados clínicos não serão usados para treinamento.

## Referências primárias de produto consultadas

- Heidi, templates de notas e documentos: https://support.heidihealth.com/en/articles/14648446-templates-101-the-basics
- Heidi, ditado: https://support.heidihealth.com/en/articles/11129458-dictate
- Nabla, avaliação de documentação: https://nabla.com/whitepapers/ai-for-clinical-documentation

São descrições dos fornecedores, não prova de desempenho da 2Doctor. Não foram copiados modelos proprietários, comprados serviços ou enviados contatos. A proposta combina documentação revisável, evidências e acervo 3D existente; utilidade e disposição a pagar ainda precisam ser testadas com usuários.
