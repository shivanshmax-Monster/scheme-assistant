import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import './SchemeForm.css';

const SchemeForm = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        gender: '', age: '', maritalStatus: '',
        state: '', residence: '',
        category: '',
        disability: '', minority: '',
        student: '',
        bpl: '', familyIncome: ''
    });

    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const totalSteps = 6;

    const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
    const handlePrev = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:3000/api/match-form', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            setResults(data.schemes);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    const updateData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (results) {
        return (
            <div className="form-container">
                <h2 style={{color: 'var(--primary)', marginBottom: '20px'}}>We found {results.length} schemes based on your preferences</h2>
                <button onClick={() => setResults(null)} className="new-chat-btn" style={{width: 'auto', marginBottom: '20px'}}>Edit Profile</button>
                <div className="schemes-list" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                    {results.map((scheme, i) => (
                        <div key={i} className="scheme-card" style={{padding: '20px', background: 'var(--bg-panel)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)'}}>
                            <h3 style={{color: 'var(--primary)', marginBottom: '10px'}}>{scheme.name}</h3>
                            <p style={{color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px'}}>{scheme.department}</p>
                            <p style={{fontSize: '0.95rem'}}>{scheme.description}</p>
                            <div style={{display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap'}}>
                                {scheme.tags.map((tag, j) => (
                                    <span key={j} style={{padding: '4px 10px', background: 'rgba(139, 92, 246, 0.2)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.8rem'}}>{tag}</span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="form-container" style={{padding: '30px', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center'}}>
            <div style={{textAlign: 'center', marginBottom: '40px'}}>
                <h2 style={{marginBottom: '15px'}}>Help us find the best schemes for you</h2>
                <div className="progress-bar" style={{display: 'flex', justifyContent: 'center', gap: '10px', alignItems: 'center'}}>
                    {Array.from({ length: totalSteps }).map((_, i) => (
                        <div key={i} style={{display: 'flex', alignItems: 'center'}}>
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '50%', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                background: step > i + 1 ? 'var(--primary)' : step === i + 1 ? 'transparent' : 'transparent',
                                border: `2px solid ${step >= i + 1 ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                                color: step > i + 1 ? 'white' : step === i + 1 ? 'var(--primary)' : 'var(--text-secondary)'
                            }}>
                                {step > i + 1 ? <CheckCircle2 size={18} /> : (i + 1)}
                            </div>
                            {i < totalSteps - 1 && <div style={{width: '30px', height: '2px', background: step > i + 1 ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}}></div>}
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-step-content" style={{minHeight: '250px'}}>
                {step === 1 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*Tell us about yourself, you are a...</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {['Male', 'Female', 'Transgender'].map(g => (
                                    <button key={g} onClick={() => updateData('gender', g)} className={`selection-btn ${formData.gender === g ? 'selected' : ''}`} style={{flex: 1, padding: '15px', borderRadius: '8px', border: `1px solid ${formData.gender === g ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: formData.gender === g ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: formData.gender === g ? 'var(--primary)' : 'inherit', cursor: 'pointer'}}>{g}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*and your age is</label>
                            <input type="number" value={formData.age} onChange={e => updateData('age', e.target.value)} style={{width: '100px', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'inherit'}} /> years
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*What is your marital status?</label>
                            <select value={formData.maritalStatus} onChange={e => updateData('maritalStatus', e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-panel)', color: 'inherit'}}>
                                <option value="">Select</option>
                                <option value="Never Married">Never Married</option>
                                <option value="Married">Married</option>
                                <option value="Widowed">Widowed</option>
                                <option value="Divorced">Divorced</option>
                            </select>
                        </div>
                    </div>
                )}
                {step === 2 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>Please select your state</label>
                            <select value={formData.state} onChange={e => updateData('state', e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'var(--bg-panel)', color: 'inherit'}}>
                                <option value="">Select State</option>
                                <option value="Madhya Pradesh">Madhya Pradesh</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="Karnataka">Karnataka</option>
                                <option value="Delhi">Delhi</option>
                            </select>
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*Please select your area of residence</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {['Urban', 'Rural'].map(r => (
                                    <button key={r} onClick={() => updateData('residence', r)} className={`selection-btn ${formData.residence === r ? 'selected' : ''}`} style={{flex: 1, padding: '15px', borderRadius: '8px', border: `1px solid ${formData.residence === r ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: formData.residence === r ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: formData.residence === r ? 'var(--primary)' : 'inherit', cursor: 'pointer'}}>{r}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {step === 3 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*You belong to...</label>
                            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                {['General', 'Other Backward Class (OBC)', 'Particularly Vulnerable Tribal Group (PVTG)', 'Scheduled Caste (SC)', 'Scheduled Tribe (ST)'].map(c => (
                                    <button key={c} onClick={() => updateData('category', c)} className={`selection-btn ${formData.category === c ? 'selected' : ''}`} style={{textAlign: 'left', padding: '15px', borderRadius: '8px', border: `1px solid ${formData.category === c ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: formData.category === c ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: formData.category === c ? 'var(--primary)' : 'inherit', cursor: 'pointer'}}>{c}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {step === 4 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*Do you identify as a person with a disability?</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {['Yes', 'No'].map(d => (
                                    <button key={d} onClick={() => updateData('disability', d)} className={`selection-btn ${formData.disability === d ? 'selected' : ''}`} style={{flex: 1, padding: '15px', borderRadius: '8px', border: `1px solid ${formData.disability === d ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: formData.disability === d ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: formData.disability === d ? 'var(--primary)' : 'inherit', cursor: 'pointer'}}>{d}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*Do you belong to minority?</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {['Yes', 'No'].map(m => (
                                    <button key={m} onClick={() => updateData('minority', m)} className={`selection-btn ${formData.minority === m ? 'selected' : ''}`} style={{flex: 1, padding: '15px', borderRadius: '8px', border: `1px solid ${formData.minority === m ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: formData.minority === m ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: formData.minority === m ? 'var(--primary)' : 'inherit', cursor: 'pointer'}}>{m}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {step === 5 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*Are you a student?</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {['Yes', 'No'].map(s => (
                                    <button key={s} onClick={() => updateData('student', s)} className={`selection-btn ${formData.student === s ? 'selected' : ''}`} style={{flex: 1, padding: '15px', borderRadius: '8px', border: `1px solid ${formData.student === s ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: formData.student === s ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: formData.student === s ? 'var(--primary)' : 'inherit', cursor: 'pointer'}}>{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {step === 6 && (
                    <div style={{display: 'flex', flexDirection: 'column', gap: '25px'}}>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>*Do you belong to BPL category?</label>
                            <div style={{display: 'flex', gap: '10px'}}>
                                {['Yes', 'No'].map(b => (
                                    <button key={b} onClick={() => updateData('bpl', b)} className={`selection-btn ${formData.bpl === b ? 'selected' : ''}`} style={{flex: 1, padding: '15px', borderRadius: '8px', border: `1px solid ${formData.bpl === b ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`, background: formData.bpl === b ? 'rgba(139, 92, 246, 0.1)' : 'transparent', color: formData.bpl === b ? 'var(--primary)' : 'inherit', cursor: 'pointer'}}>{b}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label style={{display: 'block', marginBottom: '10px'}}>What is your family's annual income?</label>
                            <input type="number" value={formData.familyIncome} onChange={e => updateData('familyIncome', e.target.value)} style={{width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'inherit'}} />
                        </div>
                    </div>
                )}
            </div>

            <div style={{display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '40px'}}>
                {step > 1 && (
                    <button onClick={handlePrev} className="new-chat-btn" style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', width: 'auto'}}>
                        <ChevronLeft size={18} /> Back
                    </button>
                )}
                
                {step < totalSteps ? (
                    <button onClick={handleNext} className="new-chat-btn" style={{background: 'var(--primary)', color: 'white', border: 'none', width: 'auto'}}>
                        Next <ChevronRight size={18} />
                    </button>
                ) : (
                    <button onClick={handleSubmit} className="new-chat-btn" style={{background: 'var(--primary)', color: 'white', border: 'none', width: 'auto'}}>
                        {loading ? 'Searching...' : 'Submit'} <ChevronRight size={18} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SchemeForm;
