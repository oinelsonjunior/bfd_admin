import { Outlet, NavLink, useNavigate } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/diaristas', label: 'Diaristas', icon: '👩‍💼' },
  { to: '/clientes', label: 'Clientes', icon: '👤' },
  { to: '/servicos', label: 'Serviços', icon: '📋' },
  { to: '/tipos-servico', label: 'Tipos de Serviço', icon: '🧹' },
];

export function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{
        width: 240, background: 'var(--navy)', color: 'white',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>🏠 Bem Feito</div>
          <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>Painel Administrativo</div>
        </div>

        <nav style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 20px', fontSize: 14, fontWeight: 500,
                background: isActive ? 'rgba(250,125,35,0.2)' : 'transparent',
                color: isActive ? '#FA7D23' : 'rgba(255,255,255,0.8)',
                borderLeft: isActive ? '3px solid #FA7D23' : '3px solid transparent',
                transition: 'all 0.2s', textDecoration: 'none',
              })}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button onClick={logout} style={{
          margin: 16, padding: '10px 16px', background: 'rgba(255,255,255,0.1)',
          border: 'none', borderRadius: 8, color: 'white', fontSize: 13,
          cursor: 'pointer', textAlign: 'left',
        }}>
          🚪 Sair
        </button>
      </aside>

      <main style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: 32 }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
