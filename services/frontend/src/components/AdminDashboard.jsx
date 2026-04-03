import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [unidades, setUnidades] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    endereco: '',
    whatsapp: '',
    whatsapp_sem_tracos: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    estado: '',
    cidade: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const STRAPI_URL = process.env.GATSBY_STRAPI_URL || 'http://localhost:1337';
  const API_TOKEN = process.env.GATSBY_STRAPI_API_TOKEN || 'dev-gateway-token-change-in-production';

  useEffect(() => {
    fetchUnidades();
  }, []);

  const fetchUnidades = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${STRAPI_URL}/api/unidades?pagination[limit]=100`);
      const data = await response.json();
      setUnidades(data.data || []);
      setError(null);
    } catch (err) {
      console.error('Erro ao buscar unidades:', err);
      setError('Erro ao carregar unidades');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      slug: '',
      endereco: '',
      whatsapp: '',
      whatsapp_sem_tracos: '',
      instagram: '',
      facebook: '',
      tiktok: '',
      estado: '',
      cidade: '',
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.estado || !formData.cidade) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      setLoading(true);
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId 
        ? `${STRAPI_URL}/api/unidades/${editingId}`
        : `${STRAPI_URL}/api/unidades`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: JSON.stringify({ data: formData }),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar unidade');
      }

      setSuccess(editingId ? 'Unidade atualizada com sucesso!' : 'Unidade criada com sucesso!');
      resetForm();
      setShowForm(false);
      await fetchUnidades();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao salvar unidade');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (unidade) => {
    setFormData({
      nome: unidade.nome,
      slug: unidade.slug,
      endereco: unidade.endereco || '',
      whatsapp: unidade.whatsapp || '',
      whatsapp_sem_tracos: unidade.whatsapp_sem_tracos || '',
      instagram: unidade.instagram || '',
      facebook: unidade.facebook || '',
      tiktok: unidade.tiktok || '',
      estado: unidade.estado,
      cidade: unidade.cidade,
    });
    setEditingId(unidade.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta unidade?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${STRAPI_URL}/api/unidades/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar unidade');
      }

      setSuccess('Unidade deletada com sucesso!');
      await fetchUnidades();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao deletar unidade');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !showForm) {
    return <div style={{ padding: '40px', textAlign: 'center', fontSize: '18px', color: '#666' }}>Carregando...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', background: '#f5f5f7', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#000', margin: '0' }}>Painel de Administração - Unidades</h1>
          <button 
            style={{ padding: '12px 24px', background: '#667eea', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', transition: 'all 0.3s ease' }}
            onClick={() => { resetForm(); setShowForm(!showForm); }}
          >
            {showForm ? '❌ Cancelar' : '➕ Nova Unidade'}
          </button>
        </div>

        {error && <div style={{ padding: '15px 20px', background: '#f8d7da', color: '#721c24', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f5c6cb', fontSize: '14px', fontWeight: '500' }}>{error}</div>}
        {success && <div style={{ padding: '15px 20px', background: '#d4edda', color: '#155724', borderRadius: '8px', marginBottom: '20px', border: '1px solid #c3e6cb', fontSize: '14px', fontWeight: '500' }}>{success}</div>}

        {showForm && (
          <form style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)', marginBottom: '30px' }} onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Nome *</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleInputChange}
                  placeholder="Ex: São Paulo - Centro"
                  required
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Estado *</label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  placeholder="Ex: SP"
                  maxLength="2"
                  required
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Cidade *</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  placeholder="Ex: São Paulo"
                  required
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  placeholder="Endereço completo"
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="(11) 99999-9999"
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Instagram</label>
                <input
                  type="text"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  placeholder="@newshoes.saopaulo"
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>Facebook</label>
                <input
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  placeholder="https://facebook.com/newshoes"
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontWeight: '600', marginBottom: '8px', color: '#333', fontSize: '14px' }}>TikTok</label>
                <input
                  type="text"
                  name="tiktok"
                  value={formData.tiktok}
                  onChange={handleInputChange}
                  placeholder="@newshoes"
                  style={{ padding: '10px 12px', border: '1px solid #e0e0e0', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>
            </div>

            <button type="submit" style={{ marginTop: '20px', padding: '12px 30px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }} disabled={loading}>
              {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Criar'}
            </button>
          </form>
        )}

        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '600', color: '#333', fontSize: '14px' }}>Nome</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '600', color: '#333', fontSize: '14px' }}>Cidade</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '600', color: '#333', fontSize: '14px' }}>Estado</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '600', color: '#333', fontSize: '14px' }}>WhatsApp</th>
                <th style={{ padding: '15px 20px', textAlign: 'left', fontWeight: '600', color: '#333', fontSize: '14px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {unidades.map(unidade => (
                <tr key={unidade.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#333' }}>{unidade.nome}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#333' }}>{unidade.cidade}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px', color: '#333' }}>{unidade.estado}</td>
                  <td style={{ padding: '15px 20px', fontSize: '14px' }}>
                    {unidade.whatsapp ? (
                      <a href={`https://wa.me/${unidade.whatsapp_sem_tracos}`} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '500' }}>
                        {unidade.whatsapp}
                      </a>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '15px 20px', fontSize: '14px' }}>
                    <button style={{ padding: '6px 12px', background: '#667eea', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', marginRight: '8px', fontSize: '13px' }} onClick={() => handleEdit(unidade)}>
                      ✏️ Editar
                    </button>
                    <button style={{ padding: '6px 12px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }} onClick={() => handleDelete(unidade.id)}>
                      🗑️ Deletar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
