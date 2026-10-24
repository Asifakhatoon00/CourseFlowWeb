import React, { useState, useEffect } from 'react';
import { BrainCircuit, Award, CheckCircle2, AlertCircle, Sparkles, Filter, ChevronRight } from 'lucide-react';

export default function BloomAuditView({ curriculum, onSelectCourse }) {
  const [auditResults, setAuditResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);

  useEffect(() => {
    if (curriculum?.id) {
      fetchBloomAudit(curriculum.id);
    }
  }, [curriculum]);

  const fetchBloomAudit = async (currId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/curriculum/${currId}/bloom-audit`);
      if (res.ok) {
        const data = await res.json();
        setAuditResults(data);
        if (data.length > 0) {
          setSelectedCourseCode(data[0].course_code);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const bloomLevels = [
    { level: 'Remember', color: '#475569', bg: '#f1f5f9', desc: 'Recall facts, basic terminology & definitions' },
    { level: 'Understand', color: '#0369a1', bg: '#e0f2fe', desc: 'Explain concepts, interpret schemas & ideas' },
    { level: 'Apply', color: '#15803d', bg: '#dcfce7', desc: 'Execute algorithms, solve numerical problems' },
    { level: 'Analyze', color: '#b45309', bg: '#fef3c7', desc: 'Differentiate, compare and decompose systems' },
    { level: 'Evaluate', color: '#be123c', bg: '#ffe4e6', desc: 'Assess, critique and validate architectures' },
    { level: 'Create', color: '#7e22ce', bg: '#f3e8ff', desc: 'Design, formulate and construct prototypes' }
  ];

  const totalByLevel = { Remember: 0, Understand: 0, Apply: 0, Analyze: 0, Evaluate: 0, Create: 0 };
  auditResults.forEach(r => {
    for (const [lvl, count] of Object.entries(r.distribution || {})) {
      if (totalByLevel[lvl] !== undefined) totalByLevel[lvl] += count;
    }
  });

  const totalCOs = Object.values(totalByLevel).reduce((a, b) => a + b, 0) || 1;
  const activeCourseAudit = auditResults.find(r => r.course_code === selectedCourseCode);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Overview Banner */}
      <div className="pro-card" style={{
        padding: '2.25rem',
        background: '#ffffff',
        borderLeft: '5px solid #7c3aed',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="brand-pill" style={{ background: '#faf5ff', color: '#7c3aed', borderColor: '#e9d5ff' }}>
              Outcome-Based Education (OBE)
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Accreditation Validator (NBA Tier-1 & AICTE Norms)
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            Bloom's Revised Taxonomy Cognitive Auditor
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            NLP-powered analyzer that inspects action verbs across all Course Outcomes (CO1 to CO5). Verifies whether courses offer sufficient higher-order cognitive challenge (Level 4–6: Analyze, Evaluate, Create).
          </p>
        </div>

        <div style={{
          background: '#f8fafc',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem 1.75rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Audited Outcomes</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#7c3aed', lineHeight: '1.2' }}>
            {totalCOs}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Across {auditResults.length} courses
          </div>
        </div>
      </div>

      {/* Aggregate Cognitive Distribution Grid */}
      <div className="pro-card" style={{ padding: '1.75rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Award size={18} color="var(--aicte-saffron)" />
          Curriculum-Wide Cognitive Depth Distribution
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
          {bloomLevels.map(b => {
            const count = totalByLevel[b.level] || 0;
            const pct = Math.round((count / totalCOs) * 100);
            return (
              <div key={b.level} style={{
                background: b.bg,
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                borderTop: `4px solid ${b.color}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: b.color }}>
                    {b.level}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {pct}%
                  </span>
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.25rem' }}>
                  {count} COs
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {b.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Course-by-Course Audit List */}
      <div className="grid-cols-2">
        <div className="pro-card" style={{ padding: '1.5rem', maxHeight: '560px', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '1rem' }}>
            Select Course to Audit ({auditResults.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {auditResults.map(r => {
              const isSelected = selectedCourseCode === r.course_code;
              return (
                <div 
                  key={r.course_code}
                  onClick={() => setSelectedCourseCode(r.course_code)}
                  style={{
                    background: isSelected ? '#eff6ff' : '#f8fafc',
                    border: `1px solid ${isSelected ? '#93c5fd' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--aicte-blue)', fontWeight: 700 }}>
                      {r.course_code}
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-title)' }}>
                      {r.course_title}
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    background: r.balance_rating?.includes('Excellent') ? '#dcfce7' : '#fef3c7',
                    color: r.balance_rating?.includes('Excellent') ? '#15803d' : '#b45309',
                    fontWeight: 700
                  }}>
                    {r.balance_rating?.includes('Excellent') ? 'OBE High-Rigor' : 'Moderate'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pro-card" style={{ padding: '1.75rem' }}>
          {activeCourseAudit ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.85rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--aicte-blue)', fontWeight: 700 }}>
                    {activeCourseAudit.course_code}
                  </span>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)' }}>
                    {activeCourseAudit.course_title}
                  </h3>
                </div>
                <div style={{
                  background: '#faf5ff',
                  border: '1px solid #e9d5ff',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.78rem',
                  color: '#7c3aed',
                  fontWeight: 700
                }}>
                  {activeCourseAudit.balance_rating}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem', fontWeight: 700 }}>
                  Course Outcome Cognitive Breakdown
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {Object.entries(activeCourseAudit.distribution || {}).map(([lvl, count]) => (
                    <div key={lvl} style={{
                      background: '#f8fafc',
                      padding: '0.65rem',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border-subtle)'
                    }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{lvl}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)' }}>{count} COs</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem', fontWeight: 700 }}>
                  AI OBE Optimization Insights
                </div>
                {activeCourseAudit.feedback?.map((f, fIdx) => (
                  <div key={fIdx} style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.85rem',
                    fontSize: '0.84rem',
                    color: 'var(--text-title)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <Sparkles size={16} color="#059669" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Select a course from the left panel to inspect its Bloom's Taxonomy breakdown.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
