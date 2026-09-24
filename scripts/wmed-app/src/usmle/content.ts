// WMed USMLE Review — original high-yield summaries and flashcards in English.
// Same shape as the ENAMED pack (src/enamed/content.ts) so both share the study screen.
//
// PROVENANCE: first draft written for WMed with AI assistance (Claude) on 2026-09-24.
// It has NOT been clinically or editorially reviewed yet. Review every topic against
// current references (e.g., ACC/AHA, GINA, GOLD, ADA, IDSA, CDC) before a wide release.
// USMLE® is a joint program of the FSMB and NBME. WMed is not affiliated with or endorsed by them.

export interface StudyTopic { t: string; r: string }
export interface StudyArea { id: string; nome: string; step: string; temas: StudyTopic[] }
export interface StudyCard { q: string; a: string; ti: number; ci: number }

const AREAS: StudyArea[] = [
 { id: 'cardio', nome: 'Cardiology', step: 'Step 1 · Step 2 CK', temas: [
  { t: 'Heart failure', r: `**Classification by LVEF.** HFrEF ≤40%; HF with mildly reduced EF 41–49%; HFpEF ≥50%.

**Diagnosis.** Clinical picture + echocardiogram + natriuretic peptides (BNP/NT-proBNP). Most common cause: **ischemic heart disease**.

**HFrEF therapy that lowers mortality ("4 pillars"):**
- **ACE inhibitor/ARB or ARNI** (sacubitril-valsartan)
- **Beta-blocker** (carvedilol, metoprolol succinate, bisoprolol)
- **Mineralocorticoid antagonist** (spironolactone, eplerenone)
- **SGLT2 inhibitor** (dapagliflozin, empagliflozin)

**Loop diuretics** relieve congestion (symptoms only). **Hydralazine + isosorbide dinitrate** adds benefit in self-identified Black patients with persistent symptoms.

**NYHA I–IV** grades symptoms by exertion: I none; II ordinary activity; III less than ordinary activity; IV at rest.

**Exam trap.** Diuretics do not reduce mortality. Never combine ARNI with an ACE inhibitor (angioedema): stop the ACE inhibitor **36 h** before starting ARNI. Start beta-blockers when the patient is **euvolemic**, not during acute decompensation.` },
  { t: 'Acute coronary syndromes', r: `**Spectrum.** Unstable angina (no troponin rise) → NSTEMI (troponin rise, no ST elevation) → STEMI (ST elevation or new LBBB with ischemic symptoms).

**ECG localization:**
- **II, III, aVF** → inferior → usually **RCA**
- **V1–V4** → anterior/septal → **LAD**
- **I, aVL, V5–V6** → lateral → **left circumflex**

**Reperfusion in STEMI.** Primary PCI (door-to-balloon ≤90 min; ≤120 min if transfer). If PCI is not available in time: fibrinolysis within **30 min** of arrival.

**Acute therapy.** Aspirin + P2Y12 inhibitor, anticoagulation, high-intensity statin, beta-blocker (if no shock or HF), nitrates for pain.

**Complications by time:** 0–24 h arrhythmias (VF); 1–3 days fibrinous pericarditis; **3–14 days** papillary muscle rupture, interventricular septal rupture, **free wall rupture** (tamponade); weeks later Dressler syndrome, ventricular aneurysm.

**Exam trap.** Avoid nitrates in **right ventricular infarction** (preload dependent → give fluids) and after PDE-5 inhibitors. Avoid beta-blockers in **cocaine**-associated chest pain acutely (use benzodiazepines).` },
  { t: 'Heart murmurs', r: `**Systolic:**
- **Aortic stenosis** — crescendo-decrescendo at the right upper sternal border, radiating to the carotids; pulsus parvus et tardus. Symptoms: **syncope, angina, dyspnea**.
- **Mitral regurgitation** — holosystolic at the apex, radiating to the axilla.
- **Mitral valve prolapse** — midsystolic **click**; later with squatting, earlier with Valsalva/standing.
- **VSD** — harsh holosystolic at the left lower sternal border.
- **Hypertrophic cardiomyopathy** — crescendo-decrescendo; **louder with Valsalva/standing** (less preload), softer with squatting and handgrip.

**Diastolic:**
- **Aortic regurgitation** — early decrescendo at the left sternal border; wide pulse pressure, bounding pulses.
- **Mitral stenosis** — opening snap + mid-diastolic rumble; linked to **rheumatic fever**.

**Maneuvers.** Most murmurs get louder with ↑ preload (squatting, leg raise). HCM and MVP behave the opposite way. Handgrip (↑ afterload) increases MR/AR/VSD and decreases AS and HCM.

**Exam trap.** Sudden death in a young athlete with a murmur that increases on standing → **HCM**.` }
 ]},
 { id: 'pulm', nome: 'Pulmonology', step: 'Step 1 · Step 2 CK', temas: [
  { t: 'Asthma vs COPD', r: `**Both obstructive:** FEV1/FVC < 0.70.

**Asthma.** Variable, reversible obstruction; triggers; eosinophilic inflammation. **DLCO normal or ↑.**
- Preferred reliever/controller in adults (GINA): **as-needed low-dose ICS-formoterol**; step up with maintenance ICS-formoterol.
- SABA-only treatment is not recommended.

**COPD.** Persistent obstruction after bronchodilator; smoking; chronic bronchitis or emphysema. **DLCO ↓ in emphysema.**
- Maintenance: **LAMA and/or LABA**; add ICS if frequent exacerbations and high eosinophils.
- Interventions that improve **survival**: **smoking cessation** and **long-term oxygen** when PaO2 ≤55 mmHg or SpO2 ≤88% (≤59 mmHg/≤89% with cor pulmonale or polycythemia).

**Exacerbation (COPD):** bronchodilators, systemic steroids, antibiotics if purulent sputum; NIV for hypercapnic acidosis.

**Exam trap.** Young nonsmoker with emphysema at the **lung bases** or liver disease → **alpha-1 antitrypsin deficiency**.` },
  { t: 'Pulmonary embolism', r: `**Presentation.** Sudden dyspnea, pleuritic pain, tachycardia; risk factors (immobility, surgery, cancer, pregnancy, estrogen, thrombophilia).

**Workup:**
- Estimate pretest probability (**Wells**).
- Low/intermediate → **D-dimer**; negative rules out.
- High probability or positive D-dimer → **CT pulmonary angiography**. V/Q scan if contrast is contraindicated.

**Findings.** ECG: most often **sinus tachycardia** (S1Q3T3 is specific, uncommon). ABG: hypoxemia, **respiratory alkalosis**, ↑ A-a gradient.

**Treatment.** Anticoagulation (DOAC for most; LMWH in cancer or pregnancy). **Hypotension (massive PE)** → systemic thrombolysis if no contraindication. Contraindication to anticoagulation → IVC filter.

**Exam trap.** Do not wait for imaging to start anticoagulation when suspicion is high and bleeding risk is low. Warfarin in pregnancy is contraindicated (teratogenic).` },
  { t: 'Community-acquired pneumonia', r: `**Most common cause:** *Streptococcus pneumoniae*.

**Clues by pathogen:**
- **Mycoplasma** — young adults, dry cough, cold agglutinins.
- **Legionella** — water sources, **hyponatremia**, diarrhea, high fever.
- **Klebsiella** — alcohol use, "currant jelly" sputum, upper lobe.
- **S. aureus** — after influenza, cavitation.
- **Aspiration/anaerobes** — altered consciousness, right lower lobe.

**Severity.** CURB-65 (Confusion, Urea, Respiratory rate ≥30, BP <90/≤60, age ≥65) guides outpatient vs inpatient care.

**Empiric therapy (adults, US-style):**
- Healthy outpatient: amoxicillin or doxycycline (macrolide only if local resistance is low).
- Outpatient with comorbidities: amoxicillin-clavulanate or cephalosporin + macrolide/doxycycline, or a respiratory fluoroquinolone.
- Inpatient, non-ICU: beta-lactam + macrolide, or a respiratory fluoroquinolone.

**Exam trap.** Failure to improve on beta-lactam alone in a young patient → think **atypical** organisms (no cell wall).` }
 ]},
 { id: 'renal', nome: 'Renal & acid–base', step: 'Step 1 · Step 2 CK', temas: [
  { t: 'Acid–base in 4 steps', r: `**1. pH** — acidemia (<7.35) or alkalemia (>7.45).
**2. Primary process** — metabolic (HCO3) or respiratory (PaCO2).
**3. Compensation** — metabolic acidosis: **Winter's formula** expected PaCO2 = 1.5 × HCO3 + 8 ± 2. Outside the range → mixed disorder.
**4. Anion gap** — Na − (Cl + HCO3), normal about 12.

**High anion gap metabolic acidosis (GOLDMARK):** Glycols (ethylene/propylene), Oxoproline (acetaminophen), L-lactate, D-lactate, Methanol, Aspirin, Renal failure, Ketoacidosis.

**Normal anion gap:** diarrhea, renal tubular acidosis, large-volume saline, acetazolamide.

**Metabolic alkalosis.** Urine Cl <20 → saline-responsive (vomiting, prior diuretics). Urine Cl >20 → hyperaldosteronism, current diuretics, Bartter/Gitelman.

**Exam trap.** Salicylate poisoning early: **respiratory alkalosis + high anion gap metabolic acidosis** at the same time.` },
  { t: 'Sodium disorders', r: `**Hyponatremia** — check serum osmolality, then volume status.
- **SIADH:** euvolemic, urine osmolality >100, urine Na >40; causes: small cell lung cancer, CNS disease, drugs (SSRIs, carbamazepine), pain, nausea. Treat with fluid restriction; hypertonic saline if severe symptoms.
- Hypovolemic: vomiting, diarrhea, diuretics (thiazides). Hypervolemic: HF, cirrhosis, nephrotic syndrome.

**Correction speed.** Raise Na by no more than **8–10 mEq/L in 24 h** → avoid **osmotic demyelination** (dysarthria, dysphagia, quadriparesis).

**Hypernatremia.** Usually water loss with no access to water. Lower Na slowly (cerebral edema risk with fast correction).

**Diabetes insipidus.** Dilute urine despite water deprivation. Desmopressin concentrates urine in **central** DI, not in **nephrogenic** DI (lithium, hypercalcemia).

**Exam trap.** Hyponatremia with high serum osmolality → **hyperglycemia** (pseudohyponatremia pattern); correct Na for glucose.` },
  { t: 'Nephritic vs nephrotic syndrome', r: `**Nephrotic:** proteinuria >3.5 g/day, hypoalbuminemia, edema, hyperlipidemia, hypercoagulability (renal vein thrombosis).
- **Minimal change** — children; responds to steroids; effacement on electron microscopy.
- **Membranous** — adults; **anti-PLA2R** antibodies; associated with solid tumors, hepatitis B, lupus, NSAIDs.
- **FSGS** — HIV, heroin, obesity, sickle cell; APOL1 risk.
- **Diabetic nephropathy** — most common cause in adults overall.

**Nephritic:** hematuria with **RBC casts**, hypertension, oliguria, modest proteinuria.
- **Post-streptococcal** — 2–3 weeks after pharyngitis (3–6 weeks after skin infection); **low C3**.
- **IgA nephropathy** — hematuria **1–3 days** after an upper respiratory infection; normal complement.
- **Rapidly progressive GN** — crescents; anti-GBM (Goodpasture), pauci-immune (ANCA), immune complex.

**Exam trap.** Timing separates post-strep GN (weeks) from IgA nephropathy (days).` }
 ]},
 { id: 'endo', nome: 'Endocrinology', step: 'Step 1 · Step 2 CK', temas: [
  { t: 'Diabetes, DKA and HHS', r: `**Diagnosis of diabetes** (repeat to confirm unless unequivocal): HbA1c ≥6.5%, fasting glucose ≥126 mg/dL, 2-h OGTT ≥200, or random glucose ≥200 with classic symptoms.

**DKA** (mostly type 1): hyperglycemia, **ketones**, anion gap metabolic acidosis (pH <7.3, HCO3 <18), Kussmaul breathing, abdominal pain.
**HHS** (type 2, older): glucose often >600, osmolality >320, little or no ketosis, marked dehydration and altered mental status.

**Treatment sequence:**
1. **IV fluids** (isotonic first).
2. **Potassium:** if K <3.3 mEq/L, replace K **before** insulin.
3. **IV insulin** infusion.
4. Add **dextrose** when glucose falls to about 200–250 while acidosis persists.
5. Close the anion gap, then overlap subcutaneous insulin before stopping the drip.

**Exam trap.** Total body potassium is low in DKA even when serum K is normal or high (insulin shifts K into cells).` },
  { t: 'Thyroid disease', r: `**Hyperthyroidism:**
- **Graves** — TSH receptor antibodies, diffuse ↑ uptake, exophthalmos, pretibial myxedema.
- **Toxic nodule / multinodular goiter** — focal or patchy uptake.
- **Thyroiditis** (subacute, painless, postpartum) — **low uptake**; treat symptoms (beta-blocker).
- Treatment: beta-blocker for symptoms, methimazole, radioiodine or surgery. **PTU in the first trimester** and in thyroid storm.

**Thyroid storm:** beta-blocker, **thionamide first**, then iodine (≥1 h later), glucocorticoids, supportive care.

**Hypothyroidism:** **Hashimoto** (anti-TPO) is the most common cause in iodine-sufficient areas. Treat with levothyroxine; start low in older patients or coronary disease.

**Thyroid nodule:** check TSH. Low TSH → uptake scan (hot nodules rarely malignant). Normal/high TSH → ultrasound ± FNA.

**Exam trap.** High uptake vs low uptake is the key split: low uptake means the gland is not overproducing (thyroiditis or exogenous hormone — low thyroglobulin in exogenous use).` },
  { t: 'Adrenal disorders', r: `**Cushing syndrome.** Screen with 24-h urinary free cortisol, late-night salivary cortisol, or 1-mg overnight dexamethasone suppression.
- Then **ACTH**: low → adrenal source (CT adrenals); high → pituitary (Cushing disease) vs ectopic (small cell lung cancer). High-dose dexamethasone suppresses pituitary, not ectopic; inferior petrosal sinus sampling if unclear.
- Most common overall cause: **exogenous glucocorticoids**.

**Adrenal insufficiency.** Primary (Addison, autoimmune most common): hyperpigmentation, **hyponatremia, hyperkalemia**, hypotension. Secondary (low ACTH): no hyperpigmentation, potassium usually normal.
- **Adrenal crisis:** give **IV hydrocortisone immediately** plus fluids; do not delay for testing.

**Primary hyperaldosteronism:** hypertension + hypokalemia + metabolic alkalosis; screen with aldosterone/renin ratio.

**Pheochromocytoma:** episodic headache, sweating, tachycardia; plasma free metanephrines. **Alpha-blockade before beta-blockade** preoperatively.

**Exam trap.** Starting a beta-blocker first in pheochromocytoma causes unopposed alpha stimulation and hypertensive crisis.` }
 ]},
 { id: 'heme', nome: 'Hematology & oncology', step: 'Step 1 · Step 2 CK', temas: [
  { t: 'Microcytic anemias', r: `**Iron deficiency** — ↓ ferritin, ↑ TIBC, ↓ transferrin saturation, ↑ RDW. In older adults and men, look for **GI blood loss** (colonoscopy/endoscopy).

**Anemia of chronic disease** — **normal/↑ ferritin**, ↓ TIBC; hepcidin traps iron in macrophages.

**Thalassemia** — normal iron studies, target cells, microcytosis out of proportion to anemia; **Mentzer index** (MCV/RBC) <13. Beta-thalassemia trait: ↑ HbA2 on electrophoresis.

**Sideroblastic anemia** — ringed sideroblasts; causes: alcohol, **lead**, isoniazid (B6 deficiency), copper deficiency. Iron ↑.

**Lead poisoning** — basophilic stippling, abdominal pain, neuropathy (wrist drop); children with pica/old paint.

**Exam trap.** Ferritin is an acute phase reactant: a "normal" ferritin in an inflamed patient does not exclude iron deficiency.` },
  { t: 'Macrocytic and hemolytic anemias', r: `**Megaloblastic (hypersegmented neutrophils):**
- **B12 deficiency** — ↑ methylmalonic acid **and** ↑ homocysteine; **neurologic** signs (subacute combined degeneration). Causes: pernicious anemia, gastrectomy, ileal disease, metformin, vegan diet.
- **Folate deficiency** — ↑ homocysteine only; no neurologic deficit. Causes: alcohol, pregnancy, methotrexate, poor diet.

**Hemolysis labs:** ↑ LDH, ↑ indirect bilirubin, ↓ haptoglobin, ↑ reticulocytes.
- **Hereditary spherocytosis** — spherocytes, ↑ MCHC, splenomegaly, **DAT negative**, EMA binding test.
- **Warm autoimmune hemolysis** — IgG, **DAT positive**, spherocytes; lupus, CLL, drugs.
- **G6PD deficiency** — bite cells and Heinz bodies after oxidant stress (sulfa, primaquine, fava beans, infection).
- **Microangiopathic** (TTP, HUS, DIC) — **schistocytes**.

**Exam trap.** Giving folate alone in B12 deficiency can correct the anemia while the neurologic damage progresses.` },
  { t: 'Bleeding and platelet disorders', r: `**Tests:** PT/INR (extrinsic; warfarin, liver disease, vitamin K), aPTT (intrinsic; heparin, hemophilia), platelet count.

**Hemophilia A/B** — factor VIII/IX; joint and muscle bleeds; isolated ↑ aPTT; X-linked.
**von Willebrand disease** — most common inherited bleeding disorder; mucosal bleeding; ↑ bleeding time, aPTT may be ↑. Desmopressin for type 1.

**Heparin-induced thrombocytopenia (HIT)** — platelet fall >50% **5–10 days** after heparin, with **thrombosis**. Stop all heparin; start a non-heparin anticoagulant (argatroban, fondaparinux, DOAC).

**TTP** — ↓ ADAMTS13; microangiopathic hemolysis + thrombocytopenia ± fever, neuro and renal signs. **Urgent plasma exchange**; avoid platelet transfusion.

**ITP** — isolated thrombocytopenia, diagnosis of exclusion; steroids/IVIG if bleeding or very low count.

**DIC** — ↑ PT, ↑ aPTT, ↓ fibrinogen, ↑ D-dimer; treat the cause.

**Exam trap.** Low platelets while on heparin with a new clot: the answer is to stop heparin, not to transfuse platelets.` }
 ]},
 { id: 'id', nome: 'Infectious disease', step: 'Step 1 · Step 2 CK', temas: [
  { t: 'Bacterial meningitis', r: `**Most likely organisms by age:**
- Neonates: **group B Streptococcus**, *E. coli*, *Listeria*.
- 1 month–50 years: *S. pneumoniae*, *N. meningitidis*.
- >50 years or immunocompromised: *S. pneumoniae*, *N. meningitidis*, **Listeria**.

**CSF in bacterial meningitis:** ↑ neutrophils, **↓ glucose**, ↑ protein, ↑ opening pressure. Viral: lymphocytes, normal glucose.

**Empiric treatment (adults):** **vancomycin + ceftriaxone**; add **ampicillin** if >50 or immunocompromised (Listeria). **Dexamethasone** before or with the first antibiotic dose (benefit in pneumococcal disease).

**CT before lumbar puncture** if focal deficit, papilledema, new seizure, immunocompromise or reduced consciousness — but **do not delay antibiotics**: draw blood cultures and treat first.

**Close contacts of meningococcal disease:** prophylaxis with rifampin, ciprofloxacin or ceftriaxone.

**Exam trap.** Waiting for the CT or LP before giving antibiotics is the wrong answer.` },
  { t: 'HIV essentials', r: `**Screening/diagnosis:** 4th-generation HIV-1/2 antigen/antibody test, then differentiation assay; HIV RNA if acute infection is suspected.

**Treatment:** antiretroviral therapy for **everyone** with HIV, started as soon as possible.

**Opportunistic infection prophylaxis by CD4:**
- **<200/mm³** → *Pneumocystis* (TMP-SMX).
- **<100/mm³ with positive Toxoplasma IgG** → Toxoplasma (TMP-SMX covers both).
- MAC prophylaxis is not recommended when ART is started right away.

**Classic infections:** *Pneumocystis* pneumonia (bilateral interstitial infiltrates, ↑ LDH; add steroids if PaO2 <70); **toxoplasmosis** (multiple ring-enhancing lesions); **cryptococcal meningitis** (India ink, antigen; high opening pressure); **CMV retinitis** (CD4 <50).

**Pregnancy:** ART during pregnancy and infant prophylaxis drastically reduce vertical transmission.

**Exam trap.** A single ring-enhancing lesion that does not improve on toxoplasmosis treatment → consider **CNS lymphoma** (EBV).` },
  { t: 'Sexually transmitted infections', r: `**Syphilis:**
- Primary: **painless chancre**. Secondary: rash on palms and soles, condylomata lata. Tertiary: gummas, aortitis, neurosyphilis (tabes dorsalis, Argyll Robertson pupil).
- Tests: nontreponemal (RPR/VDRL, follow titers) + treponemal (FTA-ABS, persists for life).
- Treatment: **benzathine penicillin G** IM; neurosyphilis → IV penicillin G. Pregnant with penicillin allergy → **desensitize**.

**Gonorrhea:** **ceftriaxone 500 mg IM** (1 g if ≥150 kg). Treat chlamydia too unless excluded.
**Chlamydia:** **doxycycline 7 days**; azithromycin in pregnancy.

**Pelvic inflammatory disease:** cervical motion, uterine or adnexal tenderness is enough to start treatment (ceftriaxone + doxycycline + metronidazole).

**Painful genital ulcers:** herpes (grouped vesicles) and chancroid (*H. ducreyi*, suppurative nodes). **Painless:** syphilis, lymphogranuloma venereum (painful nodes later).

**Exam trap.** Fever, headache and myalgia hours after penicillin for syphilis → **Jarisch-Herxheimer reaction**, not allergy.` }
 ]},
 { id: 'pharm', nome: 'Pharmacology & toxicology', step: 'Step 1', temas: [
  { t: 'Autonomic drugs', r: `**Receptors:** α1 (vasoconstriction), α2 (↓ sympathetic outflow), β1 (↑ HR and contractility), β2 (bronchodilation, vasodilation), M (parasympathetic effects).

**Pressors:**
- **Epinephrine** — α1, β1, β2; anaphylaxis (IM), cardiac arrest.
- **Norepinephrine** — α1 > β1; first-line in septic shock.
- **Phenylephrine** — pure α1; reflex bradycardia.
- **Dopamine** — dose-dependent D1 → β1 → α1.
- **Dobutamine** — β1 > β2; inotrope for cardiogenic shock.
- **Isoproterenol** — β1 = β2.

**Cholinergic toxicity (organophosphates):** DUMBBELSS — diarrhea, urination, miosis, bronchorrhea/bronchospasm, bradycardia, emesis, lacrimation, salivation/sweating. Treat: **atropine** (muscarinic) + **pralidoxime** (regenerates acetylcholinesterase, before aging).

**Anticholinergic toxicity:** hot as a hare, dry as a bone, red as a beet, blind as a bat, mad as a hatter; **physostigmine** crosses the BBB.

**Exam trap.** Sweating separates cholinergic/sympathomimetic toxicity (wet) from anticholinergic toxicity (dry skin).` },
  { t: 'Cytochrome P450 interactions', r: `**Inducers** (↓ levels of other drugs): **rifampin**, carbamazepine, phenytoin, phenobarbital, St John's wort, griseofulvin, chronic alcohol use.

**Inhibitors** (↑ levels of other drugs): **macrolides** (clarithromycin, erythromycin — not azithromycin), **azole antifungals**, ritonavir and other protease inhibitors, **grapefruit juice**, amiodarone, cimetidine, isoniazid, acute alcohol.

**High-yield consequences:**
- Warfarin + inhibitor → ↑ INR and bleeding; + inducer → clot risk.
- Oral contraceptives + rifampin → contraceptive failure.
- Statin (simvastatin) + clarithromycin or azole → myopathy/rhabdomyolysis.
- Tacrolimus/cyclosporine + azole → nephrotoxicity.

**Narrow therapeutic index drugs** to watch: warfarin, digoxin, lithium, phenytoin, theophylline, aminoglycosides, tacrolimus.

**Exam trap.** A new antibiotic or antifungal in a patient on warfarin with a sudden INR rise is a drug interaction until proven otherwise.` },
  { t: 'Toxicology and antidotes', r: `- **Acetaminophen** → N-acetylcysteine (use the nomogram from 4 h post-ingestion; give NAC if timing is unknown and levels are detectable).
- **Opioids** → naloxone.
- **Benzodiazepines** → flumazenil (rarely used: can precipitate seizures in chronic users).
- **Tricyclic antidepressants** → **sodium bicarbonate** for QRS >100 ms or arrhythmias.
- **Salicylates** → sodium bicarbonate (urine alkalinization); dialysis if severe.
- **Digoxin** → digoxin immune Fab (hyperkalemia signals severe toxicity).
- **Methanol/ethylene glycol** → **fomepizole**; dialysis.
- **Beta-blockers** → glucagon; **calcium channel blockers** → IV calcium, high-dose insulin.
- **Heparin** → protamine. **Warfarin** → vitamin K + 4-factor PCC if bleeding.
- **Iron** → deferoxamine. **Lead** → succimer/EDTA/dimercaprol.
- **Cyanide** → hydroxocobalamin. **Carbon monoxide** → 100% oxygen (hyperbaric if severe).
- **Methemoglobinemia** → methylene blue (not in G6PD deficiency).
- **Organophosphates** → atropine + pralidoxime.

**Exam trap.** Carbon monoxide: pulse oximetry reads falsely normal; measure carboxyhemoglobin with co-oximetry.` }
 ]},
 { id: 'biostat', nome: 'Biostatistics & ethics', step: 'Step 1 · Step 2 CK', temas: [
  { t: 'Diagnostic test statistics', r: `**2×2 table:** rows = test result, columns = disease.
- **Sensitivity** = TP / (TP + FN) — few false negatives; a negative **sensitive** test rules **out** (SnNout).
- **Specificity** = TN / (TN + FP) — few false positives; a positive **specific** test rules **in** (SpPin).
- **PPV** = TP / (TP + FP); **NPV** = TN / (TN + FN).

**Prevalence:** ↑ prevalence → ↑ PPV and ↓ NPV. Sensitivity and specificity do not change with prevalence.

**Likelihood ratios:** LR+ = sensitivity / (1 − specificity); LR− = (1 − sensitivity) / specificity. LR+ >10 or LR− <0.1 changes probability a lot.

**Cutoffs:** lowering the cutoff for a positive test → ↑ sensitivity, ↓ specificity (and vice versa).

**Exam trap.** A screening program in a low-prevalence population produces many false positives even with a good test: PPV falls.` },
  { t: 'Study design and measures of risk', r: `**Designs:** cross-sectional (prevalence), case-control (starts from outcome; **odds ratio**), cohort (starts from exposure; **relative risk**, incidence), randomized controlled trial (strongest for causality), meta-analysis.

**Risk measures:**
- **Relative risk** = incidence in exposed / incidence in unexposed.
- **Absolute risk reduction** = control event rate − treatment event rate.
- **Number needed to treat** = 1 / ARR; **number needed to harm** = 1 / absolute risk increase.
- **Attributable risk percent** = (RR − 1) / RR.

**Bias:** selection (Berkson, healthy worker), recall (case-control), lead-time (screening looks better), length-time, observer, confounding (control with randomization, matching, stratification).

**Errors:** type I (α) = false positive; type II (β) = false negative; **power = 1 − β**, increased by larger sample size.

**Exam trap.** Survival seems longer with screening because diagnosis is earlier, not because death is later → **lead-time bias**.` },
  { t: 'Medical ethics', r: `**Decision-making capacity** is clinical and task-specific (any physician can assess it); **competence** is a legal determination. Capacity requires understanding, appreciation, reasoning and expressing a choice.

**Informed consent:** diagnosis, proposed treatment, alternatives, risks and benefits, including the option of no treatment. Exceptions: emergency, waiver, patient lacks capacity (use surrogate).

**Surrogate order** (typical): health care proxy/advance directive → spouse → adult children → parents → siblings → other relatives.

**Minors:** parental consent is usually required, with exceptions for emergencies, contraception, STI care, prenatal care and, in many places, substance use treatment. Emancipated minors decide for themselves.

**Confidentiality exceptions:** serious threat to others (duty to warn/protect), reportable infections, suspected child or elder abuse, gunshot wounds, impaired driving (varies by jurisdiction).

**Communication:** use a **professional interpreter**, not family. Disclose medical errors to the patient.

**Exam trap.** A patient with capacity may refuse life-saving treatment (e.g., a Jehovah's Witness refusing blood). For a minor in an emergency, treat and involve the court if needed.` }
 ]}
];

