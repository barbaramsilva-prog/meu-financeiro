function Analises({ lancamentos }) {
  const receitas = lancamentos
    .filter((l) => l.tipo === 'Receita')
    .reduce((total, l) => total + l.valor, 0)

  const despesas = lancamentos
    .filter((l) => l.tipo === 'Despesa')
    .reduce((total, l) => total + l.valor, 0)

  const categorias = {}

  lancamentos
    .filter((l) => l.tipo === 'Despesa')
    .forEach((lancamento) => {
      if (!categorias[lancamento.categoria]) {
        categorias[lancamento.categoria] = 0
      }

      categorias[lancamento.categoria] +=
        lancamento.valor
    })

  const gastosPorCategoria = Object.entries(
    categorias
  ).sort((a, b) => b[1] - a[1])

  const maiorGasto =
    gastosPorCategoria.length > 0
      ? gastosPorCategoria[0][1]
      : 0

  function moeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <div className="analises-page">

      <header className="page-header">

        <div>
          <p className="greeting">
            Visão financeira
          </p>

          <h2>Análises</h2>

          <span className="page-description">
            Entenda para onde seu dinheiro está indo.
          </span>
        </div>

      </header>

      <section className="dashboard-cards">

        <div className="dashboard-card">
          <span>Receitas</span>

          <strong className="positive">
            {moeda(receitas)}
          </strong>
        </div>

        <div className="dashboard-card">
          <span>Despesas</span>

          <strong className="negative">
            {moeda(despesas)}
          </strong>
        </div>

        <div className="dashboard-card highlight">
          <span>Economia</span>

          <strong>
            {moeda(receitas - despesas)}
          </strong>
        </div>

      </section>

      <section className="panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              Despesas
            </span>

            <h3>
              Gastos por categoria
            </h3>
          </div>

        </div>

        {gastosPorCategoria.length === 0 ? (

          <div className="empty">

            <strong>
              Nenhuma despesa registrada
            </strong>

            <small>
              Quando você registrar gastos,
              eles aparecerão aqui.
            </small>

          </div>

        ) : (

          <div className="category-list">

            {gastosPorCategoria.map(
              ([categoria, valor]) => {

                const porcentagem =
                  maiorGasto > 0
                    ? (valor / maiorGasto) * 100
                    : 0

                return (
                  <div
                    className="category-item"
                    key={categoria}
                  >

                    <div className="category-header">

                      <strong>
                        {categoria}
                      </strong>

                      <span>
                        {moeda(valor)}
                      </span>

                    </div>

                    <div className="category-bar">

                      <div
                        className="category-fill"
                        style={{
                          width: `${porcentagem}%`,
                        }}
                      />

                    </div>

                  </div>
                )
              }
            )}

          </div>

        )}

      </section>

      <section className="panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              Resumo
            </span>

            <h3>
              Receitas × Despesas
            </h3>
          </div>

        </div>

        <div className="analysis-summary">

          <div>
            <span>Entrou</span>

            <strong className="positive">
              {moeda(receitas)}
            </strong>
          </div>

          <div>
            <span>Saiu</span>

            <strong className="negative">
              {moeda(despesas)}
            </strong>
          </div>

          <div>
            <span>Resultado</span>

            <strong>
              {moeda(receitas - despesas)}
            </strong>
          </div>

        </div>

      </section>

    </div>
  )
}

export default Analises
