import { useEffect, useState } from 'react';
import { adminApi } from '../api';

export function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard().then(r => { setData(r.data); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>;

  const cards = [
    { label: 'Total Clientes', value: data?.totalClientes ?? 0, icon: '👥', color: '#282060' },
    { label: 'Total Diaristas', value: data?.totalDiaristas ?? 0, icon: '🧹', color: '#FA7D23' },
    { label: 'Diaristas Pendentes', value: data?.diaristasPendentes ?? 0, icon: '⏳', color: '#f59e0b' },
    { label: 'Serviços Ativos', value: data?.servicosAtivos ?? 0, icon: '✅', color: '#10b981' },
    { label: 'Serviços Concluídos', value: data?.servicosConcluidos ?? 0, icon: '🏆', color: '#3b82f6' },
    { label: 'Receita Total', value: `R$ ${Number(data?.receitaTotal ?? 0).toFixed(2)}`, icon: '💰', color: '#8b5cf6' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 8 }}>📊 Dashboard</h1>
      <p style={{ color: '#888', marginBottom: 24 }}>Visão geral da plataforma</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {cards.map(card => (
          <div key={card.label} style={{
            background: 'white', borderRadius: 12, padding: '20px 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${card.color}`,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{card.icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{card.label}</div>
          </div>
        ))}
      </div>

      {data?.ultimosServicos?.length > 0 && (
        <>
          <h2 style={{ color: '#282060', marginBottom: 16 }}>Últimos Serviços</h2>
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
                    <td style={{ padding: '10px 16px', fontSize: 13 }}>{s.tipo}</td>
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
    </div>
  );
}