// Five cards per topic, [question, answer], derived from the topic text.
const CARDS: Record<string, [string, string][][]> = {
 cardio: [
  [
   ['Which LVEF values define HFrEF, HF with mildly reduced EF, and HFpEF?', 'HFrEF ≤40%, mildly reduced 41–49%, preserved ≥50%.'],
   ['Name the four drug classes that lower mortality in HFrEF.', 'ACE inhibitor/ARB or ARNI, beta-blocker, mineralocorticoid antagonist, and SGLT2 inhibitor.'],
   ['Do loop diuretics lower mortality in heart failure?', 'No. They relieve congestion and symptoms only.'],
   ['How long must you wait after stopping an ACE inhibitor before starting sacubitril-valsartan?', '36 hours, to reduce the risk of angioedema.'],
   ['When should a beta-blocker be started in heart failure?', 'When the patient is euvolemic and stable, not during acute decompensation.']
  ],
  [
   ['ST elevation in II, III and aVF points to which territory and artery?', 'Inferior wall, usually the right coronary artery.'],
   ['What is the door-to-balloon goal for primary PCI in STEMI?', '≤90 minutes at a PCI-capable hospital (≤120 minutes including transfer); otherwise fibrinolysis within 30 minutes.'],
   ['Which complications peak 3–14 days after an MI?', 'Papillary muscle rupture, interventricular septal rupture and free wall rupture (tamponade).'],
   ['Why avoid nitrates in right ventricular infarction?', 'The RV is preload dependent; nitrates can cause severe hypotension. Give IV fluids.'],
   ['What is the first-line treatment for cocaine-associated chest pain?', 'Benzodiazepines (plus aspirin and nitrates); avoid beta-blockers acutely.']
  ],
  [
   ['Crescendo-decrescendo systolic murmur at the right upper sternal border radiating to the carotids?', 'Aortic stenosis.'],
   ['Holosystolic murmur at the apex radiating to the axilla?', 'Mitral regurgitation.'],
   ['Which murmur gets louder with Valsalva or standing?', 'Hypertrophic cardiomyopathy (MVP click also moves earlier).'],
   ['Opening snap followed by a mid-diastolic rumble suggests what, and what is the usual cause?', 'Mitral stenosis, usually from rheumatic heart disease.'],
   ['Early diastolic decrescendo murmur with wide pulse pressure?', 'Aortic regurgitation.']
  ]
 ],
 pulm: [
  [
   ['Which spirometry ratio defines obstruction?', 'FEV1/FVC below 0.70.'],
   ['How does DLCO differ between asthma and emphysema?', 'Normal or increased in asthma; decreased in emphysema.'],
   ['What is the preferred reliever in adult asthma according to GINA?', 'As-needed low-dose ICS-formoterol.'],
   ['Which two interventions improve survival in COPD?', 'Smoking cessation and long-term oxygen when indicated (PaO2 ≤55 mmHg or SpO2 ≤88%).'],
   ['Young nonsmoker with basilar emphysema: what should you suspect?', 'Alpha-1 antitrypsin deficiency.']
  ],
  [
   ['When is a D-dimer useful in suspected PE?', 'With low or intermediate pretest probability; a negative result rules out PE.'],
   ['Most common ECG finding in PE?', 'Sinus tachycardia (S1Q3T3 is specific but uncommon).'],
   ['Typical blood gas in acute PE?', 'Hypoxemia, respiratory alkalosis and an increased A-a gradient.'],
   ['PE with hypotension and no contraindication: what treatment?', 'Systemic thrombolysis.'],
   ['Imaging for PE when IV contrast is contraindicated?', 'Ventilation-perfusion (V/Q) scan.']
  ],
  [
   ['Most common cause of community-acquired pneumonia?', 'Streptococcus pneumoniae.'],
   ['Pneumonia with hyponatremia, diarrhea and exposure to water systems?', 'Legionella.'],
   ['What do the letters of CURB-65 stand for?', 'Confusion, Urea, Respiratory rate ≥30, Blood pressure <90 systolic or ≤60 diastolic, age ≥65.'],
   ['Empiric regimen for a non-ICU inpatient with CAP?', 'Beta-lactam plus macrolide, or a respiratory fluoroquinolone alone.'],
   ['Why does atypical pneumonia fail to respond to beta-lactams?', 'Organisms like Mycoplasma lack a cell wall.']
  ]
 ],
 renal: [
  [
   ["What is Winter's formula?", 'Expected PaCO2 = 1.5 × HCO3 + 8 ± 2 in metabolic acidosis.'],
   ['How do you calculate the anion gap and what is normal?', 'Na − (Cl + HCO3); about 12 (lab dependent).'],
   ['Give three causes of normal anion gap metabolic acidosis.', 'Diarrhea, renal tubular acidosis, large-volume normal saline (also acetazolamide).'],
   ['Metabolic alkalosis with urine chloride <20 mEq/L suggests what?', 'A saline-responsive cause such as vomiting or prior diuretic use.'],
   ['Classic early acid–base pattern of salicylate poisoning?', 'Mixed respiratory alkalosis and high anion gap metabolic acidosis.']
  ],
  [
   ['Lab profile of SIADH?', 'Euvolemic hyponatremia with urine osmolality >100 and urine Na >40.'],
   ['Maximum safe rise of serum sodium in 24 hours?', 'About 8–10 mEq/L, to avoid osmotic demyelination.'],
   ['How does desmopressin separate central from nephrogenic DI?', 'Urine concentrates after desmopressin in central DI, not in nephrogenic DI.'],
   ['Two drugs or conditions that cause nephrogenic DI?', 'Lithium and hypercalcemia (also hypokalemia).'],
   ['Hyponatremia with high serum osmolality points to what?', 'Hyperglycemia (or another osmotically active solute).']
  ],
  [
   ['Define nephrotic syndrome.', 'Proteinuria >3.5 g/day, hypoalbuminemia, edema and hyperlipidemia.'],
   ['Which antibody is linked to primary membranous nephropathy?', 'Anti-PLA2R.'],
   ['Most common nephrotic syndrome in children?', 'Minimal change disease, which responds to steroids.'],
   ['Hematuria 1–3 days after a URI with normal complement?', 'IgA nephropathy.'],
   ['Hematuria 2–3 weeks after strep pharyngitis with low C3?', 'Post-streptococcal glomerulonephritis.']
  ]
 ],
 endo: [
  [
   ['HbA1c threshold for diabetes?', '≥6.5% (confirmed by repeat testing unless unequivocal).'],
   ['What must be checked before starting insulin in DKA?', 'Serum potassium: if <3.3 mEq/L, replace potassium first.'],
   ['When do you add dextrose during DKA treatment?', 'When glucose falls to about 200–250 mg/dL while the anion gap is still open.'],
   ['Key differences between HHS and DKA?', 'HHS: very high glucose (often >600), osmolality >320, little ketosis, older type 2 patients.'],
   ['Is total body potassium high or low in DKA?', 'Low, even if the serum level is normal or high.']
  ],
  [
   ['Hyperthyroidism with low radioiodine uptake: what causes?', 'Thyroiditis (subacute, painless, postpartum) or exogenous thyroid hormone.'],
   ['Which antithyroid drug is preferred in the first trimester?', 'Propylthiouracil (PTU).'],
   ['In thyroid storm, why give the thionamide before iodine?', 'Iodine given first can fuel new hormone synthesis; block synthesis first.'],
   ['Most common cause of hypothyroidism in iodine-sufficient areas?', 'Hashimoto thyroiditis (anti-TPO antibodies).'],
   ['First step for a thyroid nodule?', 'Measure TSH; low TSH → uptake scan, normal/high TSH → ultrasound ± FNA.']
  ],
  [
   ['Three screening tests for Cushing syndrome?', '24-hour urinary free cortisol, late-night salivary cortisol, 1-mg overnight dexamethasone suppression.'],
   ['Most common cause of Cushing syndrome overall?', 'Exogenous glucocorticoids.'],
   ['Electrolyte pattern of primary adrenal insufficiency?', 'Hyponatremia and hyperkalemia (with hyperpigmentation).'],
   ['First treatment for suspected adrenal crisis?', 'IV hydrocortisone and fluids immediately, without waiting for tests.'],
   ['Which blockade must come first before pheochromocytoma surgery?', 'Alpha-blockade (e.g., phenoxybenzamine), then beta-blockade.']
  ]
 ],
 heme: [
  [
   ['Iron studies in iron deficiency?', 'Low ferritin, high TIBC, low transferrin saturation, high RDW.'],
   ['How do iron studies differ in anemia of chronic disease?', 'Ferritin normal or high, TIBC low.'],
   ['What does a Mentzer index <13 suggest?', 'Thalassemia trait (MCV/RBC count).'],
   ['Name three causes of sideroblastic anemia.', 'Alcohol, lead poisoning, isoniazid (B6 deficiency); also copper deficiency.'],
   ['What is the key step in iron deficiency in an older adult?', 'Look for GI blood loss (endoscopy/colonoscopy).']
  ],
  [
   ['Which metabolites rise in B12 vs folate deficiency?', 'B12: methylmalonic acid and homocysteine. Folate: homocysteine only.'],
   ['Which deficiency causes neurologic signs?', 'B12 deficiency (subacute combined degeneration).'],
   ['Four lab signs of hemolysis?', 'High LDH, high indirect bilirubin, low haptoglobin, high reticulocytes.'],
   ['Spherocytes with a positive direct antiglobulin test?', 'Warm autoimmune hemolytic anemia (IgG).'],
   ['Bite cells and Heinz bodies after sulfa or fava beans?', 'G6PD deficiency.']
  ],
  [
   ['Isolated prolonged aPTT with joint bleeding in a boy?', 'Hemophilia A or B (factor VIII or IX deficiency).'],
   ['Most common inherited bleeding disorder?', 'von Willebrand disease.'],
   ['Timing and features of HIT?', 'Platelets fall >50% 5–10 days after heparin, with thrombosis.'],
   ['Treatment of HIT?', 'Stop all heparin and start a non-heparin anticoagulant (argatroban, fondaparinux, DOAC).'],
   ['Urgent treatment of TTP?', 'Plasma exchange; avoid platelet transfusion.']
  ]
 ],
 id: [
  [
   ['Top meningitis organisms in neonates?', 'Group B Streptococcus, E. coli and Listeria.'],
   ['Empiric therapy for bacterial meningitis in an adult over 50?', 'Vancomycin + ceftriaxone + ampicillin.'],
   ['When is dexamethasone given in bacterial meningitis?', 'Before or with the first antibiotic dose.'],
   ['CSF glucose and cells in bacterial meningitis?', 'Low glucose, high neutrophils, high protein.'],
   ['Should antibiotics wait for the head CT?', 'No. Draw blood cultures and give antibiotics first.']
  ],
  [
   ['Recommended HIV screening test?', '4th-generation HIV-1/2 antigen/antibody immunoassay.'],
   ['CD4 threshold for Pneumocystis prophylaxis and the drug?', '<200 cells/mm³; TMP-SMX.'],
   ['When is toxoplasmosis prophylaxis indicated?', 'CD4 <100 with positive Toxoplasma IgG (TMP-SMX).'],
   ['Multiple ring-enhancing brain lesions in advanced HIV?', 'Toxoplasmosis (single lesion unresponsive to treatment → consider CNS lymphoma).'],
   ['When should ART be started?', 'For everyone with HIV, as soon as possible.']
  ],
  [
   ['Painless genital ulcer with firm borders?', 'Primary syphilis (chancre).'],
   ['Treatment of early syphilis?', 'Benzathine penicillin G IM.'],
   ['What if a pregnant woman with syphilis is allergic to penicillin?', 'Penicillin desensitization, then penicillin.'],
   ['Current treatment for uncomplicated gonorrhea?', 'Ceftriaxone 500 mg IM (1 g if ≥150 kg).'],
   ['Fever and myalgia hours after treating syphilis?', 'Jarisch-Herxheimer reaction.']
  ]
 ],
 pharm: [
  [
   ['First-line vasopressor in septic shock?', 'Norepinephrine.'],
   ['Which pressor causes reflex bradycardia?', 'Phenylephrine (pure α1 agonist).'],
   ['Treatment of organophosphate poisoning?', 'Atropine plus pralidoxime.'],
   ['What does DUMBBELSS stand for?', 'Diarrhea, Urination, Miosis, Bronchospasm/Bronchorrhea, Bradycardia, Emesis, Lacrimation, Salivation/Sweating.'],
   ['Which finding separates anticholinergic from sympathomimetic toxicity?', 'Dry skin in anticholinergic toxicity; sweating in sympathomimetic toxicity.']
  ],
  [
   ['Name four CYP450 inducers.', 'Rifampin, carbamazepine, phenytoin, St John\'s wort (also phenobarbital, chronic alcohol).'],
   ['Name four CYP450 inhibitors.', 'Clarithromycin/erythromycin, azole antifungals, ritonavir, grapefruit juice (also amiodarone, cimetidine).'],
   ['Rifampin with oral contraceptives causes what?', 'Lower hormone levels and contraceptive failure.'],
   ['Simvastatin plus clarithromycin risk?', 'Myopathy and rhabdomyolysis.'],
   ['INR rises after a new antibiotic in a warfarin user: first thought?', 'CYP450 inhibition drug interaction.']
  ],
  [
   ['Antidote for acetaminophen overdose?', 'N-acetylcysteine.'],
   ['TCA overdose with QRS >100 ms: treatment?', 'Sodium bicarbonate.'],
   ['Antidote for methanol or ethylene glycol?', 'Fomepizole (dialysis if severe).'],
   ['Antidotes for beta-blocker and calcium channel blocker overdose?', 'Beta-blocker: glucagon. CCB: IV calcium and high-dose insulin.'],
   ['Why is pulse oximetry misleading in carbon monoxide poisoning?', 'It reads carboxyhemoglobin as oxyhemoglobin; use co-oximetry.']
  ]
 ],
 biostat: [
  [
   ['Formula for sensitivity?', 'TP / (TP + FN).'],
   ['What does SpPin mean?', 'A positive result on a highly specific test rules the disease in.'],
   ['How does higher prevalence change PPV and NPV?', 'PPV increases and NPV decreases.'],
   ['Formula for the positive likelihood ratio?', 'Sensitivity / (1 − specificity).'],
   ['Lowering the positivity cutoff of a test does what?', 'Increases sensitivity and decreases specificity.']
  ],
  [
   ['Which measure of association comes from a case-control study?', 'Odds ratio.'],
   ['How do you calculate NNT?', '1 / absolute risk reduction.'],
   ['Screening seems to prolong survival only because diagnosis is earlier: which bias?', 'Lead-time bias.'],
   ['Define statistical power.', '1 − β: the probability of detecting a true effect; increased by a larger sample.'],
   ['Type I error is what?', 'A false positive: rejecting a true null hypothesis (α).']
  ],
  [
   ['Who determines capacity and who determines competence?', 'Capacity: any physician, clinically and per decision. Competence: a court.'],
   ['Four elements of decision-making capacity?', 'Understanding, appreciation, reasoning and communicating a choice.'],
   ['Name two exceptions to informed consent.', 'Emergency and patient waiver (also lack of capacity with a surrogate).'],
   ['Can a patient with capacity refuse life-saving treatment?', 'Yes, after informed discussion (e.g., refusing blood transfusion).'],
   ['Who should interpret for a patient with limited English?', 'A professional medical interpreter, not a family member.']
  ]
 ]
};

export const USMLE_AREAS: StudyArea[] = AREAS;
export const USMLE_DECK: Record<string, StudyCard[]> = Object.fromEntries(
 AREAS.map(a => [a.id, (CARDS[a.id] || []).flatMap((cards, ti) => cards.map(([q, a2], ci) => ({ q, a: a2, ti, ci })))]),
);
export const USMLE_TOTAL_TOPICS = AREAS.reduce((n, a) => n + a.temas.length, 0);
export const USMLE_TOTAL_CARDS = Object.values(USMLE_DECK).reduce((n, d) => n + d.length, 0);
