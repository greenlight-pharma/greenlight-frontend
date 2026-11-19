// Política de privacidade do 2Doctor (EN/ES/PT). Fonte única: a página /privacy do servidor e
// a tela do app usam este texto.
// [CONFIRMAR] e-mail de contato: contato@2doctor.ai aparece no regulamento do sorteio (outra
// branch), marcado como "a confirmar". Conferir se a caixa recebe e-mail antes de publicar.
export const CONTACT_EMAIL = 'contato@2doctor.ai';
export const PRIVACY_UPDATED = '2026-11-19';

export const PRIVACY = {
 en: {
  title: 'Privacy policy',
  updated: 'Last updated: November 19, 2026',
  intro: 'This policy explains what 2Doctor (www.2doctor.ai) collects, why, and how you can ask us to delete it. We keep it short on purpose.',
  sections: [
   ['What we collect', [
    'Account: your name, email and password (stored only as a secure hash), or your Google sign-in identifier if you use Google.',
    'Profile and preferences: who you are (health professional, student, or patient or caregiver), language and country.',
    'Content: the conversations, history and clinical cases you save in your account, and cases you choose to share publicly (shared without the original text you wrote).',
    '2Doctor Scribe: the transcript of each consultation you record, the note and the suggestions generated from it, the label and context you type, and its date and duration. We do not keep the audio.',
    'Usage: daily usage counts, used for plan limits and to prevent abuse.',
    'Subscription: plan and payment status received from Stripe.',
   ]],
   ['Why we use it', [
    'Only to run the service: sign you in, save and show your history, generate answers, apply limits, handle your subscription, send account emails (such as email confirmation and password reset) and keep the service secure.',
    'Your messages are sent to the artificial intelligence providers we use, only to generate the answers. We do not sell your data.',
   ]],
   ['Payments', [
    'Payments are processed by Stripe. We never see or store your card number.',
   ]],
   ['Cookies', [
    'We use one essential cookie to keep you signed in.',
    'Marketing cookies from Meta (to measure our ads) are optional and load only if you accept them in the cookie banner. If you decline, they are not loaded.',
   ]],
   ['2Doctor Scribe (consultation transcription)', [
    'When you record a consultation, the audio goes from your browser straight to our speech-to-text provider, Soniox, to be turned into text. 2Doctor does not receive or keep the audio.',
    'The transcript and the context you typed are sent to our artificial intelligence provider, Anthropic, to draft the note and the suggestions. Soniox and Anthropic are based in the United States, so this information may be processed there.',
    'We keep the transcript, the note, the suggestions and the label and context in your account so you can open them again. While a consultation is in progress, a draft is also kept in your browser. You can delete any consultation from the Scribe list at any time.',
    'A consultation contains health information about your patient. Before you record, tell the patient and get their agreement, and follow the privacy and medical-record rules that apply where you practise.',
    'Marketing cookies are not used on the consultation screen, and we do not use consultations for advertising.',
   ]],
   ['Health information', [
    '2Doctor is educational and does not replace a doctor. Do not enter names, ID numbers, addresses or other details that identify you, a patient or another person unless they are really needed.',
    '2Doctor Scribe is different: it is meant for real consultations, and what is said in them is handled as described in the Scribe section above.',
   ]],
   ['How long we keep it and how to delete it', [
    'We keep your data while your account exists.',
    `To delete your account and its data (conversations, cases, Scribe consultations and profile), or to ask what we hold about you, email ${CONTACT_EMAIL} from the email address of your account. We will confirm when it is done. Data we must keep by law, such as payment records, is kept only for the time required.`,
   ]],
   ['Changes and contact', [
    `If this policy changes, we will update the date above. Questions: ${CONTACT_EMAIL}.`,
   ]],
  ],
 },
 es: {
  title: 'Política de privacidad',
  updated: 'Última actualización: 19 de noviembre de 2026',
  intro: 'Esta política explica qué recopila 2Doctor (www.2doctor.ai), para qué y cómo puedes pedir que lo eliminemos. La mantenemos corta a propósito.',
  sections: [
   ['Qué recopilamos', [
    'Cuenta: tu nombre, correo y contraseña (guardada solo como hash seguro), o tu identificador de Google si entras con Google.',
    'Perfil y preferencias: quién eres (profesional de la salud, estudiante, o paciente o cuidador), idioma y país.',
    'Contenido: las conversaciones, el historial y los casos clínicos que guardas en tu cuenta, y los casos que decides compartir públicamente (sin el texto original que escribiste).',
    '2Doctor Scribe: la transcripción de cada consulta que grabas, la nota y las sugerencias generadas a partir de ella, la etiqueta y el contexto que escribes, y su fecha y duración. No guardamos el audio.',
    'Uso: contadores de uso diario, para los límites del plan y para evitar abusos.',
    'Suscripción: plan y estado del pago que recibimos de Stripe.',
   ]],
   ['Para qué lo usamos', [
    'Solo para hacer funcionar el servicio: iniciar tu sesión, guardar y mostrar tu historial, generar respuestas, aplicar límites, gestionar tu suscripción, enviar correos de la cuenta (como confirmación de correo y cambio de contraseña) y mantener el servicio seguro.',
    'Tus mensajes se envían a los proveedores de inteligencia artificial que usamos, solo para generar las respuestas. No vendemos tus datos.',
   ]],
   ['Pagos', [
    'Los pagos los procesa Stripe. Nunca vemos ni guardamos el número de tu tarjeta.',
   ]],
   ['Cookies', [
    'Usamos una cookie esencial para mantener tu sesión iniciada.',
    'Las cookies de marketing de Meta (para medir nuestros anuncios) son opcionales y solo se cargan si las aceptas en el aviso de cookies. Si las rechazas, no se cargan.',
   ]],
   ['2Doctor Scribe (transcripción de consultas)', [
    'Cuando grabas una consulta, el audio va de tu navegador directamente a nuestro proveedor de transcripción de voz, Soniox, para convertirse en texto. 2Doctor no recibe ni guarda el audio.',
    'La transcripción y el contexto que escribiste se envían a nuestro proveedor de inteligencia artificial, Anthropic, para redactar la nota y las sugerencias. Soniox y Anthropic tienen sede en Estados Unidos, por lo que esta información puede procesarse allí.',
    'Guardamos en tu cuenta la transcripción, la nota, las sugerencias, la etiqueta y el contexto, para que puedas abrirlos de nuevo. Mientras una consulta está en curso, también se guarda un borrador en tu navegador. Puedes eliminar cualquier consulta desde la lista del Scribe cuando quieras.',
    'Una consulta contiene información de salud de tu paciente. Antes de grabar, avisa al paciente y obtén su acuerdo, y cumple las normas de privacidad y de historia clínica que se aplican donde ejerces.',
    'Las cookies de marketing no se usan en la pantalla de la consulta, y no usamos las consultas para publicidad.',
   ]],
   ['Información de salud', [
    '2Doctor es educativo y no reemplaza a un médico. No escribas nombres, números de documento, direcciones u otros datos que te identifiquen a ti, a un paciente o a otra persona si no es realmente necesario.',
    '2Doctor Scribe es distinto: está pensado para consultas reales, y lo que se dice en ellas se trata como se describe en la sección del Scribe, arriba.',
   ]],
   ['Cuánto tiempo lo guardamos y cómo eliminarlo', [
    'Guardamos tus datos mientras exista tu cuenta.',
    `Para eliminar tu cuenta y sus datos (conversaciones, casos, consultas del Scribe y perfil), o para saber qué datos tenemos sobre ti, escribe a ${CONTACT_EMAIL} desde el correo de tu cuenta. Te confirmaremos cuando esté hecho. Los datos que la ley nos obliga a conservar, como los registros de pago, se guardan solo el tiempo exigido.`,
   ]],
   ['Cambios y contacto', [
    `Si esta política cambia, actualizaremos la fecha de arriba. Dudas: ${CONTACT_EMAIL}.`,
   ]],
  ],
 },
 'pt-BR': {
  title: 'Política de privacidade',
  updated: 'Última atualização: 19 de novembro de 2026',
  intro: 'Esta política explica o que o 2Doctor (www.2doctor.ai) coleta, para quê e como você pode pedir a exclusão. Ela é curta de propósito.',
  sections: [
   ['O que coletamos', [
    'Conta: seu nome, e-mail e senha (guardada só como hash seguro), ou seu identificador do Google, se você entra com o Google.',
    'Perfil e preferências: quem você é (profissional de saúde, estudante, ou paciente ou cuidador), idioma e país.',
    'Conteúdo: as conversas, o histórico e os casos clínicos que você salva na sua conta, e os casos que você decide compartilhar publicamente (sem o texto original que você escreveu).',
    '2Doctor Scribe: a transcrição de cada consulta que você grava, a nota e as sugestões geradas a partir dela, o rótulo e o contexto que você escreve, e a data e a duração. Não guardamos o áudio.',
    'Uso: contagem de uso diário, para os limites do plano e para evitar abuso.',
    'Assinatura: plano e situação do pagamento que recebemos do Stripe.',
   ]],
   ['Para que usamos', [
    'Só para fazer o serviço funcionar: entrar na sua conta, salvar e mostrar seu histórico, gerar respostas, aplicar limites, cuidar da sua assinatura, enviar e-mails da conta (como confirmação de e-mail e troca de senha) e manter o serviço seguro.',
    'Suas mensagens são enviadas aos fornecedores de inteligência artificial que usamos, só para gerar as respostas. Não vendemos seus dados.',
   ]],
   ['Pagamentos', [
    'Os pagamentos são processados pelo Stripe. Nunca vemos nem guardamos o número do seu cartão.',
   ]],
   ['Cookies', [
    'Usamos um cookie essencial para manter você conectado.',
    'Os cookies de marketing da Meta (para medir nossos anúncios) são opcionais e só carregam se você aceitar no aviso de cookies. Se recusar, eles não são carregados.',
   ]],
   ['2Doctor Scribe (transcrição de consultas)', [
    'Quando você grava uma consulta, o áudio vai do seu navegador direto para o nosso fornecedor de transcrição de voz, a Soniox, para virar texto. O 2Doctor não recebe nem guarda o áudio.',
    'A transcrição e o contexto que você escreveu são enviados ao nosso fornecedor de inteligência artificial, a Anthropic, para redigir a nota e as sugestões. A Soniox e a Anthropic têm sede nos Estados Unidos, então essas informações podem ser processadas lá.',
    'Guardamos na sua conta a transcrição, a nota, as sugestões, o rótulo e o contexto, para você abrir de novo. Enquanto a consulta está em andamento, um rascunho também fica no seu navegador. Você pode excluir qualquer consulta na lista do Scribe quando quiser.',
    'Uma consulta contém informações de saúde do seu paciente. Antes de gravar, avise o paciente e obtenha a concordância dele, e siga as regras de privacidade e de prontuário que valem onde você atende.',
    'Os cookies de marketing não são usados na tela da consulta, e não usamos as consultas para publicidade.',
   ]],
   ['Informações de saúde', [
    'O 2Doctor é educacional e não substitui um médico. Não escreva nomes, números de documento, endereço ou outros dados que identifiquem você, um paciente ou outra pessoa, se não forem realmente necessários.',
    'O 2Doctor Scribe é diferente: ele é feito para consultas reais, e o que é dito nelas é tratado como descrito na seção do Scribe, acima.',
   ]],
   ['Por quanto tempo guardamos e como excluir', [
    'Guardamos seus dados enquanto sua conta existir.',
    `Para excluir sua conta e os dados dela (conversas, casos, consultas do Scribe e perfil), ou para saber quais dados temos sobre você, escreva para ${CONTACT_EMAIL} a partir do e-mail da sua conta. Avisaremos quando estiver feito. Dados que a lei nos obriga a guardar, como registros de pagamento, ficam só pelo tempo exigido.`,
   ]],
   ['Mudanças e contato', [
    `Se esta política mudar, atualizaremos a data acima. Dúvidas: ${CONTACT_EMAIL}.`,
   ]],
  ],
 },
};

