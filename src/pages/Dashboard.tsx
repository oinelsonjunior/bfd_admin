import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { FiltroDatas } from '../components/FiltroDatas';

const TIPO_LABELS: Record<string, string> = {
  limpeza_basica: 'Limpeza Básica', limpeza_completa: 'Limpeza Completa',
  limpeza_pos_obra: 'Limpeza Pós-Obra', passar_roupa: 'Passar Roupa', organizar: 'Organização',
};

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const carregar = (inicio = dataInicio, fim = dataFim) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (inicio) params.append('dataInicio', inicio);
    if (fim) params.append('dataFim', fim);
    adminApi.dashboard(params.toString()).then(r => { setData(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const handleFiltro = (i: string, f: string) => {
    setDataInicio(i);
    setDataFim(f);
    carregar(i, f);
  };

  const cards = [
    { label: 'Total Clientes', value: data?.totalClientes ?? 0, icon: '👥', color: '#282060', sub: data?.novosClientes ? `+${data.novosClientes} no período` : null },
    { label: 'Total Diaristas', value: data?.totalDiaristas ?? 0, icon: '🧹', color: '#FA7D23', sub: data?.novasDiaristas ? `+${data.novasDiaristas} no período` : null },
    { label: 'Diaristas Pendentes', value: data?.diaristasPendentes ?? 0, icon: '⏳', color: '#f59e0b', sub: null },
    { label: 'Serviços Ativos', value: data?.servicosAtivos ?? 0, icon: '🔄', color: '#3b82f6', sub: null },
    { label: 'Serviços Concluídos', value: data?.servicosConcluidos ?? 0, icon: '✅', color: '#10b981', sub: `de ${data?.totalServicos ?? 0} total` },
    { label: 'Receita Total', value: `R$ ${Number(data?.receitaTotal ?? 0).toFixed(2)}`, icon: '💰', color: '#8b5cf6', sub: data?.ticketMedio ? `Ticket médio: R$ ${Number(data.ticketMedio).toFixed(2)}` : null },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div>
          <h1 style={{ color: '#282060', margin: '0 0 4px' }}>📊 Dashboard</h1>
          <p style={{ color: '#888', margin: 0, fontSize: 13 }}>
            {data?.periodo ? `Período: ${data.periodo.dataInicio ?? '—'} até ${data.periodo.dataFim ?? '—'}` : 'Todos os dados'}
          </p>
        </div>
        <button onClick={() => carregar(dataInicio, dataFim)} style={{ padding: '8px 16px', background: '#282060', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
          🔄 Atualizar
        </button>
      </div>

      {/* Filtro de data */}
      <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <FiltroDatas dataInicio={dataInicio} dataFim={dataFim} onChange={handleFiltro} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Carregando métricas...</div>
      ) : (
        <>
          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
            {cards.map(card => (
              <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '20px 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${card.color}` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{card.label}</div>
                {card.sub && <div style={{ fontSize: 11, color: card.color, marginTop: 4, fontWeight: 600 }}>{card.sub}</div>}
              </div>
            ))}
          </div>

          {/* Últimos Serviços */}
          {data?.ultimosServicos?.length > 0 && (
            <>
              <h2 style={{ color: '#282060', marginBottom: 16 }}>
                Últimos Serviços {dataInicio || dataFim ? 'no Período' : ''}
              </h2>
              <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#282060', color: 'white' }}>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Data</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Tipo</th>
                      <th style={{ padding: '10px 16px', textAlign: 'left' }}>Cliente</th>
                      <th style={{ padding: '10px 16px', textAlign: 'right' }}>Valor</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.ultimosServicos.map((s: any, i: number) => (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px 16px', fontSize: 12 }}>{new Date(s.createdAt).toLocaleString('pt-BR')}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13 }}>{TIPO_LABELS[s.tipo] ?? s.tipo}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13 }}>{s.cliente?.nome ?? '-'}</td>
                        <td style={{ padding: '10px 16px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>R$ {Number(s.valorTotal).toFixed(2)}</td>
                        <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                          <span style={{ background: '#28206020', color: '#282060', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
