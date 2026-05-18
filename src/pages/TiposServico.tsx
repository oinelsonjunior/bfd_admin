import { useEffect, useState } from 'react';
import { tiposApi } from '../api';

interface TipoServico {
  id: string; codigo: string; nome: string; descricao: string;
  precoBase: number; horasMinimas: number; horasMaximas: number; ativo: boolean;
}

const emptyForm = { codigo: '', nome: '', descricao: '', precoBase: 45, horasMinimas: 2, horasMaximas: 12, ativo: true };

export function TiposServico() {
  const [tipos, setTipos] = useState<TipoServico[]>([]);
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<TipoServico | null>(null);
  const [form, setForm] = useState(emptyForm);
  // loading removido

  const carregar = () => {
    tiposApi.listar().then(r => { setTipos(r.data); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const abrirCriar = () => { setEditando(null); setForm(emptyForm); setModal(true); };
  const abrirEditar = (t: TipoServico) => { setEditando(t); setForm({ ...t }); setModal(true); };

  const salvar = async () => {
    if (editando) {
      await tiposApi.atualizar(editando.id, form);
    } else {
      await tiposApi.criar(form);
    }
    setModal(false);
    carregar();
  };

  const remover = async (id: string) => {
    if (!confirm('Remover este tipo de serviço?')) return;
    await tiposApi.remover(id);
    carregar();
  };

  const set = (field: string, value: any) => setForm(f => ({ ...f, [field]: value }));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Tipos de Serviço</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 4 }}>Gerencie os serviços e preços da plataforma</p>
        </div>
        <button className="btn btn-primary" onClick={abrirCriar}>+ Novo Tipo</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {tipos.map(t => (
          <div key={t.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{t.nome}</h3>
                <span className={`badge ${t.ativo ? 'badge-success' : 'badge-gray'}`}>
                  {t.ativo ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--orange)' }}>
                  R$ {Number(t.precoBase).toFixed(2)}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>por hora</div>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '12px 0' }}>{t.descricao}</p>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
              ⏱ {t.horasMinimas}h — {t.horasMaximas}h
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => abrirEditar(t)}>✏️ Editar</button>
              <button className="btn btn-danger btn-sm" onClick={() => remover(t.id)}>🗑 Remover</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{editando ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}</h3>

            <div className="form-group">
              <label>Código (único, sem espaços)</label>
              <input value={form.codigo} onChange={e => set('codigo', e.target.value)} placeholder="ex: limpeza_basica" disabled={!!editando} />
            </div>
            <div className="form-group">
              <label>Nome</label>
              <input value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="ex: Limpeza Básica" />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <input value={form.descricao} onChange={e => set('descricao', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label>Preço/hora (R$)</label>
                <input type="number" value={form.precoBase} onChange={e => set('precoBase', +e.target.value)} />
              </div>
              <div className="form-group">
                <label>Horas mínimas</label>
                <input type="number" value={form.horasMinimas} onChange={e => set('horasMinimas', +e.target.value)} />
              </div>
              <div className="form-group">
                <label>Horas máximas</label>
                <input type="number" value={form.horasMaximas} onChange={e => set('horasMaximas', +e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" checked={form.ativo} onChange={e => set('ativo', e.target.checked)} style={{ width: 'auto', marginRight: 8 }} />
                Ativo (visível no app)
              </label>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={salvar}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
