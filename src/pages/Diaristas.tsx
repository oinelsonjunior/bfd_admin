import { useEffect, useState } from 'react';
import { adminApi } from '../api';

export function Diaristas() {
  const [diaristas, setDiaristas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'pendentes' | 'aprovadas'>('todas');
  const [loading, setLoading] = useState(true);

  const carregar = async () => {
    setLoading(true);
    const aprovadas = filtro === 'aprovadas' ? true : filtro === 'pendentes' ? false : undefined;
    const res = await adminApi.diaristas(aprovadas);
    setDiaristas(res.data);
    setLoading(false);
  };

  useEffect(() => { carregar(); }, [filtro]);

  const aprovar = async (id: string) => {
    await adminApi.aprovar(id);
    carregar();
  };

  const reprovar = async (id: string) => {
    if (!confirm('Reprovar esta diarista?')) return;
    await adminApi.reprovar(id);
    carregar();
  };

  const bloquear = async (id: string, ativo: boolean) => {
    if (!confirm(ativo ? 'Bloquear esta diarista?' : 'Desbloquear esta diarista?')) return;
    if (ativo) await adminApi.bloquear(id);
    else await adminApi.desbloquear(id);
    carregar();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Diaristas</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Gerencie e aprove as diaristas da plataforma</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {(['todas', 'pendentes', 'aprovadas'] as const).map(f => (
          <button key={f} onClick={() => setFiltro(f)}
            className={`btn ${filtro === f ? 'btn-primary' : 'btn-secondary'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Carregando...</div>
        ) : diaristas.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Nenhuma diarista encontrada.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Telefone</th>
                <th>Aprovação</th>
                <th>Conta</th>
                <th>Cadastro</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {diaristas.map(d => (
                <tr key={d.id}>
                  <td><strong>{d.nome}</strong></td>
                  <td style={{ color: 'var(--text-muted)' }}>{d.email}</td>
                  <td>{d.telefone}</td>
                  <td>
                    {d.documentoVerificado
                      ? <span className="badge badge-success">✓ Aprovada</span>
                      : <span className="badge badge-warning">⏳ Pendente</span>
                    }
                  </td>
                  <td>
                    <span className={`badge ${d.ativo ? 'badge-success' : 'badge-danger'}`}>
                      {d.ativo ? '✓ Ativa' : '✕ Bloqueada'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>
                    {new Date(d.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!d.documentoVerificado && (
                        <button className="btn btn-success btn-sm" onClick={() => aprovar(d.id)}>
                          ✓ Aprovar
                        </button>
                      )}
                      {d.documentoVerificado && (
                        <button className="btn btn-danger btn-sm" onClick={() => reprovar(d.id)}>
                          ✕ Reprovar
                        </button>
                      )}
                      <button
                        className={`btn btn-sm ${d.ativo ? 'btn-danger' : 'btn-success'}`}
                        onClick={() => bloquear(d.id, d.ativo)}>
                        {d.ativo ? '🔒' : '🔓'}
                      </button>
                    </div>
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
