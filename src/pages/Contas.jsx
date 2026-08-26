import { useState } from 'react'

function Contas({ contas, setContas, saldos }) {
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState('Conta bancária')
  const [saldoInicial, setSaldoInicial] = useState('')

  function adicionarConta(event) {
    event.preventDefault()

    if (!nome.trim()) {
      alert('Digite o nome da conta.')
      return
    }

    const novaConta = {
      id: Date.now(),
      nome: nome.trim(),
      tipo,
      saldoInicial: Number(saldoInicial) || 0,
    }

    setContas([...contas, novaConta])

    setNome('')
    setTipo('Conta bancária')
    setSaldoInicial('')
    setMostrarFormulario(false)
  }

  function excluirConta(id) {
    const confirmar = window.confirm(
      'Deseja realmente excluir esta conta?'
    )

    if (!confirmar) return

    setContas(
      contas.filter((conta) => conta.id !== id)
    )
  }

  function moeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const saldoTotal = contas.reduce(
    (total, conta) =>
      total + (saldos[conta.nome] || 0),
    0
  )

  return (
    <div className="contas-page">

      <header className="page-header">

        <div>
          <p className="greeting">
            Meu dinheiro
          </p>

          <h2>Contas</h2>

          <span className="page-description">
            Veja onde seu dinheiro está.
          </span>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setMostrarFormulario(
              !mostrarFormulario
            )
          }
        >
          + Nova conta
        </button>

      </header>

      <section className="balance-panel panel">

        <span className="panel-label">
          Saldo total
        </span>

        <strong className="big-balance">
          {moeda(saldoTotal)}
        </strong>

      </section>

      {mostrarFormulario && (
        <section className="panel form-panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                Nova conta
              </span>

              <h3>
                Adicionar conta
              </h3>
            </div>

          </div>

          <form onSubmit={adicionarConta}>

            <div className="form-grid">

              <div className="form-group">
                <label>Nome *</label>

                <input
                  type="text"
                  placeholder="Ex.: Nubank"
                  value={nome}
                  onChange={(event) =>
                    setNome(event.target.value)
                  }
                />
              </div>

              <div className="form-group">
                <label>Tipo</label>

                <select
                  value={tipo}
                  onChange={(event) =>
                    setTipo(event.target.value)
                  }
                >
                  <option>
                    Conta bancária
                  </option>

                  <option>
                    Carteira
                  </option>

                  <option>
                    Investimento
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Saldo inicial</label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0"
                  value={saldoInicial}
                  onChange={(event) =>
                    setSaldoInicial(
                      event.target.value
                    )
                  }
                />
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  setMostrarFormulario(false)
                }
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Adicionar
              </button>

            </div>

          </form>

        </section>
      )}

      <section className="panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              Minhas contas
            </span>

            <h3>
              Contas cadastradas
            </h3>
          </div>

          <span className="transaction-count">
            {contas.length} conta(s)
          </span>

        </div>

        <div className="account-list">

          {contas.map((conta) => (

            <div
              className="account account-large"
              key={conta.id}
            >

              <div className="account-icon">
                {conta.nome.charAt(0)}
              </div>

              <div className="account-info">

                <strong>
                  {conta.nome}
                </strong>

                <small>
                  {conta.tipo}
                </small>

              </div>

              <strong className="account-balance">
                {moeda(
                  saldos[conta.nome] || 0
                )}
              </strong>

              <button
                className="delete-button"
                onClick={() =>
                  excluirConta(conta.id)
                }
              >
                Excluir
              </button>

            </div>

          ))}

        </div>

      </section>

    </div>
  )
}

export default Contas
