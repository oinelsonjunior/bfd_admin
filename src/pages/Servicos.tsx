import { useEffect, useState } from 'react';
import { adminApi } from '../api';

const STATUS_LABELS: Record<string, string> = {
  aguardando: 'Aguardando', aceito: 'Aceito', a_caminho: 'A caminho',
  em_andamento: 'Em andamento', concluido: 'Concluído', cancelado: 'Cancelado',
};

const STATUS_COLORS: Record<string, string> = {
  aguardando: '#f59e0b', aceito: '#3b82f6', a_caminho: '#8b5cf6',
  em_andamento: '#10b981', concluido: '#6b7280', cancelado: '#ef4444',
};

const TIPO_LABELS: Record<string, string> = {
  limpeza_basica: 'Limpeza Básica', limpeza_completa: 'Limpeza Completa',
  limpeza_pos_obra: 'Limpeza Pós-Obra', passar_roupa: 'Passar Roupa', organizar: 'Organização',
};

export function Servicos() {
  const [servicos, setServicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    adminApi.servicos().then(r => { setServicos(r.data); setLoading(false); });
  }, []);

  const filtrados = filtro === 'todos' ? servicos : servicos.filter(s => s.status === filtro);

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Serviços</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Todos os serviços da plataforma</p>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['todos', 'aguardando', 'aceito', 'em_andamento', 'concluido', 'cancelado'].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{
            padding: '6px 16px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: filtro === f ? '#FA7D23' : '#f4f5f8',
            color: filtro === f ? 'white' : '#555',
          }}>
            {f === 'todos' ? 'Todos' : STATUS_LABELS[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#888' }}>Carregando...</div>
      ) : filtrados.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 60, color: '#888' }}>
          Nenhum serviço encontrado.
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f5f8' }}>
                {['Tipo', 'Status', 'Cliente', 'Diarista', 'Valor', 'Data'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: '#888', textTransform: 'uppercase' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((s, i) => (
                <tr key={s.id} style={{ borderTop: '1px solid #f0f0f0', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 600 }}>
                    {TIPO_LABELS[s.tipo] ?? s.tipo}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                      background: (STATUS_COLORS[s.status] ?? '#888') + '20',
                      color: STATUS_COLORS[s.status] ?? '#888',
                    }}>
                      {STATUS_LABELS[s.status] ?? s.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>
                    {s.cliente?.nome ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#555' }}>
                    {s.diarista?.nome ?? '—'}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 700, color: '#FA7D23' }}>
                    R$ {Number(s.valorTotal).toFixed(2)}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: '#888' }}>
                    {new Date(s.dataAgendada).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
