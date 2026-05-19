import { useEffect, useState } from 'react';
import { adminApi } from '../api';

export function Clientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregar = () => {
    adminApi.clientes().then(r => { setClientes(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const bloquear = async (id: string, ativo: boolean) => {
    if (!confirm(ativo ? 'Bloquear este cliente?' : 'Desbloquear este cliente?')) return;
    if (ativo) await adminApi.bloquear(id);
    else await adminApi.desbloquear(id);
    carregar();
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Clientes</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Todos os clientes cadastrados na plataforma</p>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</div>
        ) : clientes.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Nenhum cliente encontrado.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Cadastro</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.nome}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{c.email}</td>
                  <td>{c.telefone}</td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <span className={`badge ${c.ativo ? 'badge-success' : 'badge-danger'}`}>
                      {c.ativo ? '✓ Ativo' : '✕ Bloqueado'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn btn-sm ${c.ativo ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => bloquear(c.id, c.ativo)}>
                      {c.ativo ? '🔒 Bloquear' : '🔓 Desbloquear'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
