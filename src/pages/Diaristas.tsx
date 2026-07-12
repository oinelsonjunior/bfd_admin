import { useEffect, useState, useRef } from 'react';
import { adminApi } from '../api';

export function Diaristas() {
  const [diaristas, setDiaristas] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<'todas' | 'aprovadas' | 'pendentes'>('todas');
  const [loading, setLoading] = useState(true);
  const [selecionada, setSelecionada] = useState<any>(null);
  const [acao, setAcao] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const carregar = (f = filtro) => {
    setLoading(true);
    const param = f === 'aprovadas' ? true : f === 'pendentes' ? false : undefined;
    adminApi.diaristas(param).then(r => { setDiaristas(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const mudarFiltro = (f: typeof filtro) => { setFiltro(f); carregar(f); };

  const aprovar = async (id: string) => {
    setAcao(id);
    try { await adminApi.aprovar(id); carregar(); setSelecionada(null); } finally { setAcao(null); }
  };

  const reprovar = async (id: string) => {
    setAcao(id);
    try { await adminApi.reprovar(id); carregar(); setSelecionada(null); } finally { setAcao(null); }
  };

  const bloquear = async (id: string, ativo: boolean) => {
    setAcao(id);
    try {
      ativo ? await adminApi.bloquear(id) : await adminApi.desbloquear(id);
      carregar(); setSelecionada(null);
    } finally { setAcao(null); }
  };

  const uploadFoto = async (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = (e.target?.result as string).split(',')[1];
      await adminApi.uploadFoto(id, base64);
      carregar();
    };
    reader.readAsDataURL(file);
  };

  const filtradas = diaristas.filter(d =>
    d.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    d.email?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 24 }}>🧹 Diaristas</h1>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total', value: diaristas.length, color: '#282060', f: 'todas' },
          { label: 'Aprovadas', value: diaristas.filter(d => d.documentoVerificado).length, color: '#10b981', f: 'aprovadas' },
          { label: 'Pendentes', value: diaristas.filter(d => !d.documentoVerificado).length, color: '#f59e0b', f: 'pendentes' },
        ].map(card => (
          <div key={card.label} onClick={() => mudarFiltro(card.f as any)} style={{
            background: filtro === card.f ? card.color : 'white', color: filtro === card.f ? 'white' : card.color,
            borderRadius: 12, padding: '16px 20px', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `2px solid ${filtro === card.f ? card.color : '#eee'}`,
          }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', opacity: 0.7 }}>{card.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Busca */}
      <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="🔍 Buscar por nome ou email..."
        style={{ width: '100%', padding: '10px 16px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, marginBottom: 16, boxSizing: 'border-box' }} />

      {/* Tabela */}
      {loading ? <div style={{ textAlign: 'center', padding: 32 }}>Carregando...</div> : (
        <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#282060', color: 'white' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Foto</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Nome</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Avaliação</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Serviços</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((d, i) => (
                <tr key={d.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px 16px' }}>
                    {d.fotoPerfil
                      ? <img src={d.fotoPerfil} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🧹</div>
                    }
                  </td>
                  <td style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600 }}>{d.nome}</td>
                  <td style={{ padding: '10px 16px', fontSize: 13 }}>{d.email}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontSize: 13 }}>
                    ⭐ {Number(d.avaliacaoMedia).toFixed(1)} ({d.totalAvaliacoes})
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center', fontSize: 13 }}>{d.servicosRealizados}</td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <span style={{
                      background: d.documentoVerificado ? '#d1fae5' : '#fff7ed',
                      color: d.documentoVerificado ? '#065f46' : '#92400e',
                      padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                    }}>
                      {d.documentoVerificado ? '✅ Aprovada' : '⏳ Pendente'}
                    </span>
                  </td>
                  <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                    <button onClick={() => setSelecionada(d)} style={{ padding: '4px 10px', background: '#28206020', color: '#282060', border: '1px solid #282060', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
              {filtradas.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Nenhuma diarista encontrada</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal detalhe */}
      {selecionada && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'white', borderRadius: 16, padding: 32, width: 520, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ margin: 0, color: '#282060' }}>🧹 {selecionada.nome}</h2>
              <button onClick={() => setSelecionada(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>

            {/* Foto */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              {selecionada.fotoPerfil
                ? <img src={selecionada.fotoPerfil} style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />
                : <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 8px' }}>🧹</div>
              }
              <input type="file" accept="image/*" ref={fileRef} style={{ display: 'none' }}
                onChange={e => e.target.files?.[0] && uploadFoto(selecionada.id, e.target.files[0])} />
              <button onClick={() => fileRef.current?.click()} style={{ padding: '6px 14px', background: '#28206020', color: '#282060', border: '1px solid #282060', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                📷 Alterar foto
              </button>
            </div>

            <div style={{ display: 'grid', gap: 10, marginBottom: 20 }}>
              <div><strong>Email:</strong> {selecionada.email}</div>
              <div><strong>Telefone:</strong> {selecionada.telefone}</div>
              <div><strong>Avaliação:</strong> ⭐ {Number(selecionada.avaliacaoMedia).toFixed(1)} ({selecionada.totalAvaliacoes} avaliações)</div>
              <div><strong>Serviços realizados:</strong> {selecionada.servicosRealizados}</div>
              <div><strong>Valor/hora:</strong> {selecionada.valorHora ? `R$ ${selecionada.valorHora}` : '—'}</div>
              <div><strong>Disponível:</strong> {selecionada.disponivel ? '✅ Sim' : '❌ Não'}</div>
              <div><strong>Status conta:</strong> {selecionada.ativo ? '✅ Ativa' : '🚫 Bloqueada'}</div>
              <div><strong>Documentos:</strong> {selecionada.documentoVerificado ? '✅ Verificado' : '⏳ Pendente'}</div>
              {selecionada.descricao && <div><strong>Descrição:</strong> {selecionada.descricao}</div>}
              <div><strong>Cadastro:</strong> {new Date(selecionada.createdAt).toLocaleString('pt-BR')}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {!selecionada.documentoVerificado && (
                <button onClick={() => aprovar(selecionada.id)} disabled={acao === selecionada.id} style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  ✅ Aprovar
                </button>
              )}
              {selecionada.documentoVerificado && (
                <button onClick={() => reprovar(selecionada.id)} disabled={acao === selecionada.id} style={{ padding: '10px', background: '#f59e0b', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  ⚠️ Reprovar
                </button>
              )}
              <button onClick={() => bloquear(selecionada.id, selecionada.ativo)} disabled={acao === selecionada.id} style={{
                padding: '10px', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600,
                background: selecionada.ativo ? '#ef4444' : '#10b981', color: 'white',
              }}>
                {selecionada.ativo ? '🚫 Bloquear' : '✅ Desbloquear'}
              </button>
              <button onClick={() => setSelecionada(null)} style={{ padding: '10px', border: '1px solid #ddd', borderRadius: 8, cursor: 'pointer', background: 'white', gridColumn: selecionada.documentoVerificado ? 'span 1' : 'span 1' }}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
