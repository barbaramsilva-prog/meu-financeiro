import { useEffect, useState } from 'react'

import Dashboard from './pages/Dashboard'
import Lancamentos from './pages/Lancamentos'
import Contas from './pages/Contas'
import Cartoes from './pages/Cartoes'
import Patrimonio from './pages/Patrimonio'
import Analises from './pages/Analises'
import Configuracoes from './pages/Configuracoes'

import {
  contasIniciais,
  lancamentosIniciais,
} from './data/initialData'

import './App.css'

function App() {
  const [pagina, setPagina] = useState('dashboard')

  const [contas, setContas] = useState(() => {
    const dadosSalvos = localStorage.getItem('contas')

    return dadosSalvos
      ? JSON.parse(dadosSalvos)
      : contasIniciais
  })

  const [lancamentos, setLancamentos] = useState(() => {
    const dadosSalvos =
      localStorage.getItem('lancamentos')

    return dadosSalvos
      ? JSON.parse(dadosSalvos)
      : lancamentosIniciais
  })

  useEffect(() => {
    localStorage.setItem(
      'contas',
      JSON.stringify(contas)
    )
  }, [contas])

  useEffect(() => {
    localStorage.setItem(
      'lancamentos',
      JSON.stringify(lancamentos)
    )
  }, [lancamentos])

  function calcularSaldos() {
    const saldos = {}

    contas.forEach((conta) => {
      saldos[conta.nome] = conta.saldoInicial
    })

    lancamentos.forEach((lancamento) => {
      const {
        tipo,
        conta,
        contaDestino,
        valor,
      } = lancamento

      if (tipo === 'Receita') {
        if (saldos[conta] !== undefined) {
          saldos[conta] += valor
        }
      }

      if (tipo === 'Despesa') {
        if (saldos[conta] !== undefined) {
          saldos[conta] -= valor
        }
      }

      if (tipo === 'Transferência') {
        if (saldos[conta] !== undefined) {
          saldos[conta] -= valor
        }

        if (
          saldos[contaDestino] !== undefined
        ) {
          saldos[contaDestino] += valor
        }
      }
    })

    return saldos
  }

  const saldos = calcularSaldos()

  function renderizarPagina() {
    if (pagina === 'dashboard') {
      return (
        <Dashboard
          contas={contas}
          saldos={saldos}
          lancamentos={lancamentos}
        />
      )
    }

    if (pagina === 'lancamentos') {
      return (
        <Lancamentos
          lancamentos={lancamentos}
          setLancamentos={setLancamentos}
          contas={contas}
        />
      )
    }

    if (pagina === 'contas') {
      return (
        <Contas
          contas={contas}
          setContas={setContas}
          saldos={saldos}
        />
      )
    }

    if (pagina === 'cartoes') {
      return (
        <Cartoes
          contas={contas}
          setContas={setContas}
          saldos={saldos}
          lancamentos={lancamentos}
          setLancamentos={setLancamentos}
        />
      )
    }

    if (pagina === 'patrimonio') {
      return (
        <Patrimonio
          contas={contas}
          saldos={saldos}
          lancamentos={lancamentos}
        />
      )
    }

    if (pagina === 'analises') {
      return (
        <Analises
          contas={contas}
          saldos={saldos}
          lancamentos={lancamentos}
        />
      )
    }

    if (pagina === 'configuracoes') {
      return <Configuracoes />
    }

    return null
  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logo">
          <span>✿</span>

          <h1>Meu Financeiro</h1>
        </div>

        <nav>

          <button
            className={`nav-item ${
              pagina === 'dashboard'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPagina('dashboard')
            }
          >
            ⌂
            <span>Início</span>
          </button>

          <button
            className={`nav-item ${
              pagina === 'lancamentos'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPagina('lancamentos')
            }
          >
            ＋
            <span>Lançamentos</span>
          </button>

          <button
            className={`nav-item ${
              pagina === 'contas'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPagina('contas')
            }
          >
            🏦
            <span>Contas</span>
          </button>

          <button
            className={`nav-item ${
              pagina === 'cartoes'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPagina('cartoes')
            }
          >
            ▣
            <span>Cartões</span>
          </button>

          <button
            className={`nav-item ${
              pagina === 'patrimonio'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPagina('patrimonio')
            }
          >
            ◉
            <span>Patrimônio</span>
          </button>

          <button
            className={`nav-item ${
              pagina === 'analises'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPagina('analises')
            }
          >
            ◌
            <span>Análises</span>
          </button>

          <button
            className={`nav-item ${
              pagina === 'configuracoes'
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setPagina('configuracoes')
            }
          >
            ⚙
            <span>Configurações</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <span>Meu Financeiro</span>

          <small>
            Controle simples das suas finanças
          </small>

        </div>

      </aside>

      <main className="main">
        {renderizarPagina()}
      </main>

    </div>
  )
}

export default App
