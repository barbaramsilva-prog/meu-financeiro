import { useEffect, useState } from 'react'

function Configuracoes() {
  const [salario, setSalario] = useState(() => {
    return localStorage.getItem('salario') || ''
  })

  const [metaEconomia, setMetaEconomia] = useState(() => {
    return localStorage.getItem('metaEconomia') || ''
  })

  const [orcamentoSemanal, setOrcamentoSemanal] =
    useState(() => {
      return (
        localStorage.getItem('orcamentoSemanal') || ''
      )
    })

  useEffect(() => {
    localStorage.setItem('salario', salario)
  }, [salario])

  useEffect(() => {
    localStorage.setItem(
      'metaEconomia',
      metaEconomia
    )
  }, [metaEconomia])

  useEffect(() => {
    localStorage.setItem(
      'orcamentoSemanal',
      orcamentoSemanal
    )
  }, [orcamentoSemanal])

  return (
    <div className="configuracoes-page">

      <header className="page-header">

        <div>
          <p className="greeting">
            Personalização
          </p>

          <h2>Configurações</h2>

          <span className="page-description">
            Configure suas metas financeiras.
          </span>
        </div>

      </header>

      <section className="panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              Planejamento
            </span>

            <h3>
              Metas financeiras
            </h3>
          </div>

        </div>

        <div className="form-grid">

          <div className="form-group">

            <label>
              Salário mensal
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex.: 3000"
              value={salario}
              onChange={(event) =>
                setSalario(event.target.value)
              }
            />

            <small>
              Sua renda mensal aproximada.
            </small>

          </div>

          <div className="form-group">

            <label>
              Meta de economia
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex.: 500"
              value={metaEconomia}
              onChange={(event) =>
                setMetaEconomia(
                  event.target.value
                )
              }
            />

            <small>
              Quanto você deseja guardar por mês.
            </small>

          </div>

          <div className="form-group">

            <label>
              Orçamento semanal
            </label>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Ex.: 200"
              value={orcamentoSemanal}
              onChange={(event) =>
                setOrcamentoSemanal(
                  event.target.value
                )
              }
            />

            <small>
              Limite de gastos por semana.
            </small>

          </div>

        </div>

      </section>

      <section className="panel">

        <div className="panel-header">

          <div>
            <span className="panel-label">
              Informações
            </span>

            <h3>
              Como funciona
            </h3>
          </div>

        </div>

        <div className="settings-info">

          <p>
            O salário serve como referência para
            seu planejamento.
          </p>

          <p>
            A meta de economia mostra quanto você
            pretende guardar todos os meses.
          </p>

          <p>
            O orçamento semanal ajuda a controlar
            quanto você pode gastar durante a semana.
          </p>

        </div>

      </section>

    </div>
  )
}

export default Configuracoes
