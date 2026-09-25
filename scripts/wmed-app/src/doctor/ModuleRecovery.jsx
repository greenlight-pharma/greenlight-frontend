import React, { Component, lazy } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { createModuleRegistry } from '../../shared/module-retry.mjs';
import { useI18n } from './I18n';
import './module-recovery.css';
const registry = createModuleRegistry(lazy);
export function recoverableLazy(load) {
  if (import.meta.env.VITE_PRODUCT !== '2doctor') return lazy(load);
  const entry = registry.register(load);
  return function RecoverableModule(props) { const Loaded = entry.component; return <Loaded {...props}/>; };
}
function Failure({ retry, retried, clinical }) {
  const { locale } = useI18n(), i = locale === 'en' ? 1 : locale === 'es' ? 2 : 0;
  return <section className="module-recovery" role="alert">
    <h2>{['Não foi possível abrir esta ferramenta', 'This tool could not open', 'No se pudo abrir esta herramienta'][i]}</h2>
    <p>{retried ? ['Ainda não abriu. Pode ser necessário atualizar a página. Antes, volte ao chat e copie os textos pendentes.', 'Still unavailable. A page refresh may be needed. First, return to the chat and copy any pending text.', 'Sigue sin abrirse. Puede ser necesario actualizar la página. Antes, vuelve al chat y copia los textos pendientes.'][i] : ['Confira sua conexão e tente novamente.', 'Check your connection and try again.', 'Comprueba tu conexión e inténtalo de nuevo.'][i]}</p>
    <p>{['Voltar ao chat preserva a conversa e o texto que você estava digitando nesta página.', 'Returning to the chat keeps the conversation and the text you were typing on this page.', 'Volver al chat conserva la conversación y el texto que estabas escribiendo en esta página.'][i]}</p>
    {clinical && <p>{['Alterações não salvas nesta ferramenta podem ter sido perdidas. Confira o histórico antes de enviar novamente.', 'Unsaved edits in this tool may have been lost. Check the history before submitting again.', 'Los cambios no guardados en esta herramienta pueden haberse perdido. Revisa el historial antes de enviar de nuevo.'][i]}</p>}
    <div><button type="button" onClick={retry}><RotateCcw size={16}/>{['Tentar novamente', 'Try again', 'Intentar de nuevo'][i]}</button><a href="#chat"><ArrowLeft size={16}/>{['Voltar ao chat', 'Back to chat', 'Volver al chat'][i]}</a></div>
  </section>;
}
export class RecoverableBoundary extends Component {
  state = { error: false, retried: false };
  static getDerivedStateFromError() { return { error: true }; }
  retry = () => { registry.retryFailed(); this.setState({ error: false, retried: true }); };
  render() { return this.state.error ? <Failure retry={this.retry} retried={this.state.retried} clinical={this.props.clinical}/> : this.props.children; }
}
