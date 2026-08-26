function Dashboard({ contas, saldos, lancamentos }) {
  const receitas = lancamentos
    .filter((l) => l.tipo === 'Receita')
    .reduce((total, l) => total + l.valor, 0)

  const despesas = lancamentos
    .filter((l) => l.tipo === 'Despesa')
    .reduce((total, l) => total + l.valor, 0)

  const economia = receitas - despesas

  const saldoTotal = contas.reduce(
    (total, conta) =>
      total + (saldos[conta.nome] || 0),
    0
  )

  const orcamentoSemanal =
    Number(
      localStorage.getItem('orcamentoSemanal')
    ) || 0

  const hoje = new Date()
  const dia = hoje.getDate()

  let semanaAtual = 1

  if (dia >= 8 && dia <= 14) {
    semanaAtual = 2
  } else if (dia >= 15 && dia <= 21) {
    semanaAtual = 3
  } else if (dia >= 22) {
    semanaAtual = 4
  }

  let inicioSemana = 1

  if (semanaAtual === 2) {
    inicioSemana = 8
  } else if (semanaAtual === 3) {
    inicioSemana = 15
  } else if (semanaAtual === 4) {
    inicioSemana = 22
  }

  let fimSemana = 7

  if (semanaAtual === 2) {
    fimSemana = 14
  } else if (semanaAtual === 3) {
    fimSemana = 21
  } else if (semanaAtual === 4) {
    fimSemana = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0
    ).getDate()
  }

  const gastosSemana = lancamentos
    .filter((lancamento) => {
      if (lancamento.tipo !== 'Despesa') {
        return false
      }

      const data = new Date(
        `${lancamento.data}T00:00:00`
      )

      return (
        data.getFullYear() === hoje.getFullYear() &&
        data.getMonth() === hoje.getMonth() &&
        data.getDate() >= inicioSemana &&
        data.getDate() <= fimSemana
      )
    })
    .reduce(
      (total, lancamento) =>
        total + lancamento.valor,
      0
    )

  const restanteSemana =
    orcamentoSemanal - gastosSemana

  const porcentagemSemana =
    orcamentoSemanal > 0
      ? Math.min(
          (gastosSemana /
            orcamentoSemanal) *
            100,
          100
        )
      : 0

  function moeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <div className="dashboard">

      {/* CABEÇALHO */}

      <header className="page-header">

        <div>
          <p className="greeting">
            Visão geral
          </p>

          <h2>
            Olá! 👋
          </h2>

          <span className="page-description">
            Aqui está sua situação financeira.
          </span>
        </div>

      </header>

      {/* RESUMO */}

      <section className="dashboard-cards">

        <div className="dashboard-card">

          <span>
            Receitas
          </span>

          <strong className="positive">
            {moeda(receitas)}
          </strong>

        </div>

        <div className="dashboard-card">

          <span>
            Despesas
          </span>

          <strong className="negative">
            {moeda(despesas)}
          </strong>

        </div>

        <div className="dashboard-card highlight">

          <span>
            Economia
          </span>

          <strong>
            {moeda(economia)}
          </strong>

        </div>

      </section>

      {/* SALDO TOTAL */}

      <section className="panel balance-panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              Meu dinheiro
            </span>

            <h3>
              Saldo total
            </h3>

          </div>

          <strong className="total-balance">
            {moeda(saldoTotal)}
          </strong>

        </div>

      </section>

      {/* ORÇAMENTO SEMANAL */}

      <section className="panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              Semana {semanaAtual}
            </span>

            <h3>
              Orçamento semanal
            </h3>

          </div>

          <strong>
            {moeda(orcamentoSemanal)}
          </strong>

        </div>

        <div className="analysis-summary">

          <div>

            <span>
              Orçamento
            </span>

            <strong>
              {moeda(orcamentoSemanal)}
            </strong>

          </div>

          <div>

            <span>
              Gasto
            </span>

            <strong className="negative">
              {moeda(gastosSemana)}
            </strong>

          </div>

          <div>

            <span>
              Disponível
            </span>

            <strong
              className={
                restanteSemana >= 0
                  ? 'positive'
                  : 'negative'
              }
            >
              {moeda(restanteSemana)}
            </strong>

          </div>

        </div>

        <div className="category-bar">

          <div
            className="category-fill"
            style={{
              width: `${porcentagemSemana}%`,
            }}
          />

        </div>

      </section>

      {/* CONTAS */}

      <section className="panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              Contas
            </span>

            <h3>
              Minhas contas
            </h3>

          </div>

        </div>

        <div className="account-list">

          {contas.map((conta) => (

            <div
              className="account"
              key={conta.id}
            >

              <div className="account-icon">
                {conta.nome.charAt(0)}
              </div>

              <div>

                <strong>
                  {conta.nome}
                </strong>

                <small>
                  {conta.tipo}
                </small>

              </div>

              <b>
                {moeda(
                  saldos[conta.nome] || 0
                )}
              </b>

            </div>

          ))}

        </div>

      </section>

      {/* ÚLTIMOS LANÇAMENTOS */}

      <section className="panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              Atividade
            </span>

            <h3>
              Últimos lançamentos
            </h3>

          </div>

        </div>

        {lancamentos.length === 0 ? (

          <div className="empty">

            <strong>
              Nenhum lançamento
            </strong>

            <small>
              Seus lançamentos aparecerão aqui.
            </small>

          </div>

        ) : (

          <div className="transaction-list">

            {lancamentos
              .slice(0, 5)
              .map((lancamento) => {

                const receita =
                  lancamento.tipo === 'Receita'

                const transferencia =
                  lancamento.tipo ===
                  'Transferência'

                return (
                  <div
                    className="transaction"
                    key={lancamento.id}
                  >

                    <div className="transaction-icon">

                      {transferencia
                        ? '↔'
                        : receita
                        ? '+'
                        : '-'}

                    </div>

                    <div className="transaction-info">

                      <strong>
                        {lancamento.categoria}
                      </strong>

                      <small>

                        {transferencia
                          ? `${lancamento.conta} → ${lancamento.contaDestino}`
                          : lancamento.conta}

                      </small>

                    </div>

                    <div className="transaction-value">

                      <strong
                        className={
                          receita
                            ? 'positive'
                            : transferencia
                            ? ''
                            : 'negative'
                        }
                      >

                        {receita
                          ? '+'
                          : transferencia
                          ? ''
                          : '-'}{' '}

                        {moeda(
                          lancamento.valor
                        )}

                      </strong>

                    </div>

                  </div>
                )
              })}

          </div>

        )}

      </section>

    </div>
  )
}

export default Dashboard
