import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  RotateCcw, 
  Layers, 
  UserCheck, 
  Clock, 
  FileText, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  BookOpen,
  GitBranch,
  History,
  ShieldCheck,
  ArrowRight,
  Eye,
  Check
} from 'lucide-react';

export default function HodReviewQueue({ curriculum, activeUniversity, currentUser, onRefreshCurriculum, showToast }) {
  const [queue, setQueue] = useState([]);
  const [recentlyApproved, setRecentlyApproved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedCourses, setExpandedCourses] = useState({});
  const [cardViewModes, setCardViewModes] = useState({}); // 'diff' | 'full' | 'history'
  const [hodComments, setHodComments] = useState({});
  const [actionInProgress, setActionInProgress] = useState(null);
  const [activeQueueTab, setActiveQueueTab] = useState('pending'); // 'pending' | 'approved'

  useEffect(() => {
    fetchQueue();
  }, [curriculum, activeUniversity]);

  const fetchQueue = async () => {
    const effectiveId = curriculum?.id || activeUniversity?.curriculum_id;
    if (!effectiveId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/curriculum/${effectiveId}/review-queue`);
      if (res.ok) {
        const data = await res.json();
        const list = data.queue || data.pending_courses || [];
        setQueue(list);
        setRecentlyApproved(data.recently_approved || []);

        // Expand first course by default if any
        if (list.length > 0) {
          setExpandedCourses(prev => ({
            ...prev,
            [list[0].code]: true
          }));
          setCardViewModes(prev => ({
            ...prev,
            [list[0].code]: prev[list[0].code] || 'diff'
          }));
        }
      }
    } catch (e) {
      console.error("Error fetching review queue:", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (courseCode) => {
    setExpandedCourses(prev => ({
      ...prev,
      [courseCode]: !prev[courseCode]
    }));
    if (!cardViewModes[courseCode]) {
      setCardViewModes(prev => ({ ...prev, [courseCode]: 'diff' }));
    }
  };

  const setViewMode = (courseCode, mode) => {
    setCardViewModes(prev => ({ ...prev, [courseCode]: mode }));
    setExpandedCourses(prev => ({ ...prev, [courseCode]: true }));
  };

  const handleReviewAction = async (courseCode, action) => {
    const effectiveId = curriculum?.id || activeUniversity?.curriculum_id;
    if (!effectiveId) return;
    setActionInProgress(courseCode);
    const comment = hodComments[courseCode] || (action === 'approve' ? 'Approved by HOD. Ready for academic scheme rollout.' : 'Please revise based on departmental guidelines.');

    try {
      const res = await fetch('/api/courses/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculum_id: effectiveId,
          course_code: courseCode,
          action: action,
          comments: comment,
          user_name: currentUser?.name || 'HOD Dr. Suresh Babu'
        })
      });

      const data = await res.json();
      if (res.ok) {
        const nextVer = data.course?.version || 'v2.0';
        showToast(
          action === 'approve' 
            ? `Course ${courseCode} successfully ratified to Version ${nextVer} & committed to official scheme!` 
            : `Revision requested for ${courseCode}. Returned to faculty workspace.`
        );
        if (onRefreshCurriculum) onRefreshCurriculum();
        fetchQueue();
      } else {
        showToast(data.detail || "Error performing review action.");
      }
    } catch (err) {
      console.error(err);
      showToast("Network error while reviewing course.");
    } finally {
      setActionInProgress(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="pro-card" style={{
        padding: '2.25rem',
        background: '#ffffff',
        borderLeft: '5px solid #d97706',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span className="brand-pill" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a' }}>
              Academic Board of Studies (BOS)
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Curriculum Quality Assurance & Version Control Center
            </span>
            <span style={{
              background: '#eff6ff',
              color: '#1e40af',
              border: '1px solid #bfdbfe',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.15rem 0.55rem',
              borderRadius: 'var(--radius-sm)'
            }}>
              160.0 Credits Standard
            </span>
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
            HOD Syllabus Review & Version Diff Portal
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.6' }}>
            Department Heads (HOD) inspect proposed syllabus revisions, verify AICTE compliance with instant visual diffs (highlighting newly introduced and pruned topics), and ratify changes into official versioned releases (v1.0 → v2.0).
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'center' }}>
          <div style={{
            background: queue.length > 0 ? '#fffbeb' : '#f0fdf4',
            border: `1px solid ${queue.length > 0 ? '#fde68a' : '#bbf7d0'}`,
            borderRadius: 'var(--radius-lg)',
            padding: '1rem 1.5rem',
            textAlign: 'center',
            minWidth: '180px'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: queue.length > 0 ? '#d97706' : '#15803d' }}>
              {queue.length}
            </div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              {queue.length === 1 ? 'Pending BOS Review' : 'Pending BOS Reviews'}
            </div>
          </div>

          <button
            onClick={fetchQueue}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#ffffff',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.35rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <RotateCcw size={13} className={loading ? 'spin' : ''} />
            <span>{loading ? 'Refreshing...' : 'Sync Review Queue'}</span>
          </button>
        </div>
      </div>

      {/* Queue View Switcher Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        borderBottom: '2px solid var(--border-subtle)',
        paddingBottom: '0.5rem'
      }}>
        <button
          onClick={() => setActiveQueueTab('pending')}
          style={{
            background: activeQueueTab === 'pending' ? 'var(--aicte-blue)' : 'transparent',
            color: activeQueueTab === 'pending' ? '#ffffff' : 'var(--text-body)',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <Clock size={16} />
          <span>Pending BOS Approval</span>
          <span style={{
            background: activeQueueTab === 'pending' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
            color: activeQueueTab === 'pending' ? '#ffffff' : 'var(--text-title)',
            padding: '0.1rem 0.5rem',
            borderRadius: '999px',
            fontSize: '0.75rem'
          }}>
            {queue.length}
          </span>
        </button>

        <button
          onClick={() => setActiveQueueTab('approved')}
          style={{
            background: activeQueueTab === 'approved' ? 'var(--aicte-blue)' : 'transparent',
            color: activeQueueTab === 'approved' ? '#ffffff' : 'var(--text-body)',
            border: 'none',
            padding: '0.6rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontWeight: 800,
            fontSize: '0.88rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.15s ease'
          }}
        >
          <ShieldCheck size={16} />
          <span>Approved Scheme Versions & Audit Log</span>
          <span style={{
            background: activeQueueTab === 'approved' ? 'rgba(255,255,255,0.25)' : '#e2e8f0',
            color: activeQueueTab === 'approved' ? '#ffffff' : 'var(--text-title)',
            padding: '0.1rem 0.5rem',
            borderRadius: '999px',
            fontSize: '0.75rem'
          }}>
            {recentlyApproved.length}
          </span>
        </button>
      </div>

      {/* PENDING QUEUE TAB */}
      {activeQueueTab === 'pending' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3.5rem', color: 'var(--text-muted)' }}>
              Loading BOS review queue submissions...
            </div>
          ) : queue.length === 0 ? (
            <div className="pro-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#f0fdf4', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <CheckCircle2 size={30} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.5rem' }}>
                All Syllabi Reviewed & In Sync!
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                There are currently no course modules pending approval from faculty members. When faculty updates a syllabus and submits it, it will appear here for your instant visual diff inspection.
              </p>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Active Regulation: <b>{curriculum?.title || "B.Tech CSE"}</b> ({curriculum?.batch || "2023-2027"}) • <b>160.0 Credits</b>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {queue.map((course) => {
                const isExpanded = expandedCourses[course.code];
                const viewMode = cardViewModes[course.code] || 'diff';
                const isBusy = actionInProgress === course.code;

                const currVer = course.version || 'v1.0';
                const verNum = parseInt(currVer.replace('v', '')) || 1;
                const nextVer = `v${verNum + 1}.0`;

                const addedCount = course.proposed_diff?.added_topics?.length || 0;
                const prunedCount = course.proposed_diff?.pruned_topics?.length || 0;

                return (
                  <div 
                    key={course.code}
                    className="pro-card"
                    style={{
                      padding: '2rem',
                      borderLeft: '5px solid #d97706',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}
                  >
                    {/* Course Header in Queue */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: 1, minWidth: '280px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                          <span className={`badge-category cat-${course.category?.toLowerCase() || 'pcc'}`}>
                            {course.category}
                          </span>
                          <span style={{ fontSize: '0.92rem', color: 'var(--aicte-blue)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                            {course.code}
                          </span>
                          
                          {/* Version Badge */}
                          <span style={{
                            background: '#e0e7ff',
                            color: '#3730a3',
                            border: '1px solid #c7d2fe',
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            padding: '0.15rem 0.55rem',
                            borderRadius: 'var(--radius-sm)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}>
                            <GitBranch size={12} />
                            <span>Current: {currVer} → Target: {nextVer}</span>
                          </span>

                          <span style={{ fontSize: '0.78rem', color: '#d97706', background: '#fffbeb', border: '1px solid #fde68a', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontWeight: 700 }}>
                            Semester {course.semester} • Pending BOS Ratification
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.35rem' }}>
                          {course.title}
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                          <span><b>Submitted by:</b> {course.last_edited_by || course.assigned_faculty_name || "Faculty Specialist"}</span>
                          <span><b>Timestamp:</b> {course.last_edited_at || "Recent Session"}</span>
                          <span><b>Credits:</b> {course.credits} ({course.lecture_hours || 3}L-{course.tutorial_hours || 0}T-{course.practical_hours || 0}P)</span>
                        </div>
                      </div>

                      {/* Right Action / Expand Button */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <button
                          onClick={() => toggleExpand(course.code)}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid var(--border-medium)',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.55rem 0.95rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            color: 'var(--text-title)',
                            cursor: 'pointer'
                          }}
                        >
                          <Eye size={15} color="var(--aicte-blue)" />
                          <span>{isExpanded ? 'Hide Details' : 'Inspect Syllabus Diff'}</span>
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Quick Diff Pill Banner */}
                    <div style={{
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '0.75rem',
                      background: '#f8fafc',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem 1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-title)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          Revision Summary:
                        </span>
                        <span style={{
                          background: addedCount > 0 ? '#dcfce7' : '#f1f5f9',
                          border: `1px solid ${addedCount > 0 ? '#86efac' : '#cbd5e1'}`,
                          color: addedCount > 0 ? '#15803d' : 'var(--text-muted)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 800
                        }}>
                          +{addedCount} New Topics Added
                        </span>
                        <span style={{
                          background: prunedCount > 0 ? '#fee2e2' : '#f1f5f9',
                          border: `1px solid ${prunedCount > 0 ? '#fca5a5' : '#cbd5e1'}`,
                          color: prunedCount > 0 ? '#dc2626' : 'var(--text-muted)',
                          padding: '0.2rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.78rem',
                          fontWeight: 800
                        }}>
                          -{prunedCount} Obsolete Topics Pruned
                        </span>
                      </div>

                      {/* View Mode Switcher */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#e2e8f0', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
                        <button
                          onClick={() => setViewMode(course.code, 'diff')}
                          style={{
                            background: viewMode === 'diff' ? '#ffffff' : 'transparent',
                            color: viewMode === 'diff' ? 'var(--aicte-blue)' : 'var(--text-muted)',
                            border: 'none',
                            padding: '0.3rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Sparkles size={13} />
                          <span>Delta Diff (Fast)</span>
                        </button>
                        <button
                          onClick={() => setViewMode(course.code, 'full')}
                          style={{
                            background: viewMode === 'full' ? '#ffffff' : 'transparent',
                            color: viewMode === 'full' ? 'var(--aicte-blue)' : 'var(--text-muted)',
                            border: 'none',
                            padding: '0.3rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <Layers size={13} />
                          <span>Full Modules (5)</span>
                        </button>
                        <button
                          onClick={() => setViewMode(course.code, 'history')}
                          style={{
                            background: viewMode === 'history' ? '#ffffff' : 'transparent',
                            color: viewMode === 'history' ? 'var(--aicte-blue)' : 'var(--text-muted)',
                            border: 'none',
                            padding: '0.3rem 0.65rem',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          <History size={13} />
                          <span>Version Audit Log</span>
                        </button>
                      </div>
                    </div>

                    {/* Faculty Justification Note */}
                    {course.faculty_revision_notes && (
                      <div style={{
                        marginTop: '1rem',
                        background: '#f8fafc',
                        border: '1px solid var(--border-medium)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.9rem 1.15rem',
                        borderLeft: '4px solid var(--aicte-blue)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontSize: '0.76rem', fontWeight: 800, color: 'var(--aicte-blue)', textTransform: 'uppercase' }}>
                          <FileText size={14} />
                          <span>Faculty Revision Note & BoS Justification</span>
                        </div>
                        <p style={{ color: 'var(--text-title)', fontSize: '0.88rem', lineHeight: '1.55', margin: 0 }}>
                          "{course.faculty_revision_notes}"
                        </p>
                      </div>
                    )}

                    {/* EXPANDED INSPECTION BODY */}
                    {isExpanded && (
                      <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>

                        {/* MODE 1: DELTA DIFF (FAST VIEW FOR HOD) */}
                        {viewMode === 'diff' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-title)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                📋 Visual Diff: Modifications Proposed for {nextVer}
                              </span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Allows HOD to verify changes in seconds without reading entire syllabus
                              </span>
                            </div>

                            {/* Added Topics Box */}
                            <div style={{
                              background: '#f0fdf4',
                              border: '1.5px solid #86efac',
                              borderRadius: 'var(--radius-md)',
                              padding: '1.1rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                                <span style={{
                                  background: '#15803d',
                                  color: '#ffffff',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.7rem',
                                  fontWeight: 800
                                }}>
                                  + NEW ADDITIONS
                                </span>
                                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#166534' }}>
                                  Newly Introduced Topics ({addedCount})
                                </span>
                              </div>

                              {addedCount > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                  {course.proposed_diff.added_topics.map((item, aIdx) => (
                                    <div key={aIdx} style={{
                                      background: '#ffffff',
                                      border: '1.5px solid #22c55e',
                                      color: '#15803d',
                                      padding: '0.35rem 0.75rem',
                                      borderRadius: 'var(--radius-sm)',
                                      fontWeight: 700,
                                      fontSize: '0.82rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.45rem',
                                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                                    }}>
                                      <span style={{ background: '#dcfce7', color: '#166534', padding: '0.1rem 0.35rem', borderRadius: '3px', fontSize: '0.72rem' }}>
                                        Mod {item.module}
                                      </span>
                                      <span>{item.topic}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.82rem', color: '#166534', fontStyle: 'italic' }}>
                                  No new topics were added in this revision.
                                </div>
                              )}
                            </div>

                            {/* Pruned Topics Box */}
                            <div style={{
                              background: '#fef2f2',
                              border: '1.5px solid #fca5a5',
                              borderRadius: 'var(--radius-md)',
                              padding: '1.1rem'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
                                <span style={{
                                  background: '#dc2626',
                                  color: '#ffffff',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.7rem',
                                  fontWeight: 800
                                }}>
                                  - REMOVED
                                </span>
                                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#991b1b' }}>
                                  Pruned Obsolete Topics ({prunedCount})
                                </span>
                              </div>

                              {prunedCount > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                                  {course.proposed_diff.pruned_topics.map((item, pIdx) => (
                                    <div key={pIdx} style={{
                                      background: '#ffffff',
                                      border: '1.5px solid #f87171',
                                      color: '#991b1b',
                                      padding: '0.35rem 0.75rem',
                                      borderRadius: 'var(--radius-sm)',
                                      fontWeight: 600,
                                      fontSize: '0.82rem',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.45rem',
                                      textDecoration: 'line-through'
                                    }}>
                                      <span style={{ background: '#fee2e2', color: '#991b1b', padding: '0.1rem 0.35rem', borderRadius: '3px', fontSize: '0.72rem', textDecoration: 'none' }}>
                                        Mod {item.module}
                                      </span>
                                      <span>{item.topic}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div style={{ fontSize: '0.82rem', color: '#991b1b', fontStyle: 'italic' }}>
                                  No topics were pruned in this revision.
                                </div>
                              )}
                            </div>

                          </div>
                        )}

                        {/* MODE 2: FULL MODULES VIEW */}
                        {viewMode === 'full' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                              Proposed Module Scheme (Module 1 to {course.units?.length || 5}):
                            </div>

                            {course.units?.map((unit, idx) => {
                              const addedList = course.proposed_diff?.added_topics?.filter(a => a.module === (unit.unit_number || idx + 1)) || [];
                              const addedSet = new Set(addedList.map(a => a.topic.trim().toLowerCase()));

                              return (
                                <div key={idx} style={{
                                  background: '#ffffff',
                                  border: '1px solid var(--border-medium)',
                                  borderRadius: 'var(--radius-md)',
                                  padding: '1rem',
                                  borderLeft: '3px solid var(--aicte-blue)'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                    <span style={{ fontWeight: 800, color: 'var(--text-title)', fontSize: '0.92rem' }}>
                                      Module {unit.unit_number || idx + 1}: {unit.title}
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f1f5f9', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                                      {unit.hours || 8} Contact Hours
                                    </span>
                                  </div>
                                  {unit.topics && unit.topics.length > 0 && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.4rem' }}>
                                      {unit.topics.map((t, tIdx) => {
                                        const isNew = addedSet.has(t.trim().toLowerCase());
                                        return (
                                          <span key={tIdx} style={{
                                            background: isNew ? '#ecfdf5' : '#f8fafc',
                                            border: isNew ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                                            color: isNew ? '#065f46' : 'var(--text-body)',
                                            fontWeight: isNew ? 700 : 500,
                                            padding: '0.2rem 0.6rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.76rem',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.3rem'
                                          }}>
                                            {isNew && (
                                              <span style={{
                                                background: '#10b981',
                                                color: '#ffffff',
                                                fontSize: '0.6rem',
                                                fontWeight: 800,
                                                padding: '0.05rem 0.3rem',
                                                borderRadius: '3px'
                                              }}>
                                                NEW
                                              </span>
                                            )}
                                            <span>{t}</span>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* MODE 3: VERSION HISTORY & AUDIT LOG */}
                        {viewMode === 'history' && (
                          <div style={{
                            background: '#f8fafc',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1.25rem'
                          }}>
                            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <History size={16} color="var(--aicte-blue)" />
                              <span>Course Version History & Board of Studies Audit Trail</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                              {/* Current working proposal entry */}
                              <div style={{
                                background: '#ffffff',
                                border: '1.5px dashed #d97706',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.9rem',
                                borderLeft: '4px solid #d97706'
                              }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                  <span style={{ fontWeight: 800, color: '#d97706', fontSize: '0.88rem' }}>
                                    {nextVer} (Working Proposal - Awaiting Ratification)
                                  </span>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {course.last_edited_at || "Now"}
                                  </span>
                                </div>
                                <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                                  <b>Author:</b> {course.last_edited_by || course.assigned_faculty_name || "Faculty Specialist"}<br />
                                  <b>Revision Notes:</b> {course.faculty_revision_notes || "Curriculum modernization and topic alignment"}<br />
                                  <b>Scope:</b> +{addedCount} topics added, -{prunedCount} topics pruned
                                </div>
                              </div>

                              {/* Prior Approved Versions */}
                              {course.version_history && course.version_history.length > 0 ? (
                                course.version_history.slice().reverse().map((vh, vIdx) => (
                                  <div key={vIdx} style={{
                                    background: '#ffffff',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: 'var(--radius-sm)',
                                    padding: '0.9rem',
                                    borderLeft: '4px solid #15803d'
                                  }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                      <span style={{ fontWeight: 800, color: '#15803d', fontSize: '0.88rem' }}>
                                        {vh.version} (Ratified & Committed)
                                      </span>
                                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {vh.timestamp}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                                      <b>Approved By:</b> {vh.approved_by || "BoS Academic Council"}<br />
                                      <b>Faculty Contributor:</b> {vh.faculty_author || "Curriculum Drafting Committee"}<br />
                                      {vh.revision_notes && (
                                        <span><b>Notes:</b> {vh.revision_notes}<br /></span>
                                      )}
                                      {vh.hod_comments && (
                                        <span><b>HOD Remarks:</b> {vh.hod_comments}</span>
                                      )}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div style={{
                                  background: '#ffffff',
                                  border: '1px solid var(--border-subtle)',
                                  borderRadius: 'var(--radius-sm)',
                                  padding: '0.9rem',
                                  borderLeft: '4px solid #15803d'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                    <span style={{ fontWeight: 800, color: '#15803d', fontSize: '0.88rem' }}>
                                      v1.0 (Baseline Autonomous Scheme)
                                    </span>
                                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                      2023-08-10 10:00
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                                    <b>Ratified by:</b> Academic Council & Board of Studies (BoS)<br />
                                    <b>Status:</b> Baseline Scheme for Batch 2023–2027 (160.0 Credits)
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* HOD Review Decision Controls */}
                        <div style={{
                          marginTop: '1.5rem',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '1.25rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.85rem'
                        }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.35rem' }}>
                              HOD / Academic Council Review Comments
                            </label>
                            <input 
                              type="text"
                              placeholder={`Add formal approval remarks or specific instructions for revision for ${course.code}...`}
                              value={hodComments[course.code] || ''}
                              onChange={(e) => setHodComments({ ...hodComments, [course.code]: e.target.value })}
                              style={{
                                width: '100%',
                                padding: '0.65rem 0.85rem',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-medium)',
                                fontSize: '0.88rem'
                              }}
                            />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleReviewAction(course.code, 'request_revision')}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #fca5a5',
                                color: '#dc2626',
                                padding: '0.65rem 1.25rem',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: 700,
                                fontSize: '0.88rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                cursor: 'pointer'
                              }}
                            >
                              <RotateCcw size={16} />
                              <span>Request Revision</span>
                            </button>

                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => handleReviewAction(course.code, 'approve')}
                              className="btn-accent"
                              style={{
                                padding: '0.65rem 1.6rem',
                                fontSize: '0.88rem',
                                background: '#16a34a',
                                borderColor: '#15803d'
                              }}
                            >
                              <CheckCircle2 size={16} />
                              <span>{isBusy ? 'Ratifying...' : `Approve & Commit Revision (${nextVer})`}</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* APPROVED SCHEMES & VERSION AUDIT LOG TAB */}
      {activeQueueTab === 'approved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {recentlyApproved.length === 0 ? (
            <div className="pro-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#eff6ff', color: 'var(--aicte-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem' }}>
                <History size={30} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.5rem' }}>
                Baseline Version v1.0 Active Across All Courses
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
                All course syllabi are currently operating under the baseline approved regulation (v1.0). When you approve revisions from the review queue, their version history and audit log will appear here.
              </p>
            </div>
          ) : (
            recentlyApproved.map((course) => {
              const hist = course.version_history || [];
              const latestVer = course.version || 'v1.0';

              return (
                <div 
                  key={course.code}
                  className="pro-card"
                  style={{
                    padding: '2rem',
                    borderLeft: '5px solid #16a34a'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <span className={`badge-category cat-${course.category?.toLowerCase() || 'pcc'}`}>
                          {course.category}
                        </span>
                        <span style={{ fontSize: '0.92rem', color: 'var(--aicte-blue)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                          {course.code}
                        </span>
                        <span style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          border: '1px solid #86efac',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.55rem',
                          borderRadius: 'var(--radius-sm)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <Check size={12} />
                          <span>Active Scheme: {latestVer}</span>
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Semester {course.semester}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-title)' }}>
                        {course.title}
                      </h3>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        Total Credits: <b>{course.credits}</b> • Faculty In-Charge: <b>{course.assigned_faculty_name || "Specialist"}</b>
                      </div>
                    </div>
                  </div>

                  {/* Audit Trail Timeline */}
                  <div style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem'
                  }}>
                    <h5 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-title)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <History size={15} color="var(--aicte-blue)" />
                      <span>Ratification Audit Trail (What changed over the years):</span>
                    </h5>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {hist.slice().reverse().map((entry, eIdx) => (
                        <div key={eIdx} style={{
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: 'var(--radius-sm)',
                          padding: '0.85rem',
                          borderLeft: eIdx === 0 ? '4px solid #16a34a' : '4px solid var(--border-medium)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                            <span style={{ fontWeight: 800, color: eIdx === 0 ? '#15803d' : 'var(--text-title)', fontSize: '0.85rem' }}>
                              {entry.version} • {entry.action === 'approved' ? 'Ratified Revision' : 'Baseline Scheme'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {entry.timestamp}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                            <b>Approved by:</b> {entry.approved_by}<br />
                            <b>Faculty Author:</b> {entry.faculty_author}<br />
                            {entry.revision_notes && <span><b>Faculty Notes:</b> {entry.revision_notes}<br /></span>}
                            {entry.hod_comments && <span><b>HOD Remarks:</b> {entry.hod_comments}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
