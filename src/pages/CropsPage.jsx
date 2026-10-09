import React, { useState, useEffect } from 'react';
import { cropApi, getCropEmoji } from '../services/api';
import { Modal } from '../components/Toast';

export function CropsPage() {
  const [crops, setCrops] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeModal, setActiveModal] = useState(null);

  const defaultCropDatabase = [
    { name: 'Rice', category: 'Cereals', season: 'Kharif', nRange: '60-100', pRange: '35-60', kRange: '35-50', phRange: '5.5-7.2', tempRange: '20-27°C', rainfall: '180-300 mm', duration: '110-150 days' },
    { name: 'Wheat', category: 'Cereals', season: 'Rabi', nRange: '80-130', pRange: '40-65', kRange: '25-45', phRange: '6.0-7.5', tempRange: '15-25°C', rainfall: '75-100 mm', duration: '120-140 days' },
    { name: 'Maize', category: 'Cereals', season: 'Kharif/Rabi', nRange: '70-110', pRange: '40-55', kRange: '35-55', phRange: '5.5-7.5', tempRange: '18-28°C', rainfall: '60-110 mm', duration: '90-110 days' },
    { name: 'Chickpea', category: 'Pulses', season: 'Rabi', nRange: '20-45', pRange: '55-80', kRange: '75-85', phRange: '6.0-8.0', tempRange: '15-22°C', rainfall: '60-90 mm', duration: '90-120 days' },
    { name: 'Cotton', category: 'Cash', season: 'Kharif', nRange: '100-140', pRange: '35-60', kRange: '15-30', phRange: '6.0-8.0', tempRange: '22-30°C', rainfall: '60-100 mm', duration: '150-180 days' },
    { name: 'Sugarcane', category: 'Cash', season: 'Annual', nRange: '130-150', pRange: '50-70', kRange: '60-80', phRange: '6.0-7.8', tempRange: '24-35°C', rainfall: '150-250 mm', duration: '300-360 days' },
    { name: 'Mustard', category: 'Oilseeds', season: 'Rabi', nRange: '60-90', pRange: '30-50', kRange: '30-50', phRange: '6.0-7.5', tempRange: '10-25°C', rainfall: '50-80 mm', duration: '105-130 days' },
    { name: 'Soybean', category: 'Oilseeds', season: 'Kharif', nRange: '30-50', pRange: '60-85', kRange: '30-50', phRange: '6.0-7.5', tempRange: '20-30°C', rainfall: '70-100 mm', duration: '95-115 days' },
    { name: 'Groundnut', category: 'Oilseeds', season: 'Kharif', nRange: '20-40', pRange: '40-60', kRange: '40-60', phRange: '6.0-7.0', tempRange: '22-30°C', rainfall: '60-90 mm', duration: '100-130 days' },
    { name: 'Tomato', category: 'Horticulture', season: 'Rabi/Kharif', nRange: '80-120', pRange: '50-70', kRange: '50-80', phRange: '6.0-7.0', tempRange: '18-28°C', rainfall: '50-80 mm', duration: '80-100 days' },
    { name: 'Potato', category: 'Horticulture', season: 'Rabi', nRange: '80-120', pRange: '50-70', kRange: '80-120', phRange: '5.2-6.5', tempRange: '15-22°C', rainfall: '50-70 mm', duration: '90-120 days' },
    { name: 'Mango', category: 'Horticulture', season: 'Perennial', nRange: '50-80', pRange: '30-50', kRange: '40-70', phRange: '5.5-7.5', tempRange: '24-32°C', rainfall: '80-150 mm', duration: 'Perennial' },
    { name: 'Banana', category: 'Horticulture', season: 'Annual', nRange: '90-120', pRange: '70-95', kRange: '45-60', phRange: '6.0-7.5', tempRange: '25-32°C', rainfall: '90-120 mm', duration: '11-12 months' },
    { name: 'Pigeon Peas', category: 'Pulses', season: 'Kharif', nRange: '20-40', pRange: '50-70', kRange: '20-40', phRange: '5.5-7.5', tempRange: '20-30°C', rainfall: '60-100 mm', duration: '150-180 days' },
    { name: 'Mung Bean', category: 'Pulses', season: 'Kharif/Summer', nRange: '15-30', pRange: '40-60', kRange: '20-40', phRange: '6.2-7.5', tempRange: '25-35°C', rainfall: '50-75 mm', duration: '60-75 days' },
    { name: 'Black Gram', category: 'Pulses', season: 'Kharif', nRange: '20-40', pRange: '40-60', kRange: '20-40', phRange: '6.0-7.5', tempRange: '25-32°C', rainfall: '60-80 mm', duration: '75-90 days' },
    { name: 'Lentil', category: 'Pulses', season: 'Rabi', nRange: '20-40', pRange: '40-60', kRange: '20-35', phRange: '6.0-7.5', tempRange: '15-22°C', rainfall: '40-60 mm', duration: '110-130 days' },
    { name: 'Jute', category: 'Cash', season: 'Kharif', nRange: '60-90', pRange: '30-50', kRange: '40-60', phRange: '6.0-7.5', tempRange: '24-35°C', rainfall: '150-200 mm', duration: '120-140 days' },
    { name: 'Watermelon', category: 'Horticulture', season: 'Zaid', nRange: '80-110', pRange: '20-40', kRange: '45-60', phRange: '6.0-7.0', tempRange: '24-32°C', rainfall: '40-60 mm', duration: '85-100 days' },
    { name: 'Muskmelon', category: 'Horticulture', season: 'Zaid', nRange: '80-110', pRange: '20-40', kRange: '45-60', phRange: '6.0-7.5', tempRange: '24-30°C', rainfall: '40-60 mm', duration: '80-95 days' }
  ];

  useEffect(() => {
    async function loadCatalog() {
      try {
        const data = await cropApi.catalog().catch(() => null);
        if (data && Array.isArray(data) && data.length > 0) {
          setCrops(data);
          setFiltered(data);
        } else {
          setCrops(defaultCropDatabase);
          setFiltered(defaultCropDatabase);
        }
      } catch {
        setCrops(defaultCropDatabase);
        setFiltered(defaultCropDatabase);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  useEffect(() => {
    let list = crops;
    if (selectedCategory !== 'ALL') {
      list = list.filter((c) => c.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.season?.toLowerCase().includes(q));
    }
    setFiltered(list);
  }, [search, selectedCategory, crops]);

  const categories = ['ALL', 'Cereals', 'Pulses', 'Oilseeds', 'Cash', 'Horticulture'];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', marginBottom: '6px' }}>🌱 Crop Agronomic Database</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Explore optimal NPK ranges, soil pH, temperatures, and rainfall requirements for 25 major Indian crops.
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
            placeholder="🔍 Search crop name or season..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn btn-sm ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Crops Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filtered.map((c, idx) => (
          <div
            key={idx}
            className="card"
            style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            onClick={() => setActiveModal(c)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <span style={{ fontSize: '32px' }}>{getCropEmoji(c.name)}</span>
                <span className="badge badge-green">{c.season || 'Annual'}</span>
              </div>

              <h3 style={{ fontSize: '20px', marginBottom: '4px' }}>{c.name}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Category: {c.category || 'Agricultural Crop'}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <div>🌿 N: <strong style={{ color: 'var(--text-primary)' }}>{c.nRange}</strong></div>
                <div>🌱 P: <strong style={{ color: 'var(--text-primary)' }}>{c.pRange}</strong></div>
                <div>🌾 K: <strong style={{ color: 'var(--text-primary)' }}>{c.kRange}</strong></div>
                <div>🧪 pH: <strong style={{ color: 'var(--text-primary)' }}>{c.phRange}</strong></div>
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--accent-bright)', fontWeight: 600 }}>View Full Requirements →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={!!activeModal}
        onClose={() => setActiveModal(null)}
        title={activeModal ? `${getCropEmoji(activeModal.name)} ${activeModal.name} (${activeModal.category || 'Crop'})` : ''}
        subtitle={activeModal ? `Season: ${activeModal.season} • Growth Duration: ${activeModal.duration || '90-120 days'}` : ''}
      >
        {activeModal && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>NITROGEN (N) REQUIREMENT</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-bright)' }}>{activeModal.nRange} kg/ha</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PHOSPHORUS (P) REQUIREMENT</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#93c5fd' }}>{activeModal.pRange} kg/ha</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>POTASSIUM (K) REQUIREMENT</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#fde047' }}>{activeModal.kRange} kg/ha</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OPTIMAL SOIL pH</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeModal.phRange}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TEMPERATURE RANGE</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeModal.tempRange || '20-30°C'}</div>
              </div>
              <div style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>WATER / RAINFALL</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{activeModal.rainfall || '60-100 mm'}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
