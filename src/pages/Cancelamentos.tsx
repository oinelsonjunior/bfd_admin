import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { FiltroDatas } from '../components/FiltroDatas';

const TIPO_LABELS: Record<string, string> = {
  limpeza_basica: 'Limpeza Básica', limpeza_completa: 'Limpeza Completa',
  limpeza_pos_obra: 'Limpeza Pós-Obra', passar_roupa: 'Passar Roupa', organizar: 'Organização',
};

export function Cancelamentos() {
  const [cancelamentos, setCancelamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const carregar = (inicio = dataInicio, fim = dataFim) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (inicio) params.append('dataInicio', inicio);
    if (fim) params.append('dataFim', fim);
    adminApi.cancelamentos(params.toString()).then(r => { setCancelamentos(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const handleFiltro = (i: string, f: string) => {
    setDataInicio(i); setDataFim(f); carregar(i, f);
  };

  const semDiarista = cancelamentos.filter(c => !c.diaristaId).length;
  const comDiarista = cancelamentos.filter(c => c.diaristaId).length;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 8 }}>❌ Cancelamentos</h1>
      <p style={{ color: '#888', marginBottom: 20 }}>Análise de serviços cancelados</p>

      <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <FiltroDatas dataInicio={dataInicio} dataFim={dataFim} onChange={handleFiltro} />
      </div>

      {!loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Total</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{cancelamentos.length}</div>
          </div>
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #f59e0b' }}>
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Antes de aceitar</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>{semDiarista}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Sem diarista atribuída</div>
          </div>
          <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
            <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Após aceite</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{comDiarista}</div>
            <div style={{ fontSize: 11, color: '#888' }}>Com diarista atribuída</div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>Carregando...</div>
      ) : (
        <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#282060', color: 'white' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Data</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Tipo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Cliente</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Diarista</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Valor</th>
                <th style={{ padding: '12px 16px', textAlign: 'left' }}>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {cancelamentos.map((c, i) => (
                <tr key={c.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 16px', fontSize: 12 }}>{new Date(c.updatedAt).toLocaleString('pt-BR')}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{TIPO_LABELS[c.tipo] ?? c.tipo}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{c.cliente?.nome ?? '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>
                    {c.diarista ? c.diarista.nome : <span style={{ color: '#aaa' }}>Sem diarista</span>}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>R$ {Number(c.valorTotal).toFixed(2)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#888' }}>{c.motivoCancelamento ?? '—'}</td>
                </tr>
              ))}
              {cancelamentos.length === 0 && (
                <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Nenhum cancelamento encontrado</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
