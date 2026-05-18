import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErro('');
    try {
      const res = await authApi.login(email, senha);
      if (res.data.user.role !== 'admin') {
        setErro('Acesso restrito a administradores.');
        return;
      }
      localStorage.setItem('admin_token', res.data.accessToken);
      navigate('/');
    } catch {
      setErro('E-mail ou senha incorretos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--navy)',
    }}>
      <div style={{ width: 360 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40 }}>🏠</div>
          <h1 style={{ color: 'white', fontSize: 24, fontWeight: 700, marginTop: 8 }}>Bem Feito Diaristas</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Painel Administrativo</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>E-mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            {erro && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{erro}</p>}
            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px' }} disabled={loading}>
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
