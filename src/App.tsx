import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Diaristas } from './pages/Diaristas';
import { Clientes } from './pages/Clientes';
import { TiposServico } from './pages/TiposServico';
import { Servicos } from './pages/Servicos';
import { Pagamentos } from './pages/Pagamentos';
import { PushNotificacoes } from './pages/PushNotificacoes';
import { Relatorios } from './pages/Relatorios';
import { Avaliacoes } from './pages/Avaliacoes';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  return token ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="diaristas" element={<Diaristas />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="servicos" element={<Servicos />} />
          <Route path="tipos-servico" element={<TiposServico />} />
          <Route path="pagamentos" element={<Pagamentos />} />
          <Route path="push" element={<PushNotificacoes />} />
          <Route path="relatorios" element={<Relatorios />} />
          <Route path="avaliacoes" element={<Avaliacoes />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
