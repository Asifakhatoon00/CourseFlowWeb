import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  UserPlus, 
  Users, 
  CheckCircle2, 
  Shield, 
  BookOpen, 
  X,
  Mail,
  Lock,
  GraduationCap
} from 'lucide-react';

export default function UniversityAdminConsole({ 
  activeUniversity, 
  universityCurriculum,
  onRegisterUniversity, 
  currentRole,
  showToast 
}) {
  const [staffList, setStaffList] = useState([]);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // Add staff form state
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('faculty123');
  const [staffRole, setStaffRole] = useState('faculty'); // 'hod' or 'faculty'
  const [staffDesignation, setStaffDesignation] = useState('Assistant Professor');
  const [staffDept, setStaffDept] = useState('Computer Science & Engineering');
  const [assignedCourseCode, setAssignedCourseCode] = useState('');

  // Extract all courses from curriculum for the dropdown
  const allCourses = [];
  if (universityCurriculum?.semesters) {
    universityCurriculum.semesters.forEach(s => {
      if (s.courses) {
        s.courses.forEach(c => {
          allCourses.push({ code: c.code, title: c.title, semester: s.semester_number });
        });
      }
    });
  }

  useEffect(() => {
    fetchStaff();
  }, [activeUniversity]);

  const fetchStaff = async () => {
    if (!activeUniversity?.id) return;
    setLoadingStaff(true);
    try {
      const res = await fetch(`/api/staff/${activeUniversity.id}`);
      if (res.ok) {
        const data = await res.json();
        setStaffList(data.staff || []);
      }
    } catch (e) {
      console.error("Error fetching staff:", e);
    } finally {
      setLoadingStaff(false);
    }
  };

  const handleAddStaffSubmit = async (e) => {
    e.preventDefault();
    if (!staffName || !staffEmail || !staffPassword) {
      if (showToast) showToast("Please fill all required staff fields.");
      return;
    }

    try {
      const res = await fetch(`/api/staff/add?univ_id=${activeUniversity?.id || 'univ-presidency-01'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: staffName.trim(),
          email: staffEmail.trim(),
          password: staffPassword.trim(),
          role: staffRole,
          designation: staffDesignation,
          department: staffDept,
          assigned_course_code: assignedCourseCode || null
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (showToast) {
          showToast(`Successfully appointed ${staffName} as ${staffRole === 'hod' ? 'HOD' : 'Faculty'}!`);
        }
        setShowAddStaffModal(false);
        setStaffName('');
        setStaffEmail('');
        setAssignedCourseCode('');
        fetchStaff();
      } else {
        if (showToast) showToast(data.detail || "Error appointing staff.");
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Network error appointing staff.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Executive Header Banner */}
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
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem' }}>
            <span className="brand-pill" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
              Institutional Governance
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              AICTE Institutional ID: {activeUniversity?.aicte_approval_id || "PU/AC-21.5/SoCSE2/CSE/2023-2027"}
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            {activeUniversity?.name || "Presidency University (School of Computer Science & Engineering)"}
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Academic Council Administration Console: Appoint Heads of Department (HODs) and Course Faculty, assign specific syllabus courses to specialists, and control institutional syllabus governance.
          </p>
        </div>

        <button 
          className="btn-primary"
          onClick={() => setShowAddStaffModal(true)}
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.92rem' }}
        >
          <UserPlus size={17} />
          <span>+ Appoint HOD or Faculty</span>
        </button>
      </div>

      {/* Institutional Stats Summary Strip */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1rem',
        background: '#ffffff',
        padding: '1.25rem 1.75rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Institute AICTE Code
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f2744', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            {activeUniversity?.code || "PU-SOCSE-2023"}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Dean of Academics
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--aicte-blue)', marginTop: '0.2rem' }}>
            {activeUniversity?.admin_name || "Dr. Ramesh Sharma"}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Academic Staff Onboarded
          </div>
          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#7c3aed', marginTop: '0.2rem' }}>
            {staffList.length} Faculty & HODs
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
            Curriculum Status
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669', marginTop: '0.2rem' }}>
            Active (2023–2027)
          </div>
        </div>
      </div>

      {/* Staff Roster Table */}
      <div className="pro-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-title)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={19} color="var(--aicte-blue)" />
              Academic Board of Studies & Department Faculty Roster
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Authorized academic members permitted to edit course modules and conduct review workflows.
            </p>
          </div>
          <button
            onClick={fetchStaff}
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem 0.85rem',
              fontSize: '0.8rem',
              cursor: 'pointer',
              fontWeight: 700
            }}
          >
            Refresh Roster
          </button>
        </div>

        {loadingStaff ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            Loading faculty roster...
          </div>
        ) : staffList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
            No staff records found. Click "+ Appoint HOD or Faculty" above to add educators.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-medium)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.75rem 1rem' }}>Faculty Member & Designation</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Academic Role</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Institutional Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Department</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Assigned Course(s)</th>
                </tr>
              </thead>
              <tbody>
                {staffList.map((member, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-title)' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {member.designation || "Faculty Member"}
                      </div>
                    </td>

                    <td style={{ padding: '0.9rem 1rem' }}>
                      {member.role === 'university_admin' && (
                        <span style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}>
                          🎓 Dean / Admin
                        </span>
                      )}
                      {member.role === 'hod' && (
                        <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}>
                          🏛️ HOD (Reviewer)
                        </span>
                      )}
                      {member.role === 'faculty' && (
                        <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 800 }}>
                          👨‍🏫 Course Faculty
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '0.9rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-body)' }}>
                      {member.email}
                    </td>

                    <td style={{ padding: '0.9rem 1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {member.department || "Computer Science & Engineering"}
                    </td>

                    <td style={{ padding: '0.9rem 1rem' }}>
                      {member.assigned_courses && member.assigned_courses.length > 0 ? (
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {member.assigned_courses.map((cCode, cIdx) => (
                            <span key={cIdx} style={{
                              background: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              color: 'var(--aicte-blue)',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 800,
                              fontSize: '0.75rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: 'var(--radius-sm)'
                            }}>
                              {cCode}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
                          {member.role === 'hod' ? 'All Department Courses (BOS Reviewer)' : 'General Roster'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Appoint Staff Modal */}
      {showAddStaffModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: '1.5rem'
        }} onClick={() => setShowAddStaffModal(false)}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid var(--border-medium)'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  Appoint Academic Staff
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Create an institutional login for a Head of Department or Faculty member and assign their course portfolio.
                </p>
              </div>
              <button 
                onClick={() => setShowAddStaffModal(false)}
                style={{ background: '#f1f5f9', border: 'none', borderRadius: '999px', padding: '0.45rem', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Full Name *
                  </label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Institutional Email *
                  </label>
                  <input 
                    type="email"
                    required
                    placeholder="e.g. faculty.daa@presidencyuniversity.in"
                    value={staffEmail}
                    onChange={(e) => setStaffEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Academic Role *
                  </label>
                  <select
                    value={staffRole}
                    onChange={(e) => setStaffRole(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  >
                    <option value="faculty">Faculty (Course Specialist / Syllabus Editor)</option>
                    <option value="hod">Head of Department (HOD / Reviewer)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Designation
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Associate Professor"
                    value={staffDesignation}
                    onChange={(e) => setStaffDesignation(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Department
                  </label>
                  <input 
                    type="text"
                    value={staffDept}
                    onChange={(e) => setStaffDept(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Login Password *
                  </label>
                  <input 
                    type="password"
                    required
                    value={staffPassword}
                    onChange={(e) => setStaffPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              {/* Course Allocation Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                  Assign Syllabus Course (Faculty Portfolio)
                </label>
                <select
                  value={assignedCourseCode}
                  onChange={(e) => setAssignedCourseCode(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                >
                  <option value="">-- No specific course assigned (or HOD overseer) --</option>
                  {allCourses.map((c, cIdx) => (
                    <option key={cIdx} value={c.code}>
                      [Sem {c.semester}] {c.code} - {c.title}
                    </option>
                  ))}
                </select>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  The faculty member will receive editing authority over Module 1–5 topics and AI recommendations for this course.
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '0.65rem 1.35rem', fontSize: '0.88rem' }}
                >
                  <UserPlus size={16} />
                  <span>Confirm Appointment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
