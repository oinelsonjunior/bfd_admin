import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { FiltroDatas } from '../components/FiltroDatas';

const TIPO_LABELS: Record<string, string> = {
  limpeza_basica: 'Limpeza Básica', limpeza_completa: 'Limpeza Completa',
  limpeza_pos_obra: 'Limpeza Pós-Obra', passar_roupa: 'Passar Roupa', organizar: 'Organização',
};

export function Financeiro() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const carregar = (inicio = dataInicio, fim = dataFim) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (inicio) params.append('dataInicio', inicio);
    if (fim) params.append('dataFim', fim);
    adminApi.financeiro(params.toString()).then(r => { setData(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const handleFiltro = (i: string, f: string) => {
    setDataInicio(i); setDataFim(f); carregar(i, f);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 8 }}>💰 Controle Financeiro</h1>
      <p style={{ color: '#888', marginBottom: 20 }}>Receitas, comissões e repasses da plataforma</p>

      <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <FiltroDatas dataInicio={dataInicio} dataFim={dataFim} onChange={handleFiltro} />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Carregando...</div>
      ) : (
        <>
          {/* Cards principais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Receita Bruta', value: `R$ ${Number(data.receitaBruta).toFixed(2)}`, icon: '💰', color: '#282060' },
              { label: 'Comissão (18%)', value: `R$ ${Number(data.comissaoPlataforma).toFixed(2)}`, icon: '🏦', color: '#FA7D23' },
              { label: 'Repasse Diaristas (82%)', value: `R$ ${Number(data.repasseDiaristas).toFixed(2)}`, icon: '👷', color: '#10b981' },
              { label: 'Ticket Médio', value: `R$ ${Number(data.ticketMedio).toFixed(2)}`, icon: '📊', color: '#8b5cf6' },
            ].map(card => (
              <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${card.color}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* Cards secundários */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Serviços Concluídos', value: data.totalServicos, icon: '✅', color: '#10b981' },
              { label: 'Cancelamentos', value: data.cancelados, icon: '❌', color: '#ef4444' },
              { label: 'Taxa de Cancelamento', value: `${data.taxaCancelamento}%`, icon: '📉', color: data.taxaCancelamento > 20 ? '#ef4444' : '#f59e0b' },
            ].map(card => (
              <div key={card.label} style={{ background: 'white', borderRadius: 12, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${card.color}` }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{card.icon}</div>
                <div style={{ fontSize: 28, fontWeight: 700, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{card.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* Por Diarista */}
            <div style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#282060', margin: '0 0 16px' }}>🧹 Ranking Diaristas</h3>
              {data.porDiarista.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center' }}>Sem dados</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#888' }}>Diarista</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#888' }}>Serviços</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, color: '#888' }}>Receita</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, color: '#888' }}>Repasse</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.porDiarista.map((d: any, i: number) => (
                      <tr key={i} style={{ borderTop: '1px solid #eee' }}>
                        <td style={{ padding: '8px 12px', fontSize: 13 }}>{d.nome}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 13 }}>{d.totalServicos}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>R$ {Number(d.receitaGerada).toFixed(2)}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, color: '#10b981' }}>R$ {Number(d.repasse).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Por Tipo */}
            <div style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <h3 style={{ color: '#282060', margin: '0 0 16px' }}>📋 Por Tipo de Serviço</h3>
              {data.porTipo.length === 0 ? (
                <p style={{ color: '#888', textAlign: 'center' }}>Sem dados</p>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f9f9f9' }}>
                      <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 12, color: '#888' }}>Tipo</th>
                      <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: '#888' }}>Qtd</th>
                      <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 12, color: '#888' }}>Receita</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.porTipo.map((t: any, i: number) => (
                      <tr key={i} style={{ borderTop: '1px solid #eee' }}>
                        <td style={{ padding: '8px 12px', fontSize: 13 }}>{TIPO_LABELS[t.tipo] ?? t.tipo}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 13 }}>{t.totalServicos}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600 }}>R$ {Number(t.receita).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
