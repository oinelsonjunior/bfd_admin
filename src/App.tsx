import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Diaristas } from './pages/Diaristas';
import { Clientes } from './pages/Clientes';
import { TiposServico } from './pages/TiposServico';

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
          <Route path="servicos" element={<TiposServico />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
