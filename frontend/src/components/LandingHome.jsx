import React from 'react';
import { 
  GraduationCap, 
  UploadCloud, 
  Layers, 
  ArrowRight, 
  BookOpen, 
  BrainCircuit,
  Building2,
  LogIn,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  FileDown
} from 'lucide-react';

export default function LandingHome({ 
  setActiveTab, 
  aicteModel, 
  universityCurriculum, 
  activeUniversity,
  currentUser,
  onOpenAuth,
  onQuickDemoLogin
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Executive Academic Hero Banner */}
      <div className="pro-card" style={{
        padding: '3rem 2.5rem',
        background: 'linear-gradient(135deg, #07192f 0%, #0f2744 65%, #1e3a8a 100%)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 30px rgba(15, 39, 68, 0.2)'
      }}>
        {/* Subtle decorative glow */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          top: '-50px',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(217, 119, 6, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '840px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', background: 'rgba(255, 255, 255, 0.12)', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', marginBottom: '1.25rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }}></span>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#f8fafc' }}>
              Academic Higher Education Platform • NEP 2020 Framework
            </span>
          </div>

          <h1 style={{ fontSize: '2.3rem', fontWeight: 800, lineHeight: '1.25', letterSpacing: '-0.02em', marginBottom: '1rem', color: '#ffffff' }}>
            Unified Academic Portal for Model Curriculum Governance & Content Symmetry
          </h1>

          <p style={{ fontSize: '1.05rem', lineHeight: '1.65', color: '#cbd5e1', marginBottom: '2rem' }}>
            A national digital framework for technical universities and autonomous colleges to <b>ingest syllabus regulation PDFs</b>, segregate them into <b>Semester 1–8 schemes with L-T-P-C credits</b>, empower faculty with <b>AI module intelligence</b>, and enforce <b>Board of Studies (BOS) HOD quality review</b> before publication.
          </p>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            {!currentUser ? (
              <>
                <button 
                  className="btn-accent"
                  onClick={() => onOpenAuth('signin')}
                  style={{ fontSize: '0.92rem', padding: '0.75rem 1.5rem' }}
                >
                  <LogIn size={17} />
                  <span>Sign In to Academic Workspace</span>
                </button>

                <button 
                  className="btn-secondary"
                  onClick={() => onOpenAuth('register')}
                  style={{ fontSize: '0.92rem', padding: '0.75rem 1.5rem', background: 'rgba(255, 255, 255, 0.12)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}
                >
                  <Building2 size={17} />
                  <span>Register University</span>
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: 'rgba(255, 255, 255, 0.12)', padding: '0.65rem 1.25rem', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <span style={{ fontSize: '0.88rem', color: '#f8fafc' }}>
                  Signed in as <b>{currentUser.name}</b> ({currentUser.role === 'university_admin' ? 'Dean' : currentUser.role === 'hod' ? 'HOD' : 'Faculty'})
                </span>
              </div>
            )}

            <button 
              className="btn-secondary"
              onClick={() => setActiveTab('aicte-model')}
              style={{ fontSize: '0.92rem', padding: '0.75rem 1.5rem', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}
            >
              <Layers size={17} />
              <span>Model Curriculum Benchmark</span>
            </button>

            <button 
              className="btn-secondary"
              onClick={() => setActiveTab('bloom-audit')}
              style={{ fontSize: '0.92rem', padding: '0.75rem 1.5rem', background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.25)' }}
            >
              <BrainCircuit size={17} />
              <span>Bloom's Cognitive Auditor</span>
            </button>

            <a 
              href="/CourseFlow_Final_Project_Report.docx" 
              download="CourseFlow_Final_Project_Report.docx"
              style={{ 
                fontSize: '0.92rem', 
                padding: '0.75rem 1.5rem', 
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                background: '#047857',
                border: '1px solid #059669',
                borderRadius: 'var(--radius-md)',
                color: '#ffffff',
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(4, 120, 87, 0.35)',
                transition: 'all 0.2s ease'
              }}
              title="Download editable Microsoft Word Project Report (.docx)"
            >
              <FileDown size={18} />
              <span>Download Project Report (.docx)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Quick Test Demo Accounts Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Instant Evaluation Roles (1-Click Test Access):
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-title)', marginTop: '0.2rem' }}>
            Experience multi-tier institutional governance without typing credentials.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onQuickDemoLogin('dean.socse@presidencyuniversity.in', 'admin123')}
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#0f2744',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>🎓 Dean Dr. Ramesh Sharma (Admin)</span>
          </button>

          <button
            onClick={() => onQuickDemoLogin('hod.cse@presidencyuniversity.in', 'hod123')}
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#d97706',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>🏛️ HOD Dr. Suresh Babu (Reviewer)</span>
          </button>

          <button
            onClick={() => onQuickDemoLogin('faculty.daa@presidencyuniversity.in', 'faculty123')}
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#1e40af',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            <span>👨‍🏫 Faculty Prof. Rajesh Kumar (DAA)</span>
          </button>
        </div>
      </div>

      {/* Clean Governance & Architecture Overview (No Repetitive Icon Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.75rem' }}>
        
        {/* Left: Statutory Compliance & National Framework */}
        <div className="pro-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ width: '4px', height: '18px', background: 'var(--aicte-blue)', borderRadius: '2px' }}></span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)' }}>
              Statutory Benchmarks & Institutional Flexibility
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.88rem', color: 'var(--text-body)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-title)' }}>National Credit Standard (NEP 2020)</span>
              <span style={{ fontWeight: 800, color: 'var(--aicte-blue)', fontFamily: 'var(--font-mono)' }}>160 Credits (4-Year B.Tech)</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-title)' }}>Institutional Autonomy Ratio</span>
              <span style={{ fontWeight: 800, color: '#d97706', fontFamily: 'var(--font-mono)' }}>80% Core : 20% Flexible</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-title)' }}>Active Institutional Baseline</span>
              <span style={{ fontWeight: 800, color: '#059669', fontFamily: 'var(--font-mono)' }}>
                {activeUniversity?.name || "Presidency University"} (Batch {universityCurriculum?.batch || "2023-2027"})
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-title)' }}>Accreditation Framework</span>
              <span style={{ fontWeight: 800, color: '#7c3aed', fontFamily: 'var(--font-mono)' }}>Tier-1 NBA / NAAC Outcome-Based</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-title)' }}>Cognitive Evaluation Model</span>
              <span style={{ fontWeight: 800, color: 'var(--text-title)', fontFamily: 'var(--font-mono)' }}>Revised Bloom's Taxonomy (L1–L6)</span>
            </div>
          </div>
        </div>

        {/* Right: Academic Governance Lifecycle */}
        <div className="pro-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <span style={{ width: '4px', height: '18px', background: '#d97706', borderRadius: '2px' }}></span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)' }}>
              End-to-End Governance Workflow
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', color: 'var(--aicte-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                1
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-title)' }}>PDF Scheme Ingestion</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Uploads regulation documents and extracts Sem 1–8 schemes with course codes, L-T-P-C patterns, and module units.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', color: 'var(--aicte-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                2
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-title)' }}>Faculty Course Allotment</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Dean & HOD assign specific courses (e.g. Design & Analysis of Algorithms) to subject matter specialists.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', color: 'var(--aicte-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                3
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-title)' }}>Faculty Drafting & AI Advisor</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Faculty refines module topics, prunes obsolete techniques, and adopts cutting-edge topics with 1 click.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', color: 'var(--aicte-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                4
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-title)' }}>Board of Studies (BOS) HOD Review</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  HOD audits proposed changes against departmental guidelines before approving into the scheme.
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#eff6ff', color: 'var(--aicte-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 800, flexShrink: 0 }}>
                5
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-title)' }}>Outcome-Based Education & Bloom's Audit</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  Audits cognitive distribution across Bloom's Taxonomy levels (L1–L6) for accreditation compliance and curricular rigor.
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
