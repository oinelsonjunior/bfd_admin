import { useEffect, useState } from 'react';
import { adminApi } from '../api';

interface Stats { totalClientes: number; totalDiaristas: number; diaristasNaoAprovadas: number; }

export function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    adminApi.dashboard().then(r => setStats(r.data));
  }, []);

  const cards = [
    { label: 'Clientes cadastrados', value: stats?.totalClientes ?? '—', icon: '👤', color: '#3b82f6' },
    { label: 'Diaristas ativas', value: stats?.totalDiaristas ?? '—', icon: '👩‍💼', color: '#10b981' },
    { label: 'Aguardando aprovação', value: stats?.diaristasNaoAprovadas ?? '—', icon: '⏳', color: '#f59e0b' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>Visão geral da plataforma</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 32 }}>
        {cards.map(card => (
          <div key={card.label} className="card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 12, background: card.color + '20',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{card.value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{card.label}</div>
            </div>
          </div>
        ))}
      </div>

      {(stats?.diaristasNaoAprovadas ?? 0) > 0 && (
        <div className="card" style={{ borderLeft: '4px solid var(--warning)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div>
            <strong>{stats?.diaristasNaoAprovadas} diarista(s)</strong> aguardando aprovação.
            <a href="/diaristas" style={{ color: 'var(--orange)', marginLeft: 8, fontWeight: 600 }}>Revisar agora →</a>
          </div>
        </div>
      )}
    </div>
  );
}
