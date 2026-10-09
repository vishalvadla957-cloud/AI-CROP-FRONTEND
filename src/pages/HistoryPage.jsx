import React, { useState, useEffect } from 'react';
import { historyApi, getCropEmoji } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/Toast';

export function HistoryPage() {
  const { showToast } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    cropName: 'Maize',
    season: 'Kharif',
    areaCultivated: 2.5,
    sowingDate: new Date().toISOString().split('T')[0],
    harvestDate: '',
    actualYield: 45.0,
    yieldUnit: 'Quintals',
    revenueEarned: 95000,
    notes: 'Good crop output with balanced NPK split application.'
  });

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await historyApi.getAll();
      setHistory(data || []);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await historyApi.create(formData);
      showToast('Farming record added successfully!', 'success');
      setIsModalOpen(false);
      loadHistory();
    } catch (err) {
      showToast(err.message || 'Failed to add record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this farming record?')) return;
    try {
      await historyApi.delete(id);
      showToast('Record deleted', 'info');
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      showToast(err.message || 'Failed to delete record', 'error');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '26px', marginBottom: '6px' }}>📋 Farming History & Harvest Records</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            Track and monitor your historical crop cycles, yield outputs, and revenues.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <span>➕</span> Log New Harvest Record
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          Loading your farming records...
        </div>
      ) : history.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '14px' }}>🌾</div>
          <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>No Farming Records Logged Yet</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto 20px' }}>
            Keep track of each season's crop variety, yield per acre, and financial returns to improve future crop planning.
          </p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            Log Your First Harvest
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Crop</th>
                <th>Season</th>
                <th>Area</th>
                <th>Sowing Date</th>
                <th>Yield Output</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '20px' }}>{getCropEmoji(record.cropName)}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{record.cropName}</strong>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-green">{record.season || 'Kharif'}</span>
                  </td>
                  <td>{record.areaCultivated ? `${record.areaCultivated} Acres` : '—'}</td>
                  <td>{record.sowingDate || '—'}</td>
                  <td>
                    {record.actualYield ? (
                      <strong style={{ color: 'var(--accent-bright)' }}>
                        {record.actualYield} {record.yieldUnit || 'Qtl'}
                      </strong>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    {record.revenueEarned ? (
                      <strong style={{ color: '#93c5fd' }}>
                        ₹{Number(record.revenueEarned).toLocaleString('en-IN')}
                      </strong>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(record.id)}
                      title="Delete record"
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal to Log Record */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="➕ Log Seasonal Farming Record"
        subtitle="Record your crop performance and harvest revenue"
      >
        <form onSubmit={handleCreate}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Crop Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Maize, Wheat, Rice"
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cropping Season</label>
              <select
                className="form-select"
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              >
                <option value="Kharif">Kharif (Monsoon)</option>
                <option value="Rabi">Rabi (Winter)</option>
                <option value="Zaid">Zaid (Summer)</option>
                <option value="Annual">Annual / Perennial</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Area Cultivated (Acres)</label>
              <input
                type="number"
                step="0.1"
                className="form-input"
                value={formData.areaCultivated}
                onChange={(e) => setFormData({ ...formData, areaCultivated: parseFloat(e.target.value) || 0 })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sowing Date</label>
              <input
                type="date"
                className="form-input"
                value={formData.sowingDate}
                onChange={(e) => setFormData({ ...formData, sowingDate: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Harvested Yield (Quintals/kg)</label>
              <input
                type="number"
                step="0.5"
                className="form-input"
                value={formData.actualYield}
                onChange={(e) => setFormData({ ...formData, actualYield: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Revenue Earned (₹)</label>
              <input
                type="number"
                className="form-input"
                value={formData.revenueEarned}
                onChange={(e) => setFormData({ ...formData, revenueEarned: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes & Observations (Optional)</label>
            <textarea
              className="form-textarea"
              rows="3"
              placeholder="e.g. Applied DAP at sowing; no pest damage."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
              {submitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
