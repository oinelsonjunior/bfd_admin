import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { FiltroDatas } from '../components/FiltroDatas';

const STATUS_COLORS: Record<string, string> = {
  aguardando: '#f59e0b', matching: '#3b82f6', aceito: '#8b5cf6',
  a_caminho: '#FA7D23', em_andamento: '#10b981', concluido: '#065f46', cancelado: '#ef4444',
};
const TIPO_LABELS: Record<string, string> = {
  limpeza_basica: 'Limpeza Básica', limpeza_completa: 'Limpeza Completa',
  limpeza_pos_obra: 'Limpeza Pós-Obra', passar_roupa: 'Passar Roupa', organizar: 'Organização',
};

export function Servicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');
  const [cancelando, setCancelando] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const carregar = () => {
    adminApi.servicos().then(r => { setServicos(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const cancelar = async (id: string) => {
    if (!confirm('Cancelar este serviço?')) return;
    setCancelando(id);
    try {
      await adminApi.cancelarServico(id);
      carregar();
    } finally {
      setCancelando(null);
    }
  };

  const filtrados = servicos.filter(s => {
    if (filtro !== 'todos' && s.status !== filtro) return false;
    if (dataInicio && new Date(s.createdAt) < new Date(dataInicio)) return false;
    if (dataFim && new Date(s.createdAt) > new Date(dataFim + 'T23:59:59')) return false;
    return true;
  });
  const statusCounts = servicos.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 24 }}>🧹 Serviços</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['todos', 'aguardando', 'matching', 'aceito', 'a_caminho', 'em_andamento', 'concluido', 'cancelado'].map(s => (
          <button key={s} onClick={() => setFiltro(s)} style={{
            padding: '6px 14px', borderRadius: 20, border: '2px solid',
            borderColor: filtro === s ? '#282060' : '#ddd',
            background: filtro === s ? '#282060' : 'white',
            color: filtro === s ? 'white' : '#555',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>
            {s === 'todos' ? `Todos (${servicos.length})` : `${s} (${statusCounts[s] || 0})`}
          </button>
        ))}
      </div>
      <FiltroDatas dataInicio={dataInicio} dataFim={dataFim} onChange={(i, f) => { setDataInicio(i); setDataFim(f); }} />
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#282060', color: 'white' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Data</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tipo</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Cliente</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Diarista</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Valor</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 16px', fontSize: 12 }}>{new Date(s.createdAt).toLocaleString('pt-BR')}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{TIPO_LABELS[s.tipo] ?? s.tipo}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{s.cliente?.nome ?? '-'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{s.diarista?.nome ?? '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>R$ {Number(s.valorTotal).toFixed(2)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ background: (STATUS_COLORS[s.status] ?? '#888') + '20', color: STATUS_COLORS[s.status] ?? '#888', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {s.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  {!['concluido', 'cancelado'].includes(s.status) && (
                    <button onClick={() => cancelar(s.id)} disabled={cancelando === s.id} style={{
                      padding: '4px 12px', background: '#ef444420', color: '#ef4444',
                      border: '1px solid #ef4444', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 600,
                    }}>
                      {cancelando === s.id ? '...' : 'Cancelar'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Nenhum serviço encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
