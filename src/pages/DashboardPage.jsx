import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { historyApi, cropApi, diseaseApi } from '../services/api';

export function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    historyCount: 0,
    totalCrops: 25,
    diseaseCount: 17,
    recentCrop: 'Maize'
  });
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const histories = await historyApi.getAll().catch(() => []);
        setHistoryList(histories || []);
        setStats((prev) => ({
          ...prev,
          historyCount: histories?.length || 0,
          recentCrop: histories?.[0]?.cropName || 'Maize'
        }));
      } catch (e) {
        console.error('Error loading dashboard:', e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.5), rgba(19, 28, 22, 0.9))',
        border: '1px solid var(--border-green)',
        borderRadius: 'var(--radius-xl)',
        padding: '30px 36px',
        marginBottom: '28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(34,197,94,0.15)', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: 'var(--accent-bright)', fontWeight: 600, marginBottom: '12px' }}>
            <span>🌱</span> KrishiMitra Precision Agriculture Portal
          </div>
          <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>
            Namaste, {user?.fullName || user?.username || 'Farmer'}! 🙏
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '640px' }}>
            Get science-backed crop recommendations based on your soil's NPK values, weather parameters, and query our Groq AI agricultural assistant.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/recommendation" className="btn btn-primary btn-lg">
            <span>🧪</span> Recommend Crop
          </Link>
          <Link to="/assistant" className="btn btn-secondary btn-lg">
            <span>💬</span> Ask AI
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">🌱</div>
          <div>
            <div className="stat-val">{stats.totalCrops}</div>
            <div className="stat-lbl">Supported Crop Types</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">🧪</div>
          <div>
            <div className="stat-val">7</div>
            <div className="stat-lbl">Soil & Climatic Features</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon yellow">🦠</div>
          <div>
            <div className="stat-val">{stats.diseaseCount}</div>
            <div className="stat-lbl">Plant Diseases Indexed</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">📋</div>
          <div>
            <div className="stat-val">{stats.historyCount}</div>
            <div className="stat-lbl">Farming Records Logged</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Quick Action Cards & Season Calendar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '28px' }}>
        {/* Quick Advisor */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">⚡ Quick Advisory Tools</h2>
              <p className="card-subtitle">One-click precision agriculture tools</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Link to="/recommendation" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)'
            }}>
              <div style={{ fontSize: '24px', padding: '10px', background: 'rgba(34,197,94,0.1)', borderRadius: '10px' }}>🧪</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Soil Suitability Analysis</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Input N, P, K & pH for instant crop prediction</div>
              </div>
            </Link>

            <Link to="/assistant" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)'
            }}>
              <div style={{ fontSize: '24px', padding: '10px', background: 'rgba(59,130,246,0.1)', borderRadius: '10px' }}>🤖</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Groq AI Agronomist</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Chat about pests, fertilization doses & schemes</div>
              </div>
            </Link>

            <Link to="/diseases" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              transition: 'var(--transition)'
            }}>
              <div style={{ fontSize: '24px', padding: '10px', background: 'rgba(234,179,8,0.1)', borderRadius: '10px' }}>🦠</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '15px' }}>Plant Disease Doctor</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Identify symptoms & apply organic/chemical controls</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Indian Cropping Seasons Guide */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">📅 Indian Crop Season Guide</h2>
              <p className="card-subtitle">Major cropping cycles across India</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ padding: '14px 18px', background: 'rgba(34,197,94,0.06)', borderLeft: '4px solid var(--accent)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: 'var(--accent-bright)' }}>Kharif Season (Monsoon)</span>
                <span className="badge badge-green">June – Oct</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Rice, Maize, Cotton, Soybean, Groundnut, Jute, Pigeon Pea (Arhar), Black Gram (Urad).
              </p>
            </div>

            <div style={{ padding: '14px 18px', background: 'rgba(59,130,246,0.06)', borderLeft: '4px solid #3b82f6', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: '#93c5fd' }}>Rabi Season (Winter)</span>
                <span className="badge badge-blue">Oct – March</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Wheat, Barley, Chickpea (Gram), Mustard, Lentils, Potato, Tomato.
              </p>
            </div>

            <div style={{ padding: '14px 18px', background: 'rgba(234,179,8,0.06)', borderLeft: '4px solid #eab308', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: '#fde047' }}>Zaid Season (Summer)</span>
                <span className="badge badge-yellow">March – June</span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Watermelon, Muskmelon, Cucumber, Vegetables, Fodder crops.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
