interface Props {
  dataInicio: string;
  dataFim: string;
  onChange: (inicio: string, fim: string) => void;
}

const PERIODOS = [
  { label: 'Hoje', dias: 0 },
  { label: '7 dias', dias: 7 },
  { label: '30 dias', dias: 30 },
  { label: '90 dias', dias: 90 },
  { label: 'Tudo', dias: -1 },
];

export function FiltroDatas({ dataInicio, dataFim, onChange }: Props) {
  const aplicarPeriodo = (dias: number) => {
    if (dias === -1) { onChange('', ''); return; }
    const fim = new Date();
    const inicio = new Date();
    if (dias === 0) {
      inicio.setHours(0, 0, 0, 0);
    } else {
      inicio.setDate(inicio.getDate() - dias);
    }
    onChange(inicio.toISOString().slice(0, 10), fim.toISOString().slice(0, 10));
  };

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#282060' }}>📅 Período:</span>
      {PERIODOS.map(p => (
        <button key={p.label} onClick={() => aplicarPeriodo(p.dias)} style={{
          padding: '5px 12px', borderRadius: 20, border: '1.5px solid #ddd',
          background: 'white', color: '#555', cursor: 'pointer', fontSize: 12, fontWeight: 600,
        }}>
          {p.label}
        </button>
      ))}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="date" value={dataInicio} onChange={e => onChange(e.target.value, dataFim)}
          style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #ddd', fontSize: 12 }} />
        <span style={{ color: '#888' }}>até</span>
        <input type="date" value={dataFim} onChange={e => onChange(dataInicio, e.target.value)}
          style={{ padding: '5px 8px', borderRadius: 6, border: '1.5px solid #ddd', fontSize: 12 }} />
      </div>
    </div>
  );
}
