import { CheckCircle2, ArrowRight } from 'lucide-react';
import './SchemeCard.css';

export default function SchemeCard({ scheme }) {
  return (
    <div className="scheme-card">
      <div className="scheme-header">
        <span className="match-badge">{scheme.matchScore}% Match</span>
        <span className="department">{scheme.department}</span>
      </div>
      <h3>{scheme.name}</h3>
      <p className="description">{scheme.description}</p>
      
      {scheme.tags && (
        <div className="tags" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {scheme.tags.map((tag, i) => (
            <span key={i} style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent-primary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '500' }}>#{tag}</span>
          ))}
        </div>
      )}
      
      <div className="details-section">
        <div className="benefits">
          <h4>Key Benefits</h4>
          <ul>
            {scheme.benefits.map((b, i) => (
              <li key={i}><CheckCircle2 size={16} color="#10b981" /> {b}</li>
            ))}
          </ul>
        </div>
        
        <div className="eligibility">
          <h4>Your Eligibility Flags</h4>
          <ul>
            {scheme.eligibility.map((e, i) => (
              <li key={i}><CheckCircle2 size={16} color="#8b5cf6" /> {e}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <button 
        className="apply-btn" 
        onClick={() => window.open(scheme.url || 'https://www.myscheme.gov.in/', '_blank')}
      >
        Apply Now <ArrowRight size={16} />
      </button>
    </div>
  );
}
