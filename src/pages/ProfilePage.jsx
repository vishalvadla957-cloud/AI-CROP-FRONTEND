import React from 'react';
import { useAuth } from '../context/AuthContext';

export function ProfilePage() {
  const { user, logout } = useAuth();

  const schemes = [
    { name: 'PM-KISAN', desc: 'Direct income support of ₹6,000 per year in 3 equal installments to landholding farmer families.', link: 'https://pmkisan.gov.in', tag: 'Income Support' },
    { name: 'PM Fasal Bima Yojana (PMFBY)', desc: 'Subsidized crop insurance coverage against natural disasters, pests, and yield loss (2% Kharif, 1.5% Rabi).', link: 'https://pmfby.gov.in', tag: 'Insurance' },
    { name: 'Kisan Credit Card (KCC)', desc: 'Concessional institutional credit up to ₹3 Lakhs at 4% interest rate for agricultural inputs and machinery.', link: 'https://myscheme.gov.in', tag: 'Credit / Loan' },
    { name: 'Soil Health Card Scheme', desc: 'Periodic soil testing and customized NPK & micronutrient recommendation cards issued free of cost.', link: 'https://soilhealth.dac.gov.in', tag: 'Soil Testing' },
    { name: 'National Agriculture Market (e-NAM)', desc: 'Pan-India electronic trading portal integrating agricultural markets for competitive transparent bidding.', link: 'https://enam.gov.in', tag: 'E-Market' }
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '26px', marginBottom: '6px' }}>👤 Farmer Profile & Welfare Center</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Manage your account information and explore central agricultural welfare schemes.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Profile Card */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              width: '72px',
              height: '72px',
              background: 'linear-gradient(135deg, #065f46, #059669)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '28px',
              fontWeight: 800,
              border: '3px solid var(--border-green)'
            }}>
              {(user?.fullName || user?.username || 'F').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '22px', fontWeight: 800 }}>{user?.fullName || user?.username || 'Farmer'}</h2>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <span className="badge badge-green">{user?.role || 'FARMER'}</span>
                <span className="badge badge-blue">{user?.state || 'Punjab, India'}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Username</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{user?.username}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Primary State</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{user?.state || 'Punjab'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>District</span>
              <strong style={{ color: 'var(--text-primary)', fontSize: '14px' }}>{user?.district || 'Registered Zone'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius-md)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Platform Access</span>
              <span className="badge badge-green">Active (24h JWT)</span>
            </div>
          </div>

          <div style={{ marginTop: '24px' }}>
            <button className="btn btn-danger" style={{ width: '100%' }} onClick={logout}>
              <span>🚪</span> Sign Out of Account
            </button>
          </div>
        </div>

        {/* Government Welfare Schemes */}
        <div className="card">
          <div className="card-header">
            <div>
              <h2 className="card-title">🏛️ Government Agricultural Schemes</h2>
              <p className="card-subtitle">Direct benefits, subsidies, and credit facilities</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {schemes.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '14px 18px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'var(--transition)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <strong style={{ color: 'var(--accent-bright)', fontSize: '15px' }}>{s.name}</strong>
                  <span className="badge badge-blue">{s.tag}</span>
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '8px' }}>
                  {s.desc}
                </p>
                <a
                  href={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: '#93c5fd', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                >
                  Visit Official Portal ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