// ---------------------------------------------------------------------------------------------
// TERMOS DE USO GERAIS (página /terms) — só em inglês por enquanto.
// [REVISÃO JURÍDICA PENDENTE] Texto redigido pela equipe de produto, NÃO revisado por advogado.
// Antes de publicar/anunciar: revisar com o advogado (razão social e lei aplicável não constam,
// regra de reembolso, limitação de responsabilidade) e confirmar o e-mail de contato.
// ---------------------------------------------------------------------------------------------
export const TERMS_UPDATED = '2026-11-19';
export const TERMS = {
 title: 'Terms of use',
 updated: 'Last updated: November 19, 2026',
 intro: 'These terms apply to everyone who uses 2Doctor (www.2doctor.ai). By creating an account or using the service, you agree to them. We keep them short on purpose.',
 sections: [
  ['Educational tool', [
   '2Doctor is an educational tool for doctors, medical students and other health professionals. It uses artificial intelligence, which can be wrong, incomplete or out of date.',
   'It does not provide medical advice, diagnosis or treatment. It does not replace clinical judgment, local protocols, official sources or a consultation with a qualified professional. Always check the sources and decide for yourself; you are responsible for how you use the content.',
   'In an emergency, call your local emergency number. Do not rely on 2Doctor.',
  ]],
  ['Your account', [
   'You need an account to use the assistant. Give accurate information, keep your password private and do not share your account.',
   'Outside 2Doctor Scribe, do not enter names, ID numbers or other details that identify patients or other people. If you use the patient mode, the Terms for patients also apply.',
  ]],
  ['Acceptable use', [
   'Do not use 2Doctor to break the law, to harm anyone, to try to bypass usage limits or security, to copy the service in bulk, or to resell it without our written permission.',
   'We may limit, suspend or close accounts that break these terms or put the service at risk.',
  ]],
  ['Free plan and Pro subscription', [
   'The free plan has daily usage limits. Pro is a paid subscription, billed monthly or yearly in advance, with higher limits. Prices are shown before you pay; taxes may be added depending on your country.',
   'Payments are processed by Stripe. The subscription renews automatically at the end of each period until you cancel.',
   'You can cancel at any time in the customer portal (My account → Manage subscription). After you cancel, Pro stays active until the end of the period already paid, and you are not charged again.',
   'We do not give partial or pro-rated refunds for periods already paid, except where the law requires it.',
   'If we change the price of your plan, we will tell you in advance and the new price will apply only from your next renewal.',
  ]],
  ['2Doctor Scribe', [
   '2Doctor Scribe is for health professionals to use in their own consultations. It transcribes the conversation and uses artificial intelligence to draft a clinical note and to suggest diagnostic hypotheses and questions to ask.',
   'The transcript, the note and the suggestions can contain errors or omissions. They are drafts: read, correct and complete the note before you use it. The hypotheses are suggestions for your consideration, not a diagnosis. Clinical decisions and what goes into the patient record are your responsibility.',
   'Scribe has not been reviewed or approved by any health regulator, and it is not a medical record system. Copy the final note to your own record; do not rely on 2Doctor as the only copy.',
   'Before each transcription you must tell the patient and get their agreement, and you must follow the laws and professional rules that apply to you, including those on privacy and medical records. How we handle this information is described in the Privacy policy.',
   'Scribe is not offered in the United States. Do not use it there.',
   'Scribe is a separate subscription from Pro. New accounts get free consultations (currently 3); after that Scribe costs US$29 per month, billed monthly in advance. Renewal, cancellation, refunds and price changes follow the same rules as Pro, and fair-use limits apply.',
  ]],
  ['Your content and ours', [
   'The conversations and cases you write remain yours. You allow us to process them to run the service, as described in the Privacy policy.',
   'The 2Doctor name, software and original content belong to us or to our licensors. Third-party materials keep their own licences and attributions.',
  ]],
  ['Availability and liability', [
   'The service is provided "as is". We work to keep it available and accurate, but we do not promise that it will be uninterrupted or free of errors, and features may change.',
   'To the extent the law allows, we are not liable for indirect losses or for decisions made on the basis of content generated by the service. Nothing in these terms limits rights that the law does not allow to be limited.',
  ]],
  ['Changes and contact', [
   'If these terms change, we will update the date above; if the change is important, we will tell you in the app or by email.',
   `Questions: ${CONTACT_EMAIL}.`,
  ]],
 ],
};

export const privacyPolicy = (locale = 'en') => PRIVACY[locale] || PRIVACY.en;
