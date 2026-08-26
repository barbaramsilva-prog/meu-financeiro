function Patrimonio({ contas, saldos }) {
  const totalContas = contas.reduce(
    (total, conta) =>
      total + (saldos[conta.nome] || 0),
    0
  )

  function moeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  return (
    <div className="patrimonio-page">

      <header className="page-header">
        <div>
          <p className="greeting">
            Meu patrimônio
          </p>

          <h2>Patrimônio</h2>

          <span className="page-description">
            Veja quanto você possui atualmente.
          </span>
        </div>
      </header>

      <section className="balance-panel panel">

        <span className="panel-label">
          Patrimônio atual
        </span>

        <strong className="big-balance">
          {moeda(totalContas)}
        </strong>

        <small>
          Soma dos saldos das suas contas
        </small>

      </section>

      <section className="panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              Seus recursos
            </span>

            <h3>
              Onde está seu dinheiro
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

    </div>
  )
}

export default Patrimonio
