import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import Descontos from "@/pages/loja/Descontos";
import MetasVenda from "@/pages/loja/MetasVenda";
import GestaoIMEI from "@/pages/cadastro/GestaoIMEI";
import Cartao from "@/pages/cadastro/Cartao";
import GrupoPermissao from "@/pages/cadastro/GrupoPermissao";
import GrupoContas from "@/pages/cadastro/GrupoContas";
import Fornecedor from "@/pages/cadastro/Fornecedor";
import Movimentacao from "@/pages/estoque/Movimentacao";
import NfeFornecedor from "@/pages/estoque/NfeFornecedor";
import PosicaoSintetica from "@/pages/estoque/PosicaoSintetica";
import EstoqueValorizado from "@/pages/estoque/EstoqueValorizado";
import Comissoes from "./pages/loja/Comissoes";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />
      <Route
        path="/esqueceu-senha"
        element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        }
      />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/loja/comissoes" element={<Comissoes />} />
        <Route path="/loja/descontos" element={<Descontos />} />
        <Route path="/loja/metas-venda" element={<MetasVenda />} />
        <Route path="/cadastro/imei" element={<GestaoIMEI />} />
        <Route path="/cadastro/cartao" element={<Cartao />} />
        <Route path="/cadastro/grupo-permissao" element={<GrupoPermissao />} />
        <Route path="/cadastro/grupo-contas" element={<GrupoContas />} />
        <Route path="/cadastro/fornecedor" element={<Fornecedor />} />
        <Route path="/estoque/movimentacao" element={<Movimentacao />} />
        <Route path="/estoque/nfe-fornecedor" element={<NfeFornecedor />} />
        <Route
          path="/estoque/posicao-sintetica"
          element={<PosicaoSintetica />}
        />
        <Route
          path="/estoque/estoque-valorizado"
          element={<EstoqueValorizado />}
        />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
