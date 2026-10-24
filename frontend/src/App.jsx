import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingHome from './components/LandingHome';
import CourseModal from './components/CourseModal';
import AicteModelView from './components/AicteModelView';
import PdfUploadStudio from './components/PdfUploadStudio';
import GapAnalysisView from './components/GapAnalysisView';
import UniversityCurriculumView from './components/UniversityCurriculumView';
import BloomAuditView from './components/BloomAuditView';
import UniversityAdminConsole from './components/UniversityAdminConsole';
import HodReviewQueue from './components/HodReviewQueue';
import FacultyCourseWorkspace from './components/FacultyCourseWorkspace';
import AuthModal from './components/AuthModal';

export default function App() {
  // Session State: User starts as Dean Dr. Ramesh Sharma by default (or loads from localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('aicte_current_user');
      return saved ? JSON.parse(saved) : {
        id: 'user-admin-01',
        name: 'Dr. Ramesh Sharma',
        email: 'dean.socse@presidencyuniversity.in',
        role: 'university_admin',
        designation: 'Dean of Academics & Administration',
        university_id: 'univ-presidency-01',
        department: 'Academic Administration',
        assigned_courses: []
      };
    } catch (e) {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState(() => {
    try {
      const saved = localStorage.getItem('aicte_current_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u.role === 'faculty') return 'my-courses';
        if (u.role === 'hod') return 'review-queue';
        if (u.role === 'university_admin') return 'admin-console';
      }
    } catch (e) {}
    return 'home';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signin');
  const [pendingReviewCount, setPendingReviewCount] = useState(0);
  
  const [aicteModel, setAicteModel] = useState(null);
  const [universityCurriculum, setUniversityCurriculum] = useState(null);
  const [activeUniversity, setActiveUniversity] = useState(null);
  const [gapData, setGapData] = useState(null);
  const [availableBatches, setAvailableBatches] = useState([]);
  const [activeBatch, setActiveBatch] = useState('2023-2027');
  
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    const role = currentUser?.role || 'guest';
    if (role === 'university_admin' && (activeTab === 'review-queue' || activeTab === 'gap-analysis')) {
      setActiveTab('admin-console');
    } else if (role === 'faculty' && ['review-queue', 'admin-console', 'upload-studio', 'gap-analysis'].includes(activeTab)) {
      setActiveTab('my-courses');
    } else if (role === 'hod' && ['admin-console', 'upload-studio', 'gap-analysis'].includes(activeTab)) {
      setActiveTab('review-queue');
    } else if (role === 'guest' && !['home', 'aicte-model', 'bloom-audit'].includes(activeTab)) {
      setActiveTab('home');
    } else if (activeTab === 'gap-analysis') {
      setActiveTab('home');
    }
  }, [currentUser]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchInitialData = async () => {
    try {
      // 1. Fetch AICTE Model
      const aicteRes = await fetch('/api/aicte/model');
      if (aicteRes.ok) {
        setAicteModel(await aicteRes.json());
      }

      // 2. Fetch Universities
      const univRes = await fetch('/api/universities');
      if (univRes.ok) {
        const universities = await univRes.json();
        if (universities.length > 0) {
          const u = universities[0];
          setActiveUniversity(u);

          if (u.batches && u.batches.length > 0) {
            setAvailableBatches(u.batches);
          }
          if (u.active_batch) {
            setActiveBatch(u.active_batch);
          }

          if (u.curriculum_id) {
            const currRes = await fetch(`/api/curriculum/${u.curriculum_id}`);
            if (currRes.ok) {
              const cData = await currRes.json();
              setUniversityCurriculum(cData);
              if (cData.batch) {
                setActiveBatch(cData.batch);
              }
              fetchPendingReviewCount(cData.id);
            }

            const gapRes = await fetch(`/api/curriculum/${u.curriculum_id}/gap-analysis`);
            if (gapRes.ok) {
              setGapData(await gapRes.json());
            }
          }
        }
      }
    } catch (err) {
      console.error("Initialization error:", err);
    }
  };

  const fetchPendingReviewCount = async (currId) => {
    if (!currId) return;
    try {
      const res = await fetch(`/api/curriculum/${currId}/review-queue`);
      if (res.ok) {
        const data = await res.json();
        const count = data.queue ? data.queue.length : (data.pending_courses ? data.pending_courses.length : (data.count || 0));
        setPendingReviewCount(count);
      }
    } catch (e) {
      console.error("Error fetching review count:", e);
    }
  };

  const handleLoginSuccess = (user, university) => {
    setCurrentUser(user);
    if (university) {
      setActiveUniversity(university);
    }
    localStorage.setItem('aicte_current_user', JSON.stringify(user));
    showToast(`Signed in as ${user.name} (${user.designation || user.role}).`);
    
    // Role-tailored landing tab
    if (user.role === 'hod') {
      setActiveTab('review-queue');
    } else if (user.role === 'faculty') {
      setActiveTab('my-courses');
    } else if (user.role === 'university_admin') {
      setActiveTab('admin-console');
    } else {
      setActiveTab('home');
    }
    
    if (universityCurriculum?.id) {
      fetchPendingReviewCount(universityCurriculum.id);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aicte_current_user');
    setActiveTab('home');
    showToast("Signed out. You are now browsing in Public/Guest mode.");
  };

  const handleSwitchPersona = async (email) => {
    if (email === 'guest') {
      handleLogout();
      return;
    }
    const passwords = {
      'dean.socse@presidencyuniversity.in': 'admin123',
      'hod.cse@presidencyuniversity.in': 'hod123',
      'faculty.daa@presidencyuniversity.in': 'faculty123',
      'faculty.ds@presidencyuniversity.in': 'faculty123'
    };
    const pwd = passwords[email] || 'faculty123';
    await handleQuickDemoLogin(email, pwd);
  };

  const handleQuickDemoLogin = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        handleLoginSuccess(data.user, data.university);
      } else {
        showToast(data.detail || "Authentication failed.");
      }
    } catch (e) {
      console.error(e);
      showToast("Error authenticating.");
    }
  };

  const handleOpenAuth = (mode = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleSwitchBatch = async (batchName) => {
    if (!activeUniversity) return;
    try {
      const res = await fetch(`/api/universities/${activeUniversity.id}/set-active-batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ batch: batchName })
      });
      if (res.ok) {
        const data = await res.json();
        setActiveBatch(batchName);
        setUniversityCurriculum(data.curriculum);
        setActiveUniversity(prev => ({
          ...prev,
          active_batch: batchName,
          curriculum_id: data.curriculum_id
        }));

        const gapRes = await fetch(`/api/curriculum/${data.curriculum_id}/gap-analysis`);
        if (gapRes.ok) {
          setGapData(await gapRes.json());
        }
        fetchPendingReviewCount(data.curriculum_id);
        showToast(`Switched active view to Batch ${batchName} Scheme!`);
      }
    } catch (e) {
      console.error("Batch switch error:", e);
      showToast("Error switching batch.");
    }
  };

  const handleInheritModel = async () => {
    if (!aicteModel) return;
    const cloned = JSON.parse(JSON.stringify(aicteModel));
    cloned.id = `univ-inherited-${Date.now()}`;
    cloned.title = `${activeUniversity?.name || "Institute"} B.Tech CSE (AICTE Inherited Scheme)`;
    cloned.university_id = activeUniversity?.id;
    cloned.university_name = activeUniversity?.name;
    cloned.is_aicte_model = false;
    cloned.batch = activeBatch || "2023-2027";

    setUniversityCurriculum(cloned);
    setActiveTab('university-curriculum');
    showToast("Official AICTE Model Curriculum successfully cloned to Institute repository!");

    try {
      await fetch('/api/curriculum/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cloned)
      });
      const gapRes = await fetch(`/api/curriculum/${cloned.id}/gap-analysis`);
      if (gapRes.ok) {
        setGapData(await gapRes.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCurriculumExtracted = (extractedCurriculum, extractedGap, updatedBatches) => {
    setUniversityCurriculum(extractedCurriculum);
    setGapData(extractedGap);
    if (extractedCurriculum?.batch) {
      setActiveBatch(extractedCurriculum.batch);
    }
    if (updatedBatches && updatedBatches.length > 0) {
      setAvailableBatches(updatedBatches);
    } else if (activeUniversity?.id) {
      fetch(`/api/universities/${activeUniversity.id}/batches`)
        .then(r => r.json())
        .then(b => {
          if (Array.isArray(b)) setAvailableBatches(b);
          else if (b && Array.isArray(b.batches)) setAvailableBatches(b.batches);
        })
        .catch(() => {});
    }
    showToast(`Batch ${extractedCurriculum?.batch || ''} Curriculum successfully added to University batches!`);
    setActiveTab('university-curriculum');
    if (extractedCurriculum?.id) {
      fetchPendingReviewCount(extractedCurriculum.id);
    }
  };

  const handleSaveCurriculum = async (curr) => {
    try {
      const res = await fetch('/api/curriculum/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(curr)
      });

      if (res.ok) {
        const data = await res.json();
        showToast("Curriculum successfully saved and published to University profile!");
        setUniversityCurriculum(curr);
        if (curr.batch) {
          setActiveBatch(curr.batch);
        }
        if (data.batches && data.batches.length > 0) {
          setAvailableBatches(data.batches);
        }
        setActiveTab('university-curriculum');
        if (curr.id) fetchPendingReviewCount(curr.id);
      }
    } catch (e) {
      console.error(e);
      showToast("Error saving curriculum.");
    }
  };

  const handleCourseUpdated = (updatedCourse) => {
    // Update local state and current selected course
    setSelectedCourse(updatedCourse);
    if (universityCurriculum) {
      const updatedCurriculum = { ...universityCurriculum };
      if (updatedCurriculum.semesters) {
        updatedCurriculum.semesters.forEach(s => {
          if (s.courses) {
            s.courses = s.courses.map(c => c.code === updatedCourse.code ? updatedCourse : c);
          }
        });
      }
      setUniversityCurriculum(updatedCurriculum);
      fetchPendingReviewCount(updatedCurriculum.id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          background: '#0f2744',
          color: '#ffffff',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.35rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.25)',
          fontSize: '0.88rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navbar with User Profile, Role Badge & Tab Navigation */}
      <Navbar 
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onSwitchPersona={handleSwitchPersona}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        universityInfo={activeUniversity}
        pendingReviewCount={pendingReviewCount}
      />

      {/* Main Content Area */}
      <main className="page-container" style={{ flex: 1, width: '100%' }}>
        {activeTab === 'home' && (
          <LandingHome 
            setActiveTab={setActiveTab}
            aicteModel={aicteModel}
            universityCurriculum={universityCurriculum}
            activeUniversity={activeUniversity}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onQuickDemoLogin={handleQuickDemoLogin}
          />
        )}

        {activeTab === 'my-courses' && (
          <FacultyCourseWorkspace 
            curriculum={universityCurriculum}
            currentUser={currentUser}
            onSelectCourse={(course, isEditing = false) => {
              setSelectedCourse({ ...course, initialEditing: isEditing });
            }}
            showToast={showToast}
            onUpdateCurrentUser={(updatedUser) => {
              setCurrentUser(updatedUser);
              localStorage.setItem('aicte_current_user', JSON.stringify(updatedUser));
            }}
            onRefreshCurriculum={fetchInitialData}
            activeUniversity={activeUniversity}
          />
        )}

        {activeTab === 'university-curriculum' && (
          <UniversityCurriculumView 
            curriculum={universityCurriculum}
            onSelectCourse={setSelectedCourse}
            activeUniversity={activeUniversity}
            availableBatches={availableBatches}
            activeBatch={activeBatch}
            onSwitchBatch={handleSwitchBatch}
            onNavigateToUpload={() => setActiveTab('upload-studio')}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'upload-studio' && (
          <PdfUploadStudio 
            currentRole={currentUser?.role || 'student'}
            setCurrentRole={() => {}}
            activeUniversity={activeUniversity}
            availableBatches={availableBatches}
            activeBatch={activeBatch}
            onCurriculumExtracted={handleCurriculumExtracted}
            onSaveCurriculum={handleSaveCurriculum}
            onSwitchPersona={handleSwitchPersona}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {activeTab === 'gap-analysis' && (
          <GapAnalysisView 
            curriculum={universityCurriculum}
            aicteModel={aicteModel}
            gapData={gapData}
            onRefresh={fetchInitialData}
          />
        )}

        {activeTab === 'aicte-model' && (
          <AicteModelView 
            aicteModel={aicteModel}
            onSelectCourse={setSelectedCourse}
            onInheritModel={handleInheritModel}
            currentRole={currentUser?.role || 'student'}
          />
        )}

        {activeTab === 'bloom-audit' && (
          <BloomAuditView 
            curriculum={universityCurriculum || aicteModel}
            onSelectCourse={setSelectedCourse}
          />
        )}

        {activeTab === 'review-queue' && (
          <HodReviewQueue 
            curriculum={universityCurriculum}
            activeUniversity={activeUniversity}
            currentUser={currentUser}
            onRefreshCurriculum={fetchInitialData}
            showToast={showToast}
          />
        )}

        {activeTab === 'admin-console' && (
          <UniversityAdminConsole 
            activeUniversity={activeUniversity}
            universityCurriculum={universityCurriculum}
            onRegisterUniversity={handleOpenAuth}
            currentRole={currentUser?.role || 'student'}
            showToast={showToast}
          />
        )}
      </main>

      {/* Official Government Footer */}
      <footer style={{
        marginTop: '3.5rem',
        borderTop: '1px solid var(--border-subtle)',
        background: '#ffffff',
        padding: '2rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '0.65rem', flexWrap: 'wrap', fontWeight: 600 }}>
          <span>CourseFlow Model Curriculum Standards</span>
          <span>•</span>
          <span>National Education Policy (NEP 2020)</span>
          <span>•</span>
          <span>Outcome-Based Education (OBE / Bloom's Taxonomy)</span>
          <span>•</span>
          <span>National Credit Framework (NCrF)</span>
        </div>
        <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
          CourseFlow Curriculum Ingestion & Regulation Framework for Technical Universities, Higher Education Institutes, and Autonomous Engineering Colleges.
        </div>
      </footer>

      {/* Course Detail & Faculty Module Editor Modal */}
      {selectedCourse && (
        <CourseModal 
          course={selectedCourse}
          initialEditing={selectedCourse?.initialEditing || false}
          onClose={() => setSelectedCourse(null)}
          curriculumId={universityCurriculum?.id || activeUniversity?.curriculum_id}
          currentUser={currentUser}
          onCourseUpdated={handleCourseUpdated}
          showToast={showToast}
        />
      )}

      {/* Authentication & University Onboarding Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
