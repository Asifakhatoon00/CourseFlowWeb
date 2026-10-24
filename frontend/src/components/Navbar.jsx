import React from 'react';
import { 
  GraduationCap, 
  Home,
  UserCheck, 
  BookOpen, 
  Layers, 
  UploadCloud, 
  GitCompare, 
  BrainCircuit, 
  Building2,
  Users,
  LogIn,
  LogOut,
  Clock,
  ChevronDown,
  FileDown
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  onOpenAuth, 
  onLogout, 
  onSwitchPersona,
  activeTab, 
  setActiveTab, 
  universityInfo,
  pendingReviewCount = 0
}) {
  const currentRole = currentUser?.role || 'guest';

  const getTabsForRole = (role) => {
    switch (role) {
      case 'faculty':
        return [
          { id: 'my-courses', label: 'My Allotted Courses', icon: BookOpen },
          { id: 'university-curriculum', label: 'University Curriculum (Sem 1–8)', icon: GraduationCap },
          { id: 'bloom-audit', label: "Bloom's Cognitive Auditor", icon: BrainCircuit },
          { id: 'home', label: 'Home / Overview', icon: Home }
        ];
      case 'hod':
        return [
          { id: 'review-queue', label: 'Curriculum Review Queue', icon: Clock, countBadge: pendingReviewCount },
          { id: 'university-curriculum', label: 'University Curriculum (Sem 1–8)', icon: GraduationCap },
          { id: 'bloom-audit', label: "Bloom's Cognitive Auditor", icon: BrainCircuit },
          { id: 'home', label: 'Home / Overview', icon: Home }
        ];
      case 'university_admin':
        return [
          { id: 'admin-console', label: 'Institute Administration', icon: Users },
          { id: 'upload-studio', label: 'PDF Ingestion Studio', icon: UploadCloud, badge: 'Dean' },
          { id: 'university-curriculum', label: 'University Curriculum (Sem 1–8)', icon: GraduationCap },
          { id: 'home', label: 'Home / Overview', icon: Home }
        ];
      case 'student':
      case 'guest':
      default:
        return [
          { id: 'home', label: 'Home / Overview', icon: Home },
          { id: 'aicte-model', label: 'Model Curriculum Benchmark', icon: Layers },
          { id: 'bloom-audit', label: "Bloom's Cognitive Auditor", icon: BrainCircuit }
        ];
    }
  };

  const tabs = getTabsForRole(currentRole);

  return (
    <header>
      {/* Official Top Ministry Banner */}
      <div className="govt-banner-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span><b>HIGHER TECHNICAL EDUCATION</b> • ACADEMIC CURRICULUM PORTAL</span>
          <span>|</span>
          <span>CURRICULUM INGESTION & SYLLABUS GOVERNANCE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>National Education Policy (NEP 2020)</span>
          <span>|</span>
          <span>National Credit Framework (NCrF)</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="app-header">
        <div className="brand-wrapper" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
          <div className="brand-logo-badge">
            <GraduationCap size={28} />
          </div>
          <div>
            <div className="brand-title">
              CourseFlow
              <span className="brand-pill">Unified Curriculum Portal</span>
            </div>
            <div className="brand-subtitle">
              Unified Model Curriculum Ingestion, Content Symmetry & OBE Governance System
            </div>
          </div>
        </div>

        {/* Global Persona Quick Switcher & Auth Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          
          {/* Direct Download Word Report Button */}
          <a
            href="/CourseFlow_Final_Project_Report.docx"
            download="CourseFlow_Final_Project_Report.docx"
            style={{
              background: '#047857',
              color: '#ffffff',
              border: '1px solid #065f46',
              borderRadius: 'var(--radius-md)',
              padding: '0.42rem 0.85rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              textDecoration: 'none',
              boxShadow: '0 1px 3px rgba(4, 120, 87, 0.25)',
              transition: 'background 0.15s ease'
            }}
            title="Download editable Microsoft Word Project Report (.docx)"
          >
            <FileDown size={14} />
            <span>Download Report (.docx)</span>
          </a>

          {/* Quick Persona Dropdown for instant role testing */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)' }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Role:
            </span>
            <select
              value={currentUser?.email || 'guest'}
              onChange={(e) => onSwitchPersona && onSwitchPersona(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.5rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: 'var(--text-title)',
                cursor: 'pointer'
              }}
            >
              <option value="dean.socse@presidencyuniversity.in">🎓 Dean Dr. Ramesh Sharma (Admin)</option>
              <option value="hod.cse@presidencyuniversity.in">🏛️ HOD Dr. Suresh Babu (Reviewer)</option>
              <option value="faculty.daa@presidencyuniversity.in">👨‍🏫 Faculty Prof. Rajesh Kumar (DAA)</option>
              <option value="faculty.ds@presidencyuniversity.in">👩‍🏫 Faculty Dr. Meenakshi Sundaram (DS)</option>
              <option value="guest">🌐 Guest / Student (Read-Only)</option>
            </select>
          </div>

          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={onLogout}
                style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.75rem',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Sign out of current session"
              >
                <LogOut size={13} />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={() => onOpenAuth('signin')}
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: 'var(--text-title)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <LogIn size={14} />
                <span>Sign In</span>
              </button>

              <button
                onClick={() => onOpenAuth('register')}
                className="btn-accent"
                style={{
                  padding: '0.45rem 0.85rem',
                  fontSize: '0.82rem'
                }}
              >
                <Building2 size={14} />
                <span>Register</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tab Strip */}
      <nav className="nav-tab-strip">
        {tabs.map(tab => {
          if (tab.showForRoles && !tab.showForRoles.includes(currentRole)) {
            return null;
          }
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              
              {tab.countBadge > 0 && (
                <span style={{
                  fontSize: '0.68rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  background: '#d97706',
                  color: '#ffffff',
                  fontWeight: 800,
                  marginLeft: '0.35rem'
                }}>
                  {tab.countBadge}
                </span>
              )}

              {tab.badge && (
                <span style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  background: 'rgba(255,255,255,0.2)',
                  color: '#ffffff',
                  fontWeight: 700,
                  marginLeft: '0.35rem'
                }}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
