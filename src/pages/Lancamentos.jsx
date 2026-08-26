import { useState } from 'react'

const categorias = [
  'Salário',
  'Rendimento',
  'Reembolso',
  'Mercado',
  'Alimentação',
  'Uber',
  'Gasolina',
  'Saúde',
  'Rolê',
  'Educação',
  'Assinaturas',
  'Roupas',
  'Perfumaria',
  'Casa',
  'Família',
  'Babi',
  'Show',
  'Outros',
]

function Lancamentos({
  lancamentos,
  setLancamentos,
  contas,
}) {
  const [mostrarFormulario, setMostrarFormulario] =
    useState(false)

  const [formulario, setFormulario] = useState({
    tipo: 'Despesa',
    categoria: '',
    conta: '',
    contaDestino: '',
    valor: '',
    data: '',
    descricao: '',
  })

  function alterarCampo(event) {
    const { name, value } = event.target

    setFormulario({
      ...formulario,
      [name]: value,
    })
  }

  function salvarLancamento(event) {
    event.preventDefault()

    if (
      !formulario.categoria ||
      !formulario.conta ||
      !formulario.valor ||
      !formulario.data
    ) {
      alert('Preencha os campos obrigatórios.')
      return
    }

    if (Number(formulario.valor) <= 0) {
      alert('Digite um valor maior que zero.')
      return
    }

    if (
      formulario.tipo === 'Transferência' &&
      !formulario.contaDestino
    ) {
      alert('Escolha a conta de destino.')
      return
    }

    const novoLancamento = {
      id: Date.now(),
      ...formulario,
      valor: Number(formulario.valor),
    }

    setLancamentos([
      novoLancamento,
      ...lancamentos,
    ])

    setFormulario({
      tipo: 'Despesa',
      categoria: '',
      conta: '',
      contaDestino: '',
      valor: '',
      data: '',
      descricao: '',
    })

    setMostrarFormulario(false)
  }

  function excluirLancamento(id) {
    setLancamentos(
      lancamentos.filter(
        (lancamento) => lancamento.id !== id
      )
    )
  }

  function moeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  const receitas = lancamentos
    .filter(
      (lancamento) =>
        lancamento.tipo === 'Receita'
    )
    .reduce(
      (total, lancamento) =>
        total + lancamento.valor,
      0
    )

  const despesas = lancamentos
    .filter(
      (lancamento) =>
        lancamento.tipo === 'Despesa'
    )
    .reduce(
      (total, lancamento) =>
        total + lancamento.valor,
      0
    )

  return (
    <div className="lancamentos-page">

      <header className="page-header">
        <div>
          <p className="greeting">
            Movimentações
          </p>

          <h2>Lançamentos</h2>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            setMostrarFormulario(
              !mostrarFormulario
            )
          }
        >
          + Novo lançamento
        </button>
      </header>

      <section className="summary-row">

        <div className="summary-card">
          <span>Receitas</span>

          <strong className="positive">
            {moeda(receitas)}
          </strong>
        </div>

        <div className="summary-card">
          <span>Despesas</span>

          <strong className="negative">
            {moeda(despesas)}
          </strong>
        </div>

        <div className="summary-card">
          <span>Resultado</span>

          <strong>
            {moeda(receitas - despesas)}
          </strong>
        </div>

      </section>

      {mostrarFormulario && (
        <section className="form-panel">

          <div className="panel-header">

            <div>
              <span className="panel-label">
                Novo lançamento
              </span>

              <h3>
                Adicionar movimentação
              </h3>
            </div>

            <button
              className="close-button"
              onClick={() =>
                setMostrarFormulario(false)
              }
            >
              ×
            </button>

          </div>

          <form onSubmit={salvarLancamento}>

            <div className="form-grid">

              <div className="form-group">
                <label>Tipo *</label>

                <select
                  name="tipo"
                  value={formulario.tipo}
                  onChange={alterarCampo}
                >
                  <option value="Receita">
                    Receita
                  </option>

                  <option value="Despesa">
                    Despesa
                  </option>

                  <option value="Transferência">
                    Transferência
                  </option>
                </select>
              </div>

              <div className="form-group">
                <label>Categoria *</label>

                <select
                  name="categoria"
                  value={formulario.categoria}
                  onChange={alterarCampo}
                >
                  <option value="">
                    Selecione
                  </option>

                  {categorias.map(
                    (categoria) => (
                      <option
                        key={categoria}
                        value={categoria}
                      >
                        {categoria}
                      </option>
                    )
                  )}

                  {formulario.tipo ===
                    'Transferência' && (
                    <option value="Transferência">
                      Transferência
                    </option>
                  )}
                </select>
              </div>

              <div className="form-group">
                <label>
                  {formulario.tipo ===
                  'Transferência'
                    ? 'Conta de origem *'
                    : 'Conta *'}
                </label>

                <select
                  name="conta"
                  value={formulario.conta}
                  onChange={alterarCampo}
                >
                  <option value="">
                    Selecione
                  </option>

                  {contas.map((conta) => (
                    <option
                      key={conta.id}
                      value={conta.nome}
                    >
                      {conta.nome}
                    </option>
                  ))}
                </select>
              </div>

              {formulario.tipo ===
                'Transferência' && (
                <div className="form-group">
                  <label>
                    Conta de destino *
                  </label>

                  <select
                    name="contaDestino"
                    value={
                      formulario.contaDestino
                    }
                    onChange={alterarCampo}
                  >
                    <option value="">
                      Selecione
                    </option>

                    {contas.map((conta) => (
                      <option
                        key={conta.id}
                        value={conta.nome}
                      >
                        {conta.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Valor *</label>

                <input
                  type="number"
                  name="valor"
                  min="0"
                  step="0.01"
                  placeholder="1000"
                  value={formulario.valor}
                  onChange={alterarCampo}
                />
              </div>

              <div className="form-group">
                <label>Data *</label>

                <input
                  type="date"
                  name="data"
                  value={formulario.data}
                  onChange={alterarCampo}
                />
              </div>

              <div className="form-group">
                <label>Descrição</label>

                <input
                  type="text"
                  name="descricao"
                  placeholder="Ex.: compras do mês"
                  value={formulario.descricao}
                  onChange={alterarCampo}
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
                Salvar
              </button>

            </div>

          </form>

        </section>
      )}

      <section className="panel transactions-panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              Histórico
            </span>

            <h3>
              Meus lançamentos
            </h3>
          </div>

          <span className="transaction-count">
            {lancamentos.length} lançamento(s)
          </span>

        </div>

        {lancamentos.length === 0 ? (

          <div className="empty">

            <span>＋</span>

            <strong>
              Nenhum lançamento ainda
            </strong>

            <small>
              Adicione sua primeira
              movimentação.
            </small>

          </div>

        ) : (

          <div className="transaction-list">

            {lancamentos.map(
              (lancamento) => {

                const transferencia =
                  lancamento.tipo ===
                  'Transferência'

                const receita =
                  lancamento.tipo ===
                  'Receita'

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

                      {lancamento.descricao && (
                        <small>
                          {lancamento.descricao}
                        </small>
                      )}

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

                      <small>
                        {lancamento.data}
                      </small>

                    </div>

                    <button
                      className="delete-button"
                      onClick={() =>
                        excluirLancamento(
                          lancamento.id
                        )
                      }
                    >
                      Excluir
                    </button>

                  </div>
                )
              }
            )}

          </div>

        )}

      </section>

    </div>
  )
}

export default Lancamentos
