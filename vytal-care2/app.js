(() => {
  const panel = document.getElementById('demo-panel');
  const signup = '/vytal-care2/app/familia';
  const note = '<p class="info-note">Exemplo ilustrativo. Ausência de confirmação não significa que a medicação não foi tomada.</p>';
  function show(view, person) {
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
    if (person) {
      const maria = person === 'maria';
      panel.innerHTML = `<button class="demo-back" data-action="inicio">← Minha família</button><h3>${maria ? 'Maria' : 'João'}</h3><p class="intro">Horários de hoje · exemplo</p><div class="schedule"><div class="schedule-row"><span class="time-circle">✓</span><div><b>08:00 · Confirmado</b><p>Medicação cadastrada</p><small>Confirmação registrada às 08:05</small></div></div>${maria ? '<div class="schedule-row"><span class="time-circle pending">!</span><div><b>14:00 · Sem confirmação</b><p>Medicação cadastrada</p><small>Confira com Maria como ela está.</small></div></div>' : ''}<div class="schedule-row"><span class="time-circle future">◷</span><div><b>${maria ? '20:00' : '21:00'} · Próximo horário</b><p>Medicação cadastrada</p><small>Lembrete previsto para esse horário</small></div></div></div>${note}`;
    } else if (view === 'avisos') {
      panel.innerHTML = '<h3>Avisos da família</h3><p class="intro">O que merece sua atenção hoje.</p><article class="notice-card"><b>Maria · Sem confirmação</b><p>O horário das 14:00 ainda não tem uma confirmação registrada.</p><button data-person="maria">Ver horários de Maria →</button></article><article class="notice-card"><b>João · Tratamento próximo do fim</b><p>Um dos tratamentos cadastrados termina em 5 dias. Confira a orientação da receita.</p><button data-person="joao">Ver horários de João →</button></article>';
    } else if (view === 'conta') {
      panel.innerHTML = `<h3>Sua conta</h3><p class="intro">Tudo sobre o seu plano, em um lugar.</p><article class="notice-card"><b>Plano Família</b><p>Até 3 pessoas acompanhadas.</p><div class="price">R$ 29,90<span>/mês</span></div><p>Esta é uma demonstração. Nenhuma assinatura foi criada.</p></article><a class="demo-button" href="${signup}">Criar minha conta e testar grátis →</a><p class="info-note" style="margin-top:16px">O cadastro e o pagamento acontecem nesta versão do Care, com a integração existente do Pagar.me.</p>`;
    } else {
      panel.innerHTML = `<h3>Olá, família Silva.</h3><p class="intro">Veja como está o cuidado de hoje.</p><button class="alert-demo" data-action="avisos"><b>! </b><div><b>Maria tem um horário sem confirmação</b><span>Veja os avisos da sua família →</span></div></button><div class="demo-section-title">Minha família</div><button class="person" data-person="maria"><span class="avatar rose">M</span><span class="person-info"><b>Maria</b><small>1 de 2 horários passados confirmado</small><span class="bar"><span></span><span class="empty"></span></span><small>Próximo lembrete · 20:00</small></span><span aria-hidden="true">›</span></button><button class="person" data-person="joao"><span class="avatar">J</span><span class="person-info"><b>João</b><small>1 de 1 horário passado confirmado</small><span class="bar"><span></span></span><small>Próximo lembrete · 21:00</small></span><span aria-hidden="true">›</span></button><a class="demo-button" href="${signup}">Começar com minha família →</a>`;
    }
  }
  document.querySelector('.demo-device').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.dataset.person) show('inicio', button.dataset.person);
    else if (button.dataset.view || button.dataset.action) show(button.dataset.view || button.dataset.action);
  });
  show('inicio');
})();
