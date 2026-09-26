// Tempos medidos nas narrações e0..e6 da Maggie (26/09): e0 8,5 s; e1 25,4; e2 23,1; e3 30,4; e4 28,9; e5 25,2; e6 7,4.
// Conteúdo clínico da animação do 2Doctor (explicador de hipertensão para estudantes, em inglês).
// Conferido em 26/09/2026 no texto integral online da ESC 2024 (academic.oup.com, tabelas de recomendação
// lidas como imagem) e da AHA/ACC 2025 (ahajournals.org, idem), e nas bulas FDA (openFDA/DailyMed).
// Detalhes, citações e itens não conferidos: roteiro.md, seção "Conferência".
// Formato idêntico a app-motion/conteudo.js; para renderizar, copiar para app-motion/ ou apontar o index.html para cá.
// Tempos em segundos; cada cartão dura a narração da Iris + 1 s.
window.CONTEUDO = {
  pergunta: 'How do I diagnose and treat hypertension in adults? Include targets and doses.',
  fontesBusca: ['ESC 2024 · Hypertension guidelines', 'AHA/ACC 2025 · High BP guideline', 'FDA labels · DailyMed'],
  // ajustado às narrações e0..e6 (26/09, 2,6 palavras/s): e0 8,1 s; e1 19,6; e2 18,1; e3 20,8; e4 24,2; e5 20,0; e6 6,2
  tempos: { digitar: 5.5, buscar: 3.2, cartoes: [26.4, 24.1, 31.4, 29.9, 26.2], fontes: 8.4 },
  cartoes: [
    { num: 1, titulo: 'Diagnosis', legenda: 'Measure, then confirm', tipo: 'lista', passo: 5.6,
      itens: ['<b>Technique</b>: seated, 5 min rest, back and arm supported, cuff at heart level and the right size · 3 readings 1–2 min apart, <b>average the last 2</b>',
              '<b>Office</b>: hypertension <b>≥ 140/90</b> (ESC) · stage 1 <b>≥ 130/80</b>, stage 2 ≥ 140/90 (ACC/AHA)',
              '<b>Confirm out of office</b> (ESC): home <b>≥ 135/85</b> · 24-h ABPM <b>≥ 130/80</b> · night ≥ 120/70',
              '<b>≥ 180/110</b>: assess for hypertensive emergency first'],
      fonte: 'ESC 2024 · §5.2.2, Table 5, §5.3.2 · ACC/AHA 2025 · Table 4' },
    { num: 2, titulo: 'Two guidelines, two numbers', legenda: 'ESC 2024 vs ACC/AHA 2025', tipo: 'duas', passo: 12.6,
      colunas: [
        { classe: 'ns', titulo: 'ESC 2024', linhas: ['<b>Elevated</b> 120–139/70–89 · <b>hypertension ≥ 140/90</b>',
          'Drugs promptly if <b>≥ 140/90</b> · if elevated and high risk: 3 months of lifestyle, then drugs if ≥ 130/80',
          'Target SBP <b>120–129</b> if tolerated · otherwise as low as reasonably achievable'] },
        { classe: 'st', titulo: 'ACC/AHA 2025', linhas: ['<b>Elevated</b> 120–129/&lt;80 · <b>stage 1</b> 130–139/80–89 · <b>stage 2</b> ≥ 140/90',
          'Drugs if ≥ 140/90, or <b>≥ 130/80</b> with CVD, diabetes, CKD or PREVENT ≥ 7.5% · others after 3–6 months of lifestyle',
          'Goal <b>&lt; 130/80</b>, encourage SBP <b>&lt; 120</b>'] },
      ],
      fonte: 'ESC 2024 · Table 5; Rec. Tables 17 and 18 · ACC/AHA 2025 · §5.2.2 and §5.2.7' },
    { num: 3, titulo: 'First-line drugs · adult doses', legenda: 'Doses', tipo: 'tabela', passo: 4.6,
      cab: ['Class', 'Drug · label starting dose', 'Usual range, mg/day'],
      linhas: [
        { celulas: ['<b>ACE inhibitor</b>', '<b>Ramipril</b> 2.5 mg · <b>Enalapril</b> 5 mg', '2.5–20 · 5–40'] },
        { celulas: ['<b>ARB</b>', '<b>Losartan</b> 50 mg · <b>Valsartan</b> 80–160 mg · <b>Candesartan</b> 16 mg', '50–100 · 80–320 · 8–32'] },
        { celulas: ['<b>DHP calcium channel blocker</b>', '<b>Amlodipine</b> 5 mg (2.5 mg if small, fragile or elderly)', '2.5–10'] },
        { celulas: ['<b>Thiazide-like diuretic</b>', '<b>Chlorthalidone</b> 25 mg · <b>Indapamide</b> 1.25 mg', '12.5–25 · 1.25–2.5'] },
        { celulas: ['<b>Thiazide diuretic</b>', '<b>Hydrochlorothiazide</b> 25 mg', '25–50'] },
      ],
      nota: 'Combine in a single pill: ACE inhibitor or ARB + CCB or diuretic. Never ACE inhibitor + ARB.', notaEm: 17.5,
      fonte: 'Ranges: ACC/AHA 2025 · Table 13 · Starting doses: FDA labels · ESC 2024 · Rec. Table 16' },
    { num: 4, titulo: 'Treatment algorithm', legenda: 'Step by step', tipo: 'lista', passo: 6.6,
      itens: ['<b>Step 1</b> · <b>two drugs</b> at low dose, ideally <b>one pill</b>: ACE inhibitor or ARB + CCB or diuretic',
              '<b>Step 2</b> · <b>three drugs</b>: ACE inhibitor or ARB + CCB + thiazide-like diuretic, single pill if possible',
              '<b>Step 3</b> · check adherence and home BP, then add <b>spironolactone</b> (25–100 mg/day)',
              '<b>Start with one drug</b>: moderate-to-severe frailty, age ≥ 85, symptomatic orthostatic hypotension, elevated BP (ESC) · stage 1 (ACC/AHA, reasonable)'],
      fonte: 'ESC 2024 · Rec. Table 16, §8.3.4 · ACC/AHA 2025 · §5.2.4, §5.6, Table 13' },
    { num: 5, titulo: 'Follow-up and when it gets serious', legenda: 'Follow-up', tipo: 'lista', passo: 6.0,
      itens: ['<b>Review every 1–3 months</b> until controlled, ideally within <b>3 months</b> · then at least yearly',
              '<b>Resistant</b>: uncontrolled on max-tolerated RAS blocker + CCB + diuretic, confirmed out of office → look for secondary causes',
              '<b>Severe</b> &gt; 180/120 without acute organ damage: <b>oral</b> treatment, outpatient',
              '<b>Emergency</b>: very high BP + <b>acute organ damage</b> → ICU, IV therapy · lower SBP by ≤ 25% in the 1st hour'],
      fonte: 'ESC 2024 · §8.4, Rec. Table 19, Table 10, §10.1.1 · ACC/AHA 2025 · §5.6, §6.2' },
  ],
  fontesFinais: ['McEvoy JW et al. 2024 ESC Guidelines for the management of elevated blood pressure and hypertension. Eur Heart J 2024;45:3912–4018',
                 'Jones DW et al. 2025 AHA/ACC/AANP/AAPA/ABC/ACCP/ACPM/AGS/AMA/ASPC/NMA/PCNA/SGIM Guideline for the Prevention, Detection, Evaluation and Management of High Blood Pressure in Adults. Hypertension 2025;82:e212–e316',
                 'US FDA prescribing information (DailyMed): amlodipine, ramipril, enalapril, losartan, valsartan, candesartan, chlorthalidone, indapamide, hydrochlorothiazide, spironolactone'],
  aviso: 'Educational content for medical students. Adult doses; check kidney function, potassium, pregnancy and local protocols. ESC and ACC/AHA differ on definitions and targets.',
};
