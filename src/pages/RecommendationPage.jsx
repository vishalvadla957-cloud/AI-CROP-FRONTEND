import React, { useState } from 'react';
import { cropApi, getCropEmoji } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function RecommendationPage() {
  const { showToast } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 7 Soil & Climatic Parameters
  const [formData, setFormData] = useState({
    nitrogen: 90,
    phosphorus: 42,
    potassium: 43,
    ph: 6.5,
    temperature: 26,
    humidity: 52,
    rainfall: 103
  });

  const soilPresets = [
    { label: '🌽 Alluvial Soil (Maize/Wheat)', data: { nitrogen: 90, phosphorus: 42, potassium: 43, ph: 6.5, temperature: 26, humidity: 52, rainfall: 103 } },
    { label: '🌾 Clay Loam (Rice/Paddy)', data: { nitrogen: 80, phosphorus: 48, potassium: 40, ph: 6.8, temperature: 24, humidity: 82, rainfall: 240 } },
    { label: '☁️ Black Soil (Cotton/Soybean)', data: { nitrogen: 120, phosphorus: 45, potassium: 20, ph: 7.2, temperature: 25, humidity: 65, rainfall: 80 } },
    { label: '🌱 Sandy Loam (Chickpea/Pulses)', data: { nitrogen: 40, phosphorus: 65, potassium: 80, ph: 7.0, temperature: 18, humidity: 20, rainfall: 70 } }
  ];

  const applyPreset = (presetData) => {
    setFormData(presetData);
    showToast('Applied soil preset parameters', 'info');
  };

  const handleSliderChange = (param, value) => {
    setFormData((prev) => ({ ...prev, [param]: parseFloat(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await cropApi.recommend(formData);
      setResult(data);
      showToast(`Recommendation ready: ${data.primaryCrop} (${data.primaryConfidence}%)`, 'success');
    } catch (err) {
      showToast(err.message || 'Failed to get recommendation', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', marginBottom: '6px' }}>🧪 Crop Suitability Advisor</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Adjust the 7 soil and climatic sliders below or select a common soil preset to evaluate crop suitability.
        </p>
      </div>

      {/* Preset Buttons */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Presets:</span>
        {soilPresets.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => applyPreset(preset.data)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '1.1fr 0.9fr' : '1fr', gap: '28px' }}>
        {/* Sliders Form */}
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 className="card-title">Soil & Weather Parameters</h2>
              <span className="badge badge-green">7-Feature Matrix</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {/* Nitrogen */}
              <div className="slider-wrap">
                <div className="slider-header">
                  <span className="slider-title">🌿 Nitrogen (N)</span>
                  <span className="slider-badge">{formData.nitrogen} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  step="1"
                  value={formData.nitrogen}
                  onChange={(e) => handleSliderChange('nitrogen', e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>0 kg/ha</span>
                  <span>Weight: 18%</span>
                  <span>150 kg/ha</span>
                </div>
              </div>

              {/* Phosphorus */}
              <div className="slider-wrap">
                <div className="slider-header">
                  <span className="slider-title">🌱 Phosphorus (P)</span>
                  <span className="slider-badge">{formData.phosphorus} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="1"
                  value={formData.phosphorus}
                  onChange={(e) => handleSliderChange('phosphorus', e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>5 kg/ha</span>
                  <span>Weight: 15%</span>
                  <span>150 kg/ha</span>
                </div>
              </div>

              {/* Potassium */}
              <div className="slider-wrap">
                <div className="slider-header">
                  <span className="slider-title">🌾 Potassium (K)</span>
                  <span className="slider-badge">{formData.potassium} kg/ha</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="210"
                  step="1"
                  value={formData.potassium}
                  onChange={(e) => handleSliderChange('potassium', e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>5 kg/ha</span>
                  <span>Weight: 15%</span>
                  <span>210 kg/ha</span>
                </div>
              </div>

              {/* Soil pH */}
              <div className="slider-wrap">
                <div className="slider-header">
                  <span className="slider-title">🧪 Soil pH</span>
                  <span className="slider-badge">{formData.ph.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="3.5"
                  max="9.5"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => handleSliderChange('ph', e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>3.5 (Acidic)</span>
                  <span>Weight: 17%</span>
                  <span>9.5 (Alkaline)</span>
                </div>
              </div>

              {/* Temperature */}
              <div className="slider-wrap">
                <div className="slider-header">
                  <span className="slider-title">🌡️ Temperature</span>
                  <span className="slider-badge">{formData.temperature} °C</span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="45"
                  step="0.5"
                  value={formData.temperature}
                  onChange={(e) => handleSliderChange('temperature', e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>8 °C</span>
                  <span>Weight: 15%</span>
                  <span>45 °C</span>
                </div>
              </div>

              {/* Humidity */}
              <div className="slider-wrap">
                <div className="slider-header">
                  <span className="slider-title">💧 Relative Humidity</span>
                  <span className="slider-badge">{formData.humidity} %</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="1"
                  value={formData.humidity}
                  onChange={(e) => handleSliderChange('humidity', e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>10% (Dry)</span>
                  <span>Weight: 10%</span>
                  <span>100% (Humid)</span>
                </div>
              </div>

              {/* Rainfall */}
              <div className="slider-wrap" style={{ gridColumn: '1 / -1' }}>
                <div className="slider-header">
                  <span className="slider-title">🌧️ Annual / Seasonal Rainfall</span>
                  <span className="slider-badge">{formData.rainfall} mm</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="300"
                  step="1"
                  value={formData.rainfall}
                  onChange={(e) => handleSliderChange('rainfall', e.target.value)}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>20 mm (Arid)</span>
                  <span>Weight: 10%</span>
                  <span>300 mm (High Rainfall)</span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Analyzing Soil Suitability...' : '✨ Run AI Suitability Analysis'}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Primary Recommendation Card */}
            <div className="card" style={{
              background: 'linear-gradient(135deg, rgba(6,78,59,0.5), rgba(19,28,22,0.95))',
              border: '1px solid var(--border-green)',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="badge badge-green">Top Recommendation</span>
                <span className="badge badge-blue">Health: {result.soilHealthStatus}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
                <div style={{
                  fontSize: '48px',
                  width: '80px',
                  height: '80px',
                  background: 'rgba(34,197,94,0.15)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid var(--border-green)'
                }}>
                  {getCropEmoji(result.primaryCrop)}
                </div>
                <div>
                  <h2 style={{ fontSize: '32px', fontWeight: 800 }}>{result.primaryCrop}</h2>
                  <div style={{ color: 'var(--accent-bright)', fontWeight: 700, fontSize: '18px' }}>
                    {result.primaryConfidence}% Confidence
                  </div>
                </div>
              </div>

              {result.primaryDescription && (
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.6 }}>
                  {result.primaryDescription}
                </p>
              )}

              {/* Actionable Advice */}
              {result.actionableAdvice && result.actionableAdvice.length > 0 && (
                <div style={{ marginTop: '16px', padding: '14px', background: 'rgba(0,0,0,0.25)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-bright)', marginBottom: '8px' }}>
                    💡 Tailored Agronomic Advice:
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '13px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {result.actionableAdvice.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Alternative Crops */}
            {result.alternatives && result.alternatives.length > 0 && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: '14px', fontSize: '16px' }}>
                  🌾 Alternative Suitable Crops
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {result.alternatives.map((alt, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '20px' }}>{getCropEmoji(alt.cropName)}</span>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px' }}>{alt.cropName}</div>
                          {alt.reason && <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{alt.reason}</div>}
                        </div>
                      </div>
                      <span className="badge badge-green">{alt.confidence}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
