import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const NAV = [
  { path: '/', label: '📊 Dashboard' },
  { path: '/diaristas', label: '🧹 Diaristas' },
  { path: '/clientes', label: '👥 Clientes' },
  { path: '/servicos', label: '🗂️ Serviços' },
  { path: '/tipos-servico', label: '🔧 Tipos de Serviço' },
  { path: '/pagamentos', label: '💰 Pagamentos' },
  { path: '/push', label: '🔔 Notificações Push' },
    { path: '/relatorios', label: '📊 Relatórios' },
    { path: '/avaliacoes', label: '⭐ Avaliações' },
    { path: '/financeiro', label: '💰 Financeiro' },
    { path: '/cancelamentos', label: '❌ Cancelamentos' },
];

export function Layout() {
  const navigate = useNavigate();
  const logout = () => { localStorage.removeItem('admin_token'); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f4f5f8' }}>
      <aside style={{ width: 240, background: '#282060', color: 'white', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>🧹 Bem Feito</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>Painel Administrativo</div>
        </div>
        <nav style={{ flex: 1, padding: '16px 0' }}>
          {NAV.map(({ path, label }) => (
            <NavLink key={path} to={path} end={path === '/'} style={({ isActive }) => ({
              display: 'block', padding: '10px 20px', color: 'white', textDecoration: 'none',
              background: isActive ? 'rgba(250,125,35,0.3)' : 'transparent',
              borderLeft: isActive ? '3px solid #FA7D23' : '3px solid transparent',
              fontSize: 14, fontWeight: isActive ? 600 : 400,
            })}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: 16, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={logout} style={{
            width: '100%', padding: '10px', background: 'rgba(255,255,255,0.1)',
            color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 14,
          }}>
            🚪 Sair
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
