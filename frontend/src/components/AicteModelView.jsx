import React, { useState } from 'react';
import { 
  Layers, 
  Award, 
  GitFork, 
  ChevronRight,
  Filter,
  Info
} from 'lucide-react';

export default function AicteModelView({ aicteModel, onSelectCourse, onInheritModel, currentRole }) {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  if (!aicteModel) {
    return (
      <div className="pro-card" style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="spinner" style={{ width: '36px', height: '36px', border: '3px solid #cbd5e1', borderTopColor: '#0f2744', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading official AICTE Model Curriculum framework...</p>
      </div>
    );
  }

  const activeSemData = aicteModel.semesters?.find(s => s.semester_number === selectedSemester);
  const courses = activeSemData?.courses || [];

  const filteredCourses = categoryFilter === 'ALL' 
    ? courses 
    : courses.filter(c => c.category === categoryFilter);

  const categories = ['ALL', 'BSC', 'ESC', 'HSMC', 'PCC', 'PEC', 'OEC', 'PROJ', 'MC'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Banner Card */}
      <div className="pro-card" style={{
        padding: '2.25rem',
        background: '#ffffff',
        borderLeft: '5px solid #0f2744',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="brand-pill" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
              National Baseline Model
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              AICTE Gazette Notification 2024-25
            </span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {aicteModel.title}
          </h1>
          <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Official 160-Credit Model Curriculum framework designed by AICTE Central Committee. Incorporates Outcome-Based Education (OBE), Bloom's Taxonomy, and NEP 2020 multidisciplinary standards for all approved engineering institutes.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '220px' }}>
          <div style={{ display: 'flex', gap: '1rem', background: 'var(--bg-surface-subtle)', padding: '0.85rem 1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Target Credits</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2744' }}>160.0</div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Semesters</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f2744' }}>8</div>
            </div>
          </div>

          {currentRole === 'university_admin' && (
            <button 
              className="btn-accent"
              onClick={onInheritModel}
              title="Inherit this AICTE model into your University repository"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <GitFork size={16} />
              <span>Inherit / Clone for Institute</span>
            </button>
          )}
        </div>
      </div>

      {/* Credit Distribution Metrics */}
      <div className="grid-cols-4">
        <div className="metric-card" style={{ borderLeftColor: '#1d4ed8' }}>
          <div className="metric-label">Professional Core (PCC)</div>
          <div className="metric-value" style={{ color: '#1d4ed8' }}>50–55</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Core CS, Algorithms, OS, Networks, AI/ML</div>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#15803d' }}>
          <div className="metric-label">Basic Sciences (BSC)</div>
          <div className="metric-value" style={{ color: '#15803d' }}>20–24</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Calculus, Discrete Math, Physics, Probability</div>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#7e22ce' }}>
          <div className="metric-label">Electives & Open (PEC + OEC)</div>
          <div className="metric-value" style={{ color: '#7e22ce' }}>24–30</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Cloud, Web3, Green Computing, IPR</div>
        </div>
        <div className="metric-card" style={{ borderLeftColor: '#be185d' }}>
          <div className="metric-label">Project & Internships (PROJ)</div>
          <div className="metric-value" style={{ color: '#be185d' }}>18–22</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Summer Internship + Capstone Phase I & II</div>
        </div>
      </div>

      {/* Semester Selector Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem', background: '#ffffff', padding: '0.4rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)', overflowX: 'auto', maxWidth: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
            const semCredits = aicteModel.semesters?.find(s => s.semester_number === sem)?.total_credits || 0;
            const isActive = selectedSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                style={{
                  background: isActive ? '#0f2744' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-body)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.55rem 0.95rem',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '82px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 3px 8px rgba(15,39,68,0.25)' : 'none'
                }}
              >
                <span>Sem {sem}</span>
                <span style={{ fontSize: '0.68rem', opacity: isActive ? 0.9 : 0.65, fontWeight: 500 }}>
                  {semCredits} cr
                </span>
              </button>
            );
          })}
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={15} color="var(--text-muted)" />
          <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  background: categoryFilter === cat ? '#0f2744' : '#ffffff',
                  color: categoryFilter === cat ? '#ffffff' : 'var(--text-body)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.3rem 0.6rem',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Cards for Selected Semester */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Semester {selectedSemester} Model Curriculum</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              ({filteredCourses.length} courses • {activeSemData?.total_credits || 0} credits)
            </span>
          </h3>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Click on any course card to view full syllabus & Bloom's outcomes
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filteredCourses.map((course, idx) => (
            <div 
              key={idx}
              className="pro-card-interactive"
              onClick={() => onSelectCourse(course)}
              style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.65rem' }}>
                  <span className={`badge-category cat-${course.category?.toLowerCase() || 'pcc'}`}>
                    {course.category}
                  </span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--aicte-blue)',
                    background: '#eff6ff',
                    padding: '0.15rem 0.45rem',
                    borderRadius: 'var(--radius-sm)'
                  }}>
                    {course.code}
                  </span>
                </div>

                <h4 style={{ fontSize: '1.02rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.5rem', lineHeight: '1.4' }}>
                  {course.title}
                </h4>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description || "Comprehensive syllabus modules covering theory, problem solving, and modern real-world laboratory paradigms."}
                </p>
              </div>

              <div>
                <div style={{
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.78rem'
                }}>
                  <span style={{ color: '#059669', fontWeight: 700 }}>
                    {course.credits} Credits ({course.lecture_hours || 3}L-{course.tutorial_hours || 0}T-{course.practical_hours || 0}P)
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--aicte-blue)', fontWeight: 700 }}>
                    <span>View Units ({course.units?.length || 0})</span>
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
