import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '@/layouts/DashboardLayout'
import Dashboard from '@/pages/Dashboard'
import Comissoes from '@/pages/loja/Comissoes'
import Descontos from '@/pages/loja/Descontos'
import MetasVenda from '@/pages/loja/MetasVenda'
import GestaoIMEI from '@/pages/cadastro/GestaoIMEI'
import Cartao from '@/pages/cadastro/Cartao'
import GrupoPermissao from '@/pages/cadastro/GrupoPermissao'
import GrupoContas from '@/pages/cadastro/GrupoContas'
import Fornecedor from '@/pages/cadastro/Fornecedor'
import Movimentacao from '@/pages/estoque/Movimentacao'
import NfeFornecedor from '@/pages/estoque/NfeFornecedor'
import PosicaoSintetica from '@/pages/estoque/PosicaoSintetica'
import EstoqueValorizado from '@/pages/estoque/EstoqueValorizado'

function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        {/* Loja */}
        <Route path="/loja/comissoes" element={<Comissoes />} />
        <Route path="/loja/descontos" element={<Descontos />} />
        <Route path="/loja/metas-venda" element={<MetasVenda />} />
        {/* Cadastro */}
        <Route path="/cadastro/imei" element={<GestaoIMEI />} />
        <Route path="/cadastro/cartao" element={<Cartao />} />
        <Route path="/cadastro/grupo-permissao" element={<GrupoPermissao />} />
        <Route path="/cadastro/grupo-contas" element={<GrupoContas />} />
        <Route path="/cadastro/fornecedor" element={<Fornecedor />} />
        {/* Estoque */}
        <Route path="/estoque/movimentacao" element={<Movimentacao />} />
        <Route path="/estoque/nfe-fornecedor" element={<NfeFornecedor />} />
        <Route path="/estoque/posicao-sintetica" element={<PosicaoSintetica />} />
        <Route path="/estoque/estoque-valorizado" element={<EstoqueValorizado />} />
      </Route>
    </Routes>
  )
}

export default App
