import { useEffect, useState } from 'react';
import { adminApi } from '../api';

export function Clientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [selecionado, setSelecionado] = useState<any>(null);
  const [acao, setAcao] = useState<string | null>(null);

  const carregar = () => {
    adminApi.clientes().then(r => { setClientes(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const bloquear = async (id: string, ativo: boolean) => {
    setAcao(id);
    try {
      ativo ? await adminApi.bloquear(id) : await adminApi.desbloquear(id);
      carregar();
      setSelecionado(null);
    } finally {
      setAcao(null);
    }
  };

  const filtrados = clientes.filter(c =>
    c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    c.email?.toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 24 }}>👥 Clientes</h1>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #282060' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Total</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#282060' }}>{clientes.length}</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Ativos</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{clientes.filter(c => c.ativo).length}</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Bloqueados</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{clientes.filter(c => !c.ativo).length}</div>
        </div>
      </div>

      {/* Busca */}
      <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="🔍 Buscar por nome ou email..."
        style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }} />

      {/* Tabela */}
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#282060', color: 'white' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nome</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Telefone</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Cadastro</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{c.nome}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.email}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.telefone}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ background: c.ativo ? '#d1fae5' : '#fee2e2', color: c.ativo ? '#065f46' : '#991b1b', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {c.ativo ? 'Ativo' : 'Bloqueado'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#888' }}>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center', display: 'flex', gap: 6, justifyContent: 'center' }}>
                  <button onClick={() => setSelecionado(c)} style={{ padding: '4px 10px', background: '#28206020', color: '#282060', border: '1px solid #282060', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                    Ver
                  </button>
                  <button onClick={() => bloquear(c.id, c.ativo)} disabled={acao === c.id} style={{
                    padding: '4px 10px', fontSize: 12, borderRadius: 6, cursor: 'pointer', fontWeight: 600,
                    background: c.ativo ? '#fee2e2' : '#d1fae5',
                    color: c.ativo ? '#991b1b' : '#065f46',
                    border: `1px solid ${c.ativo ? '#ef4444' : '#10b981'}`,
                  }}>
                    {acao === c.id ? '...' : c.ativo ? 'Bloquear' : 'Desbloquear'}
                  </button>
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Nenhum cliente encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal detalhe */}
      {selecionado && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: 480, maxWidth: '90vw' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: '#282060' }}>👤 {selecionado.nome}</h2>
              <button onClick={() => setSelecionado(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div><strong>Email:</strong> {selecionado.email}</div>
              <div><strong>Telefone:</strong> {selecionado.telefone}</div>
              <div><strong>CPF:</strong> {selecionado.cpf ?? '—'}</div>
              <div><strong>Status:</strong> {selecionado.ativo ? '✅ Ativo' : '❌ Bloqueado'}</div>
              <div><strong>Cadastro:</strong> {new Date(selecionado.createdAt).toLocaleString('pt-BR')}</div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 24 }}>
              <button onClick={() => bloquear(selecionado.id, selecionado.ativo)} style={{
                flex: 1, padding: '10px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                background: selecionado.ativo ? '#ef4444' : '#10b981', color: 'white',
              }}>
                {selecionado.ativo ? '🚫 Bloquear' : '✅ Desbloquear'}
              </button>
              <button onClick={() => setSelecionado(null)} style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', background: 'white' }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
