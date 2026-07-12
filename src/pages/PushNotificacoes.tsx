import { useState } from 'react';
import { adminApi } from '../api';

export function PushNotificacoes() {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [role, setRole] = useState('cliente');
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<string | null>(null);

  const enviar = async () => {
    if (!titulo || !mensagem) return;
    setEnviando(true);
    setResultado(null);
    try {
      await adminApi.enviarPush(titulo, mensagem, role);
      setResultado('✅ Push enviado com sucesso!');
      setTitulo('');
      setMensagem('');
    } catch {
      setResultado('❌ Erro ao enviar push');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1 style={{ color: '#282060', marginBottom: 24 }}>🔔 Notificações Push</h1>
      <div style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#282060', marginBottom: 6, fontSize: 13 }}>Destinatários</label>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14 }}>
            <option value="cliente">Clientes</option>
            <option value="diarista">Diaristas</option>
          </select>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#282060', marginBottom: 6, fontSize: 13 }}>Título</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Ex: Promoção especial!"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#282060', marginBottom: 6, fontSize: 13 }}>Mensagem</label>
          <textarea value={mensagem} onChange={e => setMensagem(e.target.value)} placeholder="Ex: Aproveite 20% de desconto no seu próximo serviço!"
            rows={4} style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid #ddd', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }} />
        </div>
        {resultado && (
          <div style={{ padding: '10px 16px', borderRadius: 8, background: resultado.includes('✅') ? '#d1fae5' : '#fee2e2',
            color: resultado.includes('✅') ? '#065f46' : '#991b1b', marginBottom: 16, fontWeight: 600 }}>
            {resultado}
          </div>
        )}
        <button onClick={enviar} disabled={enviando || !titulo || !mensagem} style={{
          width: '100%', padding: '12px', background: enviando ? '#ccc' : '#FA7D23', color: 'white',
          border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: enviando ? 'not-allowed' : 'pointer',
        }}>
          {enviando ? 'Enviando...' : '🚀 Enviar Notificação'}
        </button>
      </div>
      <div style={{ marginTop: 24, background: '#fff5ee', borderRadius: 12, padding: 16, border: '1px solid #FA7D23' }}>
        <p style={{ margin: 0, fontSize: 13, color: '#666' }}>
          <strong>⚠️ Atenção:</strong> A notificação será enviada para <strong>todos os {role === 'cliente' ? 'clientes' : 'diaristas'}</strong> com notificações ativas.
        </p>
      </div>
    </div>
  );
}
