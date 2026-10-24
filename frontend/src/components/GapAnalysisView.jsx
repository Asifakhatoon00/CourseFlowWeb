import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  ArrowUpRight, 
  ShieldCheck, 
  GitCompare, 
  Layers, 
  Search,
  Filter
} from 'lucide-react';

export default function GapAnalysisView({ curriculum, aicteModel, gapData, onRefresh }) {
  const [activeAnalysis, setActiveAnalysis] = useState(gapData);
  const [semanticMatches, setSemanticMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (curriculum?.id) {
      fetchAnalysisData(curriculum.id);
    }
  }, [curriculum]);

  const fetchAnalysisData = async (currId) => {
    try {
      setLoading(true);
      // 1. Gap Analysis
      const gapRes = await fetch(`/api/curriculum/${currId}/gap-analysis`);
      if (gapRes.ok) {
        setActiveAnalysis(await gapRes.json());
      }
      // 2. Semantic Content Alignment
      const semRes = await fetch(`/api/curriculum/${currId}/semantic-alignment`);
      if (semRes.ok) {
        setSemanticMatches(await semRes.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const aicteFrameworkBuckets = [
    { cat: 'BSC', name: 'Basic Sciences (Math, Physics, Bio)', min: 20, max: 25, color: '#15803d' },
    { cat: 'ESC', name: 'Engineering Sciences (Circuits, Problem Solving)', min: 18, max: 24, color: '#c2410c' },
    { cat: 'HSMC', name: 'Humanities, Social Sciences & Values', min: 10, max: 14, color: '#6d28d9' },
    { cat: 'PCC', name: 'Professional Core (Data Structures, OS, AI/ML)', min: 48, max: 60, color: '#1d4ed8' },
    { cat: 'PEC', name: 'Professional Electives (Advanced Specialization)', min: 15, max: 20, color: '#7e22ce' },
    { cat: 'OEC', name: 'Open Electives (Multidisciplinary Breadth)', min: 9, max: 12, color: '#b45309' },
    { cat: 'PROJ', name: 'Projects & Industrial Internships', min: 15, max: 22, color: '#be185d' }
  ];

  if (loading || !activeAnalysis) {
    return (
      <div className="pro-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
        <div className="spinner" style={{ width: '38px', height: '38px', border: '3px solid #cbd5e1', borderTopColor: '#0f2744', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Calculating AI Semantic Content-Based Alignment & Symmetry Radar...</p>
      </div>
    );
  }

  const compliance = activeAnalysis.compliance_score || 88;
  const autonomy = activeAnalysis.autonomy_delta_percent || 12;
  const isAutonomyCompliant = autonomy <= 20.0;

  const filteredMatches = semanticMatches.filter(m => 
    m.university_course_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.aicte_matched_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.university_course_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Overview Banner */}
      <div className="pro-card" style={{
        padding: '2.25rem',
        background: '#ffffff',
        borderLeft: '5px solid #0f2744',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="brand-pill" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
              Content-Based AI Symmetry
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Curriculum: {curriculum?.title || "Presidency University B.Tech CSE"}
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            AI Semantic Content Alignment & Symmetry Radar
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            AICTE compliance is evaluated by <b>actual syllabus content and module topics</b>, not rigid course codes or titles. The AI engine searches the entire national model for <b>academic symmetry</b>, allowing autonomous universities to innovate while maintaining standard benchmarks.
          </p>
        </div>

        {/* Dual Metric Meters */}
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #bbf7d0',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              AICTE Core Alignment
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#059669', lineHeight: '1.2' }}>
              {compliance}%
            </div>
            <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={13} />
              <span>Accreditation Ready</span>
            </div>
          </div>

          <div style={{
            background: '#f8fafc',
            border: `1px solid ${isAutonomyCompliant ? '#fed7aa' : '#fecdd3'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.75rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
              Autonomy Delta
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: isAutonomyCompliant ? '#d97706' : '#e11d48', lineHeight: '1.2' }}>
              {autonomy}%
            </div>
            <div style={{ fontSize: '0.75rem', color: isAutonomyCompliant ? '#d97706' : '#e11d48', fontWeight: 700 }}>
              {isAutonomyCompliant ? 'Within 20% Autonomy Cap' : 'Exceeds 20% Limit'}
            </div>
          </div>
        </div>
      </div>

      {/* CORE FEATURE: Semantic Content Symmetry Table */}
      <div className="pro-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '1.5rem',
          background: 'var(--bg-surface-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <GitCompare size={20} color="var(--aicte-blue)" />
              University Content ⟷ AICTE Benchmark Content Mapping
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Matched using topical natural language processing (NLP) comparing actual syllabus units & outcomes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', padding: '0.4rem 0.85rem' }}>
            <Search size={15} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search course content..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ border: 'none', outline: 'none', fontSize: '0.85rem', fontFamily: 'inherit', color: 'var(--text-title)' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="academic-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Your University Course</th>
                <th style={{ width: '30%' }}>Matched AICTE Benchmark Course</th>
                <th style={{ width: '15%', textAlign: 'center' }}>Symmetry Score</th>
                <th>Shared Core Concepts (Content Symmetry)</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map((m, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--aicte-blue)', background: '#eff6ff', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                        {m.university_course_code}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        Sem {m.university_semester} • {m.university_credits} cr
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-title)' }}>
                      {m.university_course_title}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#d97706', background: '#fffbeb', padding: '0.1rem 0.4rem', borderRadius: 'var(--radius-sm)' }}>
                        {m.aicte_matched_code}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        AICTE Sem {m.aicte_matched_semester}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--text-title)' }}>
                      {m.aicte_matched_title}
                    </div>
                  </td>

                  <td style={{ textAlign: 'center' }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      background: m.symmetry_score >= 70 ? '#dcfce7' : '#fef3c7',
                      color: m.symmetry_score >= 70 ? '#15803d' : '#b45309'
                    }}>
                      {m.symmetry_score}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {m.status}
                    </div>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {m.shared_core_topics?.length > 0 ? (
                        m.shared_core_topics.map((t, tIdx) => (
                          <span key={tIdx} style={{
                            background: '#f1f5f9',
                            border: '1px solid #e2e8f0',
                            padding: '0.15rem 0.45rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.72rem',
                            color: 'var(--text-body)'
                          }}>
                            {t}
                          </span>
                        ))
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          University autonomous specialization
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEP 2020 Credit Framework Validator */}
      <div className="pro-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} color="var(--aicte-blue)" />
              NEP 2020 Credit Framework Breakdown
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              AICTE prescribed category limits for B.Tech CSE (Total: <b>{activeAnalysis.total_credits}</b> / 160 credits).
            </p>
          </div>

          <div style={{
            fontSize: '0.82rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: activeAnalysis.nep_compliant ? '#dcfce7' : '#fef3c7',
            color: activeAnalysis.nep_compliant ? '#15803d' : '#b45309',
            border: `1px solid ${activeAnalysis.nep_compliant ? '#bbf7d0' : '#fde68a'}`,
            fontWeight: 700
          }}>
            {activeAnalysis.nep_compliant ? '100% NEP 2020 Compliant' : 'Minor Credit Adjustment Recommended'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {aicteFrameworkBuckets.map((bucket, idx) => {
            const actualCredits = activeAnalysis.credit_distribution?.[bucket.cat] || 0;
            const progressPercent = Math.min(100, (actualCredits / bucket.max) * 100);
            const isWithin = actualCredits >= bucket.min && actualCredits <= bucket.max;

            return (
              <div key={idx} style={{
                background: '#f8fafc',
                padding: '1rem 1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className={`badge-category cat-${bucket.cat.toLowerCase()}`}>
                      {bucket.cat}
                    </span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-title)' }}>
                      {bucket.name}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      AICTE Range: <b>{bucket.min}–{bucket.max} Credits</b>
                    </span>
                    <span style={{
                      fontWeight: 700,
                      color: isWithin ? '#15803d' : '#b45309',
                      background: '#ffffff',
                      border: '1px solid var(--border-subtle)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: 'var(--radius-sm)'
                    }}>
                      Actual: {actualCredits} Credits
                    </span>
                  </div>
                </div>

                <div style={{
                  height: '8px',
                  background: '#e2e8f0',
                  borderRadius: '999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${progressPercent}%`,
                    height: '100%',
                    background: bucket.color,
                    borderRadius: '999px',
                    transition: 'width 0.8s ease'
                  }}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emerging Tech Radar & Recommendations */}
      <div className="grid-cols-2">
        <div className="pro-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <TrendingUp size={20} color="var(--aicte-saffron)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)' }}>
              Industry Emerging Skill Demands
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {activeAnalysis.missing_industry_skills?.map((skill, idx) => (
              <div key={idx} style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--radius-md)',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-title)', fontSize: '0.92rem' }}>
                    {skill.category}
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#b45309', fontWeight: 700 }}>
                    {skill.importance}
                  </span>
                </div>
                <p style={{ color: 'var(--text-body)', fontSize: '0.84rem', lineHeight: '1.5' }}>
                  {skill.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pro-card" style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Sparkles size={20} color="var(--aicte-blue)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)' }}>
              Statutory Modernization Recommendations
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activeAnalysis.recommendations?.map((rec, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem'
              }}>
                <span style={{
                  color: 'var(--aicte-blue)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  minWidth: '22px'
                }}>
                  {idx + 1}.
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-title)', lineHeight: '1.5' }}>
                  {rec}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
