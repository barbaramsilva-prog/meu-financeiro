import { useEffect, useState } from 'react'

function Cartoes({
  contas,
  saldos,
  lancamentos,
  setLancamentos,
}) {
  const [cartoes, setCartoes] = useState(() => {
    const dadosSalvos = localStorage.getItem('cartoes')

    if (dadosSalvos) {
      return JSON.parse(dadosSalvos)
    }

    return [
      {
        id: 1,
        nome: 'Cartão NuBank',
        fatura: 0,
        compras: [],
      },
      {
        id: 2,
        nome: 'Cartão Itaú',
        fatura: 0,
        compras: [],
      },
    ]
  })

  const [cartaoCompra, setCartaoCompra] =
    useState(null)

  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')

  const [cartaoPagamento, setCartaoPagamento] =
    useState(null)

  const [valorPagamento, setValorPagamento] =
    useState('')

  const [contaPagamento, setContaPagamento] =
    useState('')

  useEffect(() => {
    localStorage.setItem(
      'cartoes',
      JSON.stringify(cartoes)
    )
  }, [cartoes])

  function moeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }

  function abrirCompra(cartaoId) {
    setCartaoCompra(cartaoId)
    setCartaoPagamento(null)
    setDescricao('')
    setValor('')
  }

  function fecharCompra() {
    setCartaoCompra(null)
    setDescricao('')
    setValor('')
  }

  function adicionarCompra(event) {
    event.preventDefault()

    if (!descricao.trim()) {
      alert('Digite a descrição da compra.')
      return
    }

    if (!valor) {
      alert('Digite o valor da compra.')
      return
    }

    const valorCompra = Number(valor)

    if (valorCompra <= 0) {
      alert('Digite um valor maior que zero.')
      return
    }

    const novaCompra = {
      id: Date.now(),
      descricao: descricao.trim(),
      valor: valorCompra,
    }

    setCartoes((cartoesAtuais) =>
      cartoesAtuais.map((cartao) => {
        if (cartao.id !== cartaoCompra) {
          return cartao
        }

        return {
          ...cartao,
          fatura:
            cartao.fatura + valorCompra,
          compras: [
            ...cartao.compras,
            novaCompra,
          ],
        }
      })
    )

    fecharCompra()
  }

  function abrirPagamento(cartao) {
    if (cartao.fatura <= 0) {
      alert('A fatura está zerada.')
      return
    }

    setCartaoPagamento(cartao.id)
    setCartaoCompra(null)
    setValorPagamento(
      cartao.fatura.toFixed(2)
    )
    setContaPagamento('')
  }

  function fecharPagamento() {
    setCartaoPagamento(null)
    setValorPagamento('')
    setContaPagamento('')
  }

  function pagarFatura(event) {
    event.preventDefault()

    const cartao = cartoes.find(
      (item) => item.id === cartaoPagamento
    )

    if (!cartao) {
      return
    }

    if (!contaPagamento) {
      alert(
        'Escolha a conta usada para pagar.'
      )
      return
    }

    const pagamento = Number(valorPagamento)

    if (!pagamento || pagamento <= 0) {
      alert('Digite um valor válido.')
      return
    }

    if (pagamento > cartao.fatura) {
      alert(
        'O pagamento não pode ser maior que a fatura.'
      )
      return
    }

    const saldoDisponivel =
      saldos[contaPagamento] || 0

    if (pagamento > saldoDisponivel) {
      alert(
        `Saldo insuficiente na conta ${contaPagamento}.`
      )
      return
    }

    const novoLancamento = {
      id: Date.now(),
      tipo: 'Despesa',
      categoria: 'Pagamento de cartão',
      conta: contaPagamento,
      valor: pagamento,
      data: new Date()
        .toISOString()
        .split('T')[0],
      descricao:
        `Pagamento da fatura - ${cartao.nome}`,
    }

    setLancamentos([
      ...lancamentos,
      novoLancamento,
    ])

    setCartoes((cartoesAtuais) =>
      cartoesAtuais.map((item) => {
        if (item.id !== cartaoPagamento) {
          return item
        }

        return {
          ...item,
          fatura:
            item.fatura - pagamento,
        }
      })
    )

    fecharPagamento()

    alert('Pagamento realizado com sucesso!')
  }

  return (
    <div className="cartoes-page">

      <header className="page-header">

        <div>

          <p className="greeting">
            Cartões
          </p>

          <h2>
            Meus cartões
          </h2>

          <span className="page-description">
            Acompanhe suas faturas e compras.
          </span>

        </div>

      </header>

      {/* CARTÕES */}

      <section className="dashboard-cards">

        {cartoes.map((cartao) => (

          <div
            className="dashboard-card"
            key={cartao.id}
          >

            <span>
              {cartao.nome}
            </span>

            <strong>
              {moeda(cartao.fatura)}
            </strong>

            <small>
              Fatura atual
            </small>

            <button
              type="button"
              className="primary-button"
              onClick={() =>
                abrirCompra(cartao.id)
              }
            >
              + Compra
            </button>

            <button
              type="button"
              className="secondary-button"
              onClick={() =>
                abrirPagamento(cartao)
              }
            >
              Pagar fatura
            </button>

          </div>

        ))}

      </section>

      {/* FORMULÁRIO DE COMPRA */}

      {cartaoCompra !== null && (

        <section className="panel form-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                Nova compra
              </span>

              <h3>
                Adicionar compra
              </h3>

            </div>

            <button
              type="button"
              className="close-button"
              onClick={fecharCompra}
            >
              ×
            </button>

          </div>

          <form onSubmit={adicionarCompra}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Descrição
                </label>

                <input
                  type="text"
                  placeholder="Ex.: Mercado"
                  value={descricao}
                  onChange={(event) =>
                    setDescricao(
                      event.target.value
                    )
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Valor
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="150"
                  value={valor}
                  onChange={(event) =>
                    setValor(
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
                onClick={fecharCompra}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Adicionar compra
              </button>

            </div>

          </form>

        </section>

      )}

      {/* PAGAMENTO */}

      {cartaoPagamento !== null && (

        <section className="panel form-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                Pagamento
              </span>

              <h3>
                Pagar fatura
              </h3>

            </div>

            <button
              type="button"
              className="close-button"
              onClick={fecharPagamento}
            >
              ×
            </button>

          </div>

          <form onSubmit={pagarFatura}>

            <div className="form-grid">

              <div className="form-group">

                <label>
                  Conta usada para pagar
                </label>

                <select
                  value={contaPagamento}
                  onChange={(event) =>
                    setContaPagamento(
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    Selecione uma conta
                  </option>

                  {contas.map((conta) => (

                    <option
                      key={conta.id}
                      value={conta.nome}
                    >
                      {conta.nome} —{' '}
                      {moeda(
                        saldos[conta.nome] || 0
                      )}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>
                  Valor do pagamento
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={valorPagamento}
                  onChange={(event) =>
                    setValorPagamento(
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
                onClick={fecharPagamento}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="primary-button"
              >
                Confirmar pagamento
              </button>

            </div>

          </form>

        </section>

      )}

      {/* COMPRAS */}

      <section className="panel">

        <div className="panel-header">

          <div>

            <span className="panel-label">
              Compras
            </span>

            <h3>
              Compras dos cartões
            </h3>

          </div>

        </div>

        {cartoes.every(
          (cartao) =>
            cartao.compras.length === 0
        ) ? (

          <div className="empty">

            <strong>
              Nenhuma compra ainda
            </strong>

            <small>
              As compras dos cartões
              aparecerão aqui.
            </small>

          </div>

        ) : (

          <div className="transaction-list">

            {cartoes.map((cartao) =>
              cartao.compras.map(
                (compra) => (

                  <div
                    className="transaction"
                    key={`${cartao.id}-${compra.id}`}
                  >

                    <div className="transaction-icon">
                      💳
                    </div>

                    <div className="transaction-info">

                      <strong>
                        {compra.descricao}
                      </strong>

                      <small>
                        {cartao.nome}
                      </small>

                    </div>

                    <div className="transaction-value">

                      <strong className="negative">
                        - {moeda(compra.valor)}
                      </strong>

                    </div>

                  </div>

                )
              )
            )}

          </div>

        )}

      </section>

    </div>
  )
}

export default Cartoes
