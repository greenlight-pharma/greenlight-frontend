import React, { useEffect, useRef, useState } from 'react';
import { Globe2, Target, Menu, X, Plus, History, MessageSquare, Stethoscope, GraduationCap, FlaskConical, Search, ArrowUpRight, ChevronRight, Palette, Check, UserRound, BookOpen, Calculator, FileText } from 'lucide-react';
import { moduleItems } from '../Modules';
import { searchNavigation, navigationGroups } from '../../shared/product.mjs';
import { useI18n, LanguageSettings } from './I18n';
const groupIcons = { pesquisa: BookOpen, plantao: Stethoscope, estudos: GraduationCap, laboratorio: FlaskConical };
export function Mark({ className = '' }) {return <svg className={className} viewBox="0 0 175 124" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M5 34C13 12 32 0 58 0H112C151 0 175 25 175 61C175 99 150 124 112 124H0V113C0 92 11 78 32 64L51 52C63 44 66 37 63 32C59 23 42 25 36 34ZM84 26C94 52 82 67 56 82L34 99H109C134 99 147 84 147 62C147 40 134 26 112 26Z" /></svg>;}
export function Rail({ module, navigate, onNew, onHistory, onAccount, onMenu, busy }) {const { t, locale } = useI18n();
  return <aside className="doctor-rail" aria-label={t("Acessos r\xE1pidos")}><button className="doctor-rail-brand" onClick={() => navigate('chat')} aria-label={t("2Doctor in\xEDcio")}><Mark /></button><button onClick={onMenu} title={t("Abrir menu")} aria-label={t("Abrir menu")}><Menu size={21} /></button><button onClick={onNew} title={t("Nova conversa")} aria-label={t("Nova conversa")}><Plus size={22} /></button><button onClick={onHistory} disabled={busy} title={t("Hist\xF3rico de conversas")} aria-label={t("Hist\xF3rico de conversas")}><History size={21} /></button><span className="doctor-rail-rule" /><button aria-current={module === 'chat' ? 'page' : undefined} onClick={() => navigate('chat')} title="Chat" aria-label="Chat"><MessageSquare size={21} /></button>{navigationGroups.map((group) => {const Icon = groupIcons[group.id];return <button key={group.id} aria-current={group.modules.includes(module) ? 'page' : undefined} onClick={() => onMenu(group.id)} title={t(group.label)} aria-label={t(group.label)}><Icon size={21} /></button>;})}<div className="doctor-rail-space" /><button onClick={onAccount} title={t("Minha conta")} aria-label={t("Minha conta")}><UserRound size={21} /></button></aside>;
}
export function Header({ module, onHome, onMenu, onNew, onHistory, onAccount, session, theme, setTheme, themes, busy }) {const { t, locale } = useI18n();
  return <header className="doctor-header"><button className="doctor-mobile-menu" aria-label={t("Abrir menu")} onClick={onMenu}><Menu size={21} /></button><a className="doctor-wordmark" href="#chat" onClick={(e) => {e.preventDefault();onHome();}}><Mark /><span>2Doctor</span></a><span className="doctor-header-divider" /><span className="doctor-page-name">{module === 'chat' ? t("Seu assistente m\xE9dico") : t(moduleItems.find((item) => item.id === module)?.label)}</span><span className="doctor-header-space" /><button className="doctor-mobile-action doctor-history-action" aria-label={t("Hist\xF3rico de conversas")} disabled={busy} onClick={onHistory}><History size={20} /></button><button className="doctor-mobile-action" aria-label={t("Nova conversa")} onClick={onNew}><Plus size={22} /></button><LanguageSettings /><details className="theme-picker"><summary aria-label={t("Escolher apar\xEAncia")}><Palette size={19} /></summary><div className="theme-options" role="group" aria-label={t("Tema de cores")}>{themes.map(([id, label]) => <button key={id} aria-pressed={theme === id} onClick={(e) => {setTheme(id);e.currentTarget.closest('details').open = false;}}><span className={`theme-dot ${id}`} />{t(label)}{theme === id && <Check size={15} />}</button>)}</div></details><button className="doctor-account" onClick={onAccount}>{session?.authenticated ? <><UserRound size={16} /><span>{t("Minha conta")}</span></> : t("Entrar")}</button></header>;
}
export function Drawer({ onClose, onNavigate, onNew, onHistory, onSources, onAccount, module, initialGroup, busy, theme, setTheme, themes }) {
  const { t, locale } = useI18n();
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(initialGroup || navigationGroups.find(g => g.modules.includes(module))?.id || null);
  const ref = useRef(null), shade = useRef(null);
  const groups = searchNavigation(moduleItems.map(item => ({ ...item, label: t(item.label), description: t(item.description) })), query, navigationGroups.map(group => ({ ...group, label: t(group.label) })));
  useEffect(() => {
    const previous = document.activeElement, y = window.scrollY;
    const background = [];
    for (let branch = shade.current; branch?.parentElement && branch.parentElement.id !== 'root'; branch = branch.parentElement) {
      for (const sibling of branch.parentElement.children) if (sibling !== branch) {background.push([sibling, sibling.inert]);sibling.inert = true;}
    }
    const saved = Object.fromEntries(['position','top','width','overflow'].map(key => [key, document.body.style[key]]));
    Object.assign(document.body.style, { position: 'fixed', top: `-${y}px`, width: '100%', overflow: 'hidden' });
    // Focus a control, never the search field: opening navigation must not open a phone keyboard.
    ref.current.querySelector('header button')?.focus({ preventScroll: true });
    const viewport = window.visualViewport;
    const fit = () => {
      if (!shade.current) return;
      // Do not interfere with the user's accessibility pinch zoom.
      const ordinaryScale = !viewport || Math.abs(viewport.scale - 1) < .05;
      shade.current.style.height = ordinaryScale && viewport ? `${viewport.height}px` : '100dvh';
      shade.current.style.top = ordinaryScale && viewport ? `${viewport.offsetTop}px` : '0px';
    };
    fit(); viewport?.addEventListener('resize', fit); viewport?.addEventListener('scroll', fit);
    return () => {
      viewport?.removeEventListener('resize', fit); viewport?.removeEventListener('scroll', fit);
      background.forEach(([element, inert]) => {element.inert = inert;});
      Object.assign(document.body.style, saved); window.scrollTo(0, y);
      if (previous?.isConnected && !previous.matches('input,textarea,select')) previous.focus({ preventScroll: true });
    };
  }, []);
  function keys(e) {
    if (e.key === 'Escape') {e.preventDefault();onClose();}
    if (e.key === 'Tab') {
      const elements = [...ref.current.querySelectorAll('button:not(:disabled),input,a[href],summary,select')].filter(el => el.getClientRects().length);
      if (e.shiftKey && document.activeElement === elements[0]) {e.preventDefault();elements.at(-1)?.focus();}
      else if (!e.shiftKey && document.activeElement === elements.at(-1)) {e.preventDefault();elements[0]?.focus();}
    }
  }
  return <div ref={shade} className="doctor-drawer-shade" onClick={onClose}>
    <section ref={ref} className="doctor-drawer" role="dialog" aria-modal="true" aria-label={t('Menu 2Doctor')} onClick={e => e.stopPropagation()} onKeyDown={keys}>
      <header><a className="doctor-wordmark" href="#chat" onClick={e => {e.preventDefault();onNavigate('chat');}}><Mark /><span>2Doctor</span></a><button aria-label={t('Fechar menu')} onClick={onClose}><X size={22}/></button></header>
      <label className="doctor-nav-search"><Search size={19}/><input type="search" enterKeyHint="search" autoComplete="off" placeholder={t('Buscar ferramenta ou matéria')} aria-label={t('Buscar ferramenta ou matéria')} value={query} onChange={e => setQuery(e.target.value)}/></label>
      <div className="doctor-nav-scroll">
        <nav aria-label={t('Acessos rápidos')} className="doctor-nav-shortcuts">
          <button aria-current={module === 'chat' ? 'page' : undefined} onClick={() => onNavigate('chat')}><MessageSquare size={19}/>Chat</button>
          <button disabled={busy} onClick={() => {onNew();onClose();}}><Plus size={19}/>{t('Nova conversa')}</button>
          <button disabled={busy} onClick={() => {onHistory();onClose();}}><History size={19}/>{t('Histórico')}</button>
        </nav>
        <nav aria-label={t('Ferramentas 2Doctor')} className="doctor-nav-groups">
          {groups.length ? groups.map(group => {
            const open = !!query.trim() || expanded === group.id, Icon = groupIcons[group.id];
            return <section key={group.id}>
              <h2><button aria-expanded={open} aria-controls={`doctor-group-${group.id}`} onClick={() => {setQuery('');setExpanded(open ? null : group.id);}}><Icon size={21}/><span>{group.label}</span><ChevronRight size={18}/></button></h2>
              <div id={`doctor-group-${group.id}`} hidden={!open} className="doctor-nav-items">{group.items.map(item => <button key={item.id} aria-current={module === item.id ? 'page' : undefined} onClick={() => onNavigate(item.id)}><item.icon size={20}/><span>{item.id === 'laboratorio' ? t('Radiografia em 3D') : item.label}<small>{item.id === 'laboratorio' ? t('Protótipo interativo') : item.description}</small>{locale !== 'pt-BR' && !['pesquisa','inovacoes','pais','desafio','evidencias'].includes(item.id) && <em className="doctor-content-language">{t('Conteúdo em português')}</em>}</span><ChevronRight size={15}/></button>)}</div>
            </section>;
          }) : <p className="doctor-no-results" role="status">{t('Nenhuma ferramenta encontrada.')}</p>}
        </nav>
        <div className="doctor-nav-preferences"><LanguageSettings/><ThemePicker theme={theme} setTheme={setTheme} themes={themes}/></div>
        <footer className="doctor-nav-footer"><button onClick={() => {onSources();onClose();}}><BookOpen size={18}/>{t('Fontes da conversa')}</button><button onClick={() => {onAccount();onClose();}}><UserRound size={18}/>{t('Minha conta')}</button></footer>
      </div>
    </section>
  </div>;
}
export function ThemePicker({theme,setTheme,themes}) {
  const {t}=useI18n();
  return <details className="theme-picker"><summary aria-label={t('Escolher aparência')}><Palette size={19}/><span>{t('Escolher aparência')}</span></summary><div className="theme-options" role="group" aria-label={t('Tema de cores')}>{themes.map(([id,label])=><button key={id} aria-pressed={theme===id} onClick={e=>{setTheme(id);e.currentTarget.closest('details').open=false;}}><span className={`theme-dot ${id}`}/>{t(label)}{theme===id&&<Check size={15}/>}</button>)}</div></details>;
}
export function MobileNavigation({module,onNavigate,onMenu}) {
  const {t}=useI18n();
  return <nav className="doctor-mobile-dock" aria-label={t('Acessos rápidos')}>
    <button aria-current={module==='chat'?'page':undefined} onClick={()=>onNavigate('chat')}><MessageSquare size={21}/><span>Chat</span></button>
    <button aria-current={navigationGroups[0].modules.includes(module)?'page':undefined} onClick={()=>onMenu('plantao')}><Stethoscope size={21}/><span>{t('Plantão')}</span></button>
    <button aria-current={navigationGroups[1].modules.includes(module)?'page':undefined} onClick={()=>onMenu('estudos')}><GraduationCap size={21}/><span>{t('Estudos')}</span></button>
    <button onClick={()=>onMenu()} aria-label={t('Abrir menu')}><Menu size={21}/><span>Menu</span></button>
  </nav>;
}
export function Welcome() {const { t, locale } = useI18n();return <div className="doctor-welcome"><div className="doctor-hero-mark"><Mark /></div><p className="doctor-eyebrow">{t("NO PLANT\xC3O. NOS ESTUDOS.")}</p><h1>{t("Como posso ajudar hoje?")}</h1><p>{t("Conecte o que voc\xEA sabe ao que precisa descobrir.")}</p></div>;}
export function QuickActions({ navigate, onCase, onPrompt }) {const { t, locale } = useI18n();
  return <div className="doctor-quick-area"><div className="doctor-quick-actions"><button onClick={onCase}><FileText size={20} /><span>{t("Discutir um caso")}<small>{t("Organize o racioc\xEDnio cl\xEDnico")}</small></span><ArrowUpRight size={17} /></button><button onClick={() => navigate('scores')}><Calculator size={20} /><span>{t("Consultar um score")}<small>{t("Calculadoras \xE0 m\xE3o")}</small></span><ArrowUpRight size={17} /></button><button onClick={() => navigate('questoes')}><GraduationCap size={21} /><span>{t("Estudar para provas")}<small>{t("Quest\xF5es e coment\xE1rios")}</small></span><ArrowUpRight size={17} /></button></div><div className="doctor-discovery-links"><button onClick={()=>navigate('desafio')}><Target size={16}/>{t('Desafio do dia')}</button><button onClick={()=>navigate('pais')}><Globe2 size={16}/>{t('Seu país')}</button></div><div className="doctor-suggestions"><span>{t("Experimente")}</span>{[t("Compare asma e DPOC"), t("Explique o ciclo card\xEDaco")].map(t).map((text) => <button key={text} onClick={() => onPrompt(text)}>{text}<ArrowUpRight size={13} /></button>)}</div></div>;
}
