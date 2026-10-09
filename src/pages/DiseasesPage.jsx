import React, { useState, useEffect } from 'react';
import { diseaseApi, getCropEmoji } from '../services/api';
import { Modal } from '../components/Toast';

export function DiseasesPage() {
  const [diseases, setDiseases] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    async function loadDiseases() {
      try {
        const data = await diseaseApi.getAll();
        setDiseases(data || []);
        setFiltered(data || []);
      } catch (err) {
        console.error('Failed to load diseases:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDiseases();
  }, []);

  useEffect(() => {
    let list = diseases;
    if (selectedCrop !== 'ALL') {
      list = list.filter((d) => d.affectedCrop.toLowerCase().includes(selectedCrop.toLowerCase()));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (d) =>
          d.diseaseName.toLowerCase().includes(q) ||
          d.affectedCrop.toLowerCase().includes(q) ||
          d.symptoms.toLowerCase().includes(q)
      );
    }
    setFiltered(list);
  }, [search, selectedCrop, diseases]);

  const cropsList = ['ALL', 'Rice', 'Wheat', 'Cotton', 'Tomato', 'Potato', 'Maize', 'Sugarcane', 'Chickpea', 'Mustard', 'Groundnut', 'Mango', 'Banana'];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', marginBottom: '6px' }}>🦠 Plant Disease & Pest Doctor</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Browse 17+ common Indian crop diseases with symptom identification, organic remedies, and chemical controls.
        </p>
      </div>

      {/* Filter Bar */}
      <div style={{
        display: 'flex',
        gap: '14px',
        flexWrap: 'wrap',
        marginBottom: '24px',
        background: 'var(--bg-card)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="🔍 Search disease name, crop, or symptoms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {cropsList.map((crop) => (
            <button
              key={crop}
              className={`btn btn-sm ${selectedCrop === crop ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCrop(crop)}
            >
              {crop === 'ALL' ? '🌾 All Crops' : `${getCropEmoji(crop)} ${crop}`}
            </button>
          ))}
        </div>
      </div>

      {/* Disease Cards Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading disease library...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          No diseases match your search criteria.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
          {filtered.map((d) => (
            <div
              key={d.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
              onClick={() => setActiveModal(d)}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="badge badge-green">
                    {getCropEmoji(d.affectedCrop)} {d.affectedCrop}
                  </span>
                  <span className="badge badge-yellow" style={{ fontSize: '10px' }}>
                    {d.causalOrganism || 'Pathogen'}
                  </span>
                </div>

                <h3 style={{ fontSize: '18px', marginBottom: '8px', color: 'var(--text-primary)' }}>
                  {d.diseaseName}
                </h3>

                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  marginBottom: '16px'
                }}>
                  {d.symptoms}
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--accent-bright)', fontWeight: 600 }}>
                  View Diagnosis & Treatment →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Disease Details Modal */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={activeModal ? `${getCropEmoji(activeModal.affectedCrop)} ${activeModal.diseaseName}` : ''}
        subtitle={activeModal ? `Host Crop: ${activeModal.affectedCrop} • Pathogen: ${activeModal.causalOrganism || 'Fungal/Bacterial'}` : ''}
      >
        {activeModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#f87171', marginBottom: '6px' }}>
                🔍 Visible Symptoms:
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(239,68,68,0.06)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {activeModal.symptoms}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-bright)', marginBottom: '6px' }}>
                🌿 Organic & Bio-Control Remedies:
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(34,197,94,0.06)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {activeModal.organicControl || 'Apply Neem oil spray @ 2-3 ml/L water or Trichoderma viride.'}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#93c5fd', marginBottom: '6px' }}>
                🧪 Chemical Treatment & Dosages:
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(59,130,246,0.06)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                {activeModal.chemicalControl || 'Spray Mancozeb 75% WP @ 2g/L or Carbendazim 50% WP @ 1g/L water.'}
              </p>
            </div>

            {activeModal.preventiveMeasures && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#fde047', marginBottom: '6px' }}>
                  🛡️ Preventive Agricultural Practices:
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, background: 'rgba(234,179,8,0.06)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                  {activeModal.preventiveMeasures}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
