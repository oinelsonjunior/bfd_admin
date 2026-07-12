import { useEffect, useState } from 'react';
import { adminApi } from '../api';

const STATUS_COLORS: Record<string, string> = {
  pendente: '#f59e0b', aprovado: '#10b981', recusado: '#ef4444', estornado: '#6b7280',
};
const METODO_LABELS: Record<string, string> = {
  cartao_credito: '💳 Cartão', cartao_debito: '💳 Débito', pix: '⚡ PIX',
};

export function Pagamentos() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    adminApi.pagamentos().then(r => { setPagamentos(r.data); setLoading(false); });
  }, []);

  const filtrados = filtro === 'todos' ? pagamentos : pagamentos.filter(p => p.status === filtro);
  const total = filtrados.reduce((acc, p) => acc + Number(p.valor), 0);

  if (loading) return <div style={{ padding: 32, textAlign: 'center' }}>Carregando...</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 24 }}>💰 Pagamentos</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {['todos', 'pendente', 'aprovado', 'recusado'].map(s => (
          <div key={s} onClick={() => setFiltro(s)} style={{
            background: filtro === s ? '#282060' : 'white', color: filtro === s ? 'white' : '#282060',
            borderRadius: 12, padding: '16px 20px', cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: `2px solid ${filtro === s ? '#282060' : '#eee'}`,
          }}>
            <div style={{ fontSize: 12, textTransform: 'uppercase', opacity: 0.7 }}>{s === 'todos' ? 'Todos' : s}</div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>
              {s === 'todos' ? pagamentos.length : pagamentos.filter(p => p.status === s).length}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: '#FA7D23', borderRadius: 12, padding: '12px 20px', marginBottom: 24, color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 600 }}>Total ({filtrados.length} pagamentos)</span>
        <span style={{ fontWeight: 700, fontSize: 18 }}>R$ {total.toFixed(2)}</span>
      </div>
      <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#282060', color: 'white' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Data</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Método</th>
              <th style={{ padding: '12px 16px', textAlign: 'right' }}>Valor</th>
              <th style={{ padding: '12px 16px', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '12px 16px', textAlign: 'left' }}>Gateway ID</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p, i) => (
              <tr key={p.id} style={{ background: i % 2 === 0 ? '#f9f9f9' : 'white', borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{new Date(p.createdAt).toLocaleString('pt-BR')}</td>
                <td style={{ padding: '12px 16px', fontSize: 13 }}>{METODO_LABELS[p.metodo] ?? p.metodo}</td>
                <td style={{ padding: '12px 16px', fontSize: 13, textAlign: 'right', fontWeight: 600 }}>R$ {Number(p.valor).toFixed(2)}</td>
                <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                  <span style={{ background: (STATUS_COLORS[p.status] ?? '#888') + '20', color: STATUS_COLORS[p.status] ?? '#888', padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 11, color: '#888' }}>{p.gatewayId}</td>
              </tr>
            ))}
            {filtrados.length === 0 && (
              <tr><td colSpan={5} style={{ padding: 32, textAlign: 'center', color: '#888' }}>Nenhum pagamento encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
