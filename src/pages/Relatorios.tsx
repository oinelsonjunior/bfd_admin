import { useState } from 'react';
import { adminApi } from '../api';
import { FiltroDatas } from '../components/FiltroDatas';

function exportarCSV(dados: any[], nomeArquivo: string, colunas: string[]) {
  const header = colunas.join(';');
  const rows = dados.map(d => colunas.map(col => {
    const val = d[col] ?? '';
    return typeof val === 'string' && val.includes(';') ? `"${val}"` : val;
  }).join(';'));
  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${nomeArquivo}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function filtrarPorData(dados: any[], campo: string, inicio: string, fim: string) {
  return dados.filter(d => {
    if (inicio && new Date(d[campo]) < new Date(inicio)) return false;
    if (fim && new Date(d[campo]) > new Date(fim + 'T23:59:59')) return false;
    return true;
  });
}

export function Relatorios() {
  const [loading, setLoading] = useState<string | null>(null);
  const [resultado, setResultado] = useState<string | null>(null);
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const gerarServicos = async () => {
    setLoading('servicos');
    setResultado(null);
    try {
      const r = await adminApi.relatorioServicos();
      const filtrados = filtrarPorData(r.data, 'data', dataInicio, dataFim);
      exportarCSV(filtrados, 'relatorio_servicos', ['id', 'data', 'tipo', 'status', 'cliente', 'diarista', 'endereco', 'valorTotal', 'horasEstimadas']);
      setResultado(`✅ ${filtrados.length} serviços exportados`);
    } catch {
      setResultado('❌ Erro ao gerar relatório');
    } finally {
      setLoading(null);
    }
  };

  const gerarPagamentos = async () => {
    setLoading('pagamentos');
    setResultado(null);
    try {
      const r = await adminApi.relatorioPagamentos();
      const filtrados = filtrarPorData(r.data, 'data', dataInicio, dataFim);
      exportarCSV(filtrados, 'relatorio_pagamentos', ['id', 'data', 'metodo', 'status', 'valor', 'gatewayId', 'servicoId']);
      setResultado(`✅ ${filtrados.length} pagamentos exportados`);
    } catch {
      setResultado('❌ Erro ao gerar relatório');
    } finally {
      setLoading(null);
    }
  };

  const cards = [
    {
      title: '🧹 Relatório de Serviços',
      desc: 'Exporta serviços com cliente, diarista, endereço, valor e status.',
      colunas: 'ID, Data, Tipo, Status, Cliente, Diarista, Endereço, Valor, Horas',
      action: gerarServicos,
      key: 'servicos',
      color: '#282060',
    },
    {
      title: '💰 Relatório de Pagamentos',
      desc: 'Exporta pagamentos com método, status e valor.',
      colunas: 'ID, Data, Método, Status, Valor, Gateway ID, Serviço ID',
      action: gerarPagamentos,
      key: 'pagamentos',
      color: '#FA7D23',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ color: '#282060', marginBottom: 8 }}>📊 Relatórios</h1>
      <p style={{ color: '#888', marginBottom: 20 }}>Exporte dados da plataforma em formato CSV</p>

      {/* Filtro de data global */}
      <div style={{ background: 'white', borderRadius: 12, padding: '16px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: 24 }}>
        <div style={{ fontWeight: 600, color: '#282060', marginBottom: 10 }}>Filtrar por período</div>
        <FiltroDatas dataInicio={dataInicio} dataFim={dataFim} onChange={(i, f) => { setDataInicio(i); setDataFim(f); }} />
        {(dataInicio || dataFim) && (
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
            {dataInicio && dataFim
              ? `Exportando de ${new Date(dataInicio).toLocaleDateString('pt-BR')} até ${new Date(dataFim).toLocaleDateString('pt-BR')}`
              : dataInicio
              ? `Exportando a partir de ${new Date(dataInicio).toLocaleDateString('pt-BR')}`
              : `Exportando até ${new Date(dataFim).toLocaleDateString('pt-BR')}`
            }
          </div>
        )}
        {!dataInicio && !dataFim && (
          <div style={{ fontSize: 12, color: '#f59e0b', marginTop: 4 }}>⚠️ Sem filtro: exportará todos os dados</div>
        )}
      </div>

      {resultado && (
        <div style={{ padding: '12px 16px', borderRadius: 8, background: resultado.includes('✅') ? '#d1fae5' : '#fee2e2', color: resultado.includes('✅') ? '#065f46' : '#991b1b', marginBottom: 24, fontWeight: 600 }}>
          {resultado}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        {cards.map(card => (
          <div key={card.key} style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `4px solid ${card.color}` }}>
            <h2 style={{ margin: '0 0 8px', color: card.color, fontSize: 18 }}>{card.title}</h2>
            <p style={{ color: '#666', fontSize: 14, margin: '0 0 12px' }}>{card.desc}</p>
            <div style={{ background: '#f9f9f9', borderRadius: 6, padding: '8px 12px', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 600, marginBottom: 4 }}>COLUNAS</div>
              <div style={{ fontSize: 12, color: '#555' }}>{card.colunas}</div>
            </div>
            <button onClick={card.action} disabled={loading === card.key} style={{
              width: '100%', padding: '12px', background: loading === card.key ? '#ccc' : card.color,
              color: 'white', border: 'none', borderRadius: 8, cursor: loading === card.key ? 'not-allowed' : 'pointer',
              fontWeight: 700, fontSize: 14,
            }}>
              {loading === card.key ? 'Gerando...' : '⬇️ Exportar CSV'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
