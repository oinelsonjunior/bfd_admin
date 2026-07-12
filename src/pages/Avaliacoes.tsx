import { useEffect, useState } from 'react';
import { adminApi } from '../api';
import { FiltroDatas } from '../components/FiltroDatas';

function Estrelas({ nota }: { nota: number }) {
  return (
    <span>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= nota ? '#f59e0b' : '#ddd', fontSize: 16 }}>★</span>
      ))}
    </span>
  );
}

export function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroNota, setFiltroNota] = useState(0);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    adminApi.avaliacoes().then(r => { setAvaliacoes(r.data); setLoading(false); });
  }, []);

  const filtradas = avaliacoes.filter(a => {
    if (filtroNota !== 0 && a.avaliacaoNota !== filtroNota) return false;
    if (dataInicio && new Date(a.updatedAt) < new Date(dataInicio)) return false;
    if (dataFim && new Date(a.updatedAt) > new Date(dataFim + 'T23:59:59')) return false;
    return true;
  });
  const media = avaliacoes.length > 0 ? avaliacoes.reduce((acc, a) => acc + a.avaliacaoNota, 0) / avaliacoes.length : 0;

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 24 }}>⭐ Avaliações</h1>

      {/* Métricas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #282060' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Total</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#282060' }}>{avaliacoes.length}</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Média Geral</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#f59e0b' }}>⭐ {media.toFixed(1)}</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Positivas (4-5★)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#10b981' }}>{avaliacoes.filter(a => a.avaliacaoNota >= 4).length}</div>
        </div>
        <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '4px solid #ef4444' }}>
          <div style={{ fontSize: 12, color: '#888', textTransform: 'uppercase' }}>Negativas (1-2★)</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#ef4444' }}>{avaliacoes.filter(a => a.avaliacaoNota <= 2).length}</div>
        </div>
      </div>

      <FiltroDatas dataInicio={dataInicio} dataFim={dataFim} onChange={(i, f) => { setDataInicio(i); setDataFim(f); }} />

      {/* Filtro por nota */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[0,1,2,3,4,5].map(n => (
          <button key={n} onClick={() => setFiltroNota(n)} style={{
            padding: '6px 14px', borderRadius: 20, border: '2px solid',
            borderColor: filtroNota === n ? '#282060' : '#ddd',
            background: filtroNota === n ? '#282060' : 'white',
            color: filtroNota === n ? 'white' : '#555',
            cursor: 'pointer', fontSize: 12, fontWeight: 600,
          }}>
            {n === 0 ? `Todas (${avaliacoes.length})` : `${'★'.repeat(n)} (${avaliacoes.filter(a => a.avaliacaoNota === n).length})`}
          </button>
        ))}
      </div>

      {/* Lista de avaliações */}
      <div style={{ display: 'grid', gap: 12 }}>
        {filtradas.map(a => (
          <div key={a.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: `4px solid ${a.avaliacaoNota >= 4 ? '#10b981' : a.avaliacaoNota <= 2 ? '#ef4444' : '#f59e0b'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <Estrelas nota={a.avaliacaoNota} />
                <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 600, color: '#282060' }}>{a.avaliacaoNota}/5</span>
              </div>
              <span style={{ fontSize: 12, color: '#888' }}>{new Date(a.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
            <div style={{ display: 'flex', gap: 16, fontSize: 13, marginBottom: 8 }}>
              <span>👤 <strong>Cliente:</strong> {a.cliente?.nome ?? '—'}</span>
              <span>🧹 <strong>Diarista:</strong> {a.diarista?.nome ?? '—'}</span>
            </div>
            {a.avaliacaoComentario && (
              <div style={{ background: '#f9f9f9', padding: '10px 14px', borderRadius: 8, fontSize: 13, color: '#444', fontStyle: 'italic' }}>
                "{a.avaliacaoComentario}"
              </div>
            )}
          </div>
        ))}
        {filtradas.length === 0 && (
          <div style={{ textAlign: 'center', padding: 32, color: '#888', background: 'white', borderRadius: 12 }}>Nenhuma avaliação encontrada</div>
        )}
      </div>
    </div>
  );
}
