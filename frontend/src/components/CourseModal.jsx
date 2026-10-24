import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Award, 
  Layers, 
  BookmarkCheck, 
  Edit3, 
  CheckCircle2, 
  Sparkles, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Send, 
  FileText, 
  Clock,
  ArrowRight,
  HelpCircle,
  RotateCcw,
  GitBranch,
  History
} from 'lucide-react';

export default function CourseModal({ 
  course, 
  onClose, 
  curriculumId, 
  currentUser, 
  onCourseUpdated, 
  showToast,
  initialEditing = false
}) {
  if (!course) return null;

  // Determine if editing is allowed
  const isAssignedFaculty = currentUser?.assigned_courses?.includes(course.code) || 
    currentUser?.role === 'university_admin' || 
    currentUser?.role === 'hod' ||
    (currentUser?.role === 'faculty' && ['CSE2007', 'CSE2001'].includes(course.code));

  const [isEditing, setIsEditing] = useState(Boolean(initialEditing || course?.initialEditing));
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [units, setUnits] = useState(course.units || []);
  const [activeUnitIdx, setActiveUnitIdx] = useState(0);
  const [newTopicText, setNewTopicText] = useState('');
  const [revisionNotes, setRevisionNotes] = useState(course.faculty_revision_notes || '');
  
  // Track original topics for visual diffing
  const originalTopicsMap = useMemo(() => {
    const map = {};
    (course.units || []).forEach((u, uIdx) => {
      map[uIdx] = new Set((u.topics || []).map(t => t.trim().toLowerCase()));
    });
    return map;
  }, [course]);

  // AI Suggestions State
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course.units) {
      setUnits(JSON.parse(JSON.stringify(course.units)));
    }
    if (initialEditing) {
      setIsEditing(true);
    }
  }, [course, initialEditing]);

  // Fetch AI suggestions when opening edit mode
  useEffect(() => {
    const effectiveCurriculumId = curriculumId || course?.curriculum_id;
    if (effectiveCurriculumId && !aiSuggestions) {
      fetchAiSuggestions(effectiveCurriculumId);
    }
  }, [curriculumId, course.code, course.curriculum_id]);

  const fetchAiSuggestions = async (currId) => {
    const effectiveCurriculumId = currId || curriculumId || course?.curriculum_id;
    if (!effectiveCurriculumId) return;
    setLoadingAi(true);
    try {
      const res = await fetch(`/api/courses/${effectiveCurriculumId}/${course.code}/ai-suggestions`);
      if (res.ok) {
        const data = await res.json();
        setAiSuggestions(data);
      }
    } catch (e) {
      console.error("Error fetching AI suggestions:", e);
    } finally {
      setLoadingAi(false);
    }
  };

  // Compute live diff of added and pruned topics
  const { addedTopics, prunedTopics } = useMemo(() => {
    const added = [];
    const pruned = [];

    units.forEach((u, uIdx) => {
      const origSet = originalTopicsMap[uIdx] || new Set();
      (u.topics || []).forEach(t => {
        if (!origSet.has(t.trim().toLowerCase())) {
          added.push({ module: u.unit_number || uIdx + 1, topic: t });
        }
      });
    });

    (course.units || []).forEach((u, uIdx) => {
      const currentSet = new Set((units[uIdx]?.topics || []).map(t => t.trim().toLowerCase()));
      (u.topics || []).forEach(t => {
        if (!currentSet.has(t.trim().toLowerCase())) {
          pruned.push({ module: u.unit_number || uIdx + 1, topic: t });
        }
      });
    });

    return { addedTopics: added, prunedTopics: pruned };
  }, [units, course, originalTopicsMap]);

  const handleUnitTitleChange = (idx, newTitle) => {
    setUnits(prev => {
      const updated = [...prev];
      updated[idx].title = newTitle;
      return updated;
    });
  };

  const handleUnitHoursChange = (idx, newHours) => {
    setUnits(prev => {
      const updated = [...prev];
      updated[idx].hours = parseInt(newHours, 10) || 8;
      return updated;
    });
  };

  const handleAddModule = () => {
    const nextNum = units.length + 1;
    const newUnit = {
      unit_number: nextNum,
      title: `Module ${nextNum} - Advanced Concepts & Practical Applications`,
      hours: 8,
      topics: [
        "Foundational Principles & Methodologies",
        "Algorithmic Implementations & Case Studies",
        "Laboratory Analysis & Problem Solving"
      ]
    };
    setUnits(prev => [...prev, newUnit]);
    setActiveUnitIdx(units.length);
    if (showToast) {
      showToast(`Added Module ${nextNum}! You can now customize its title, contact hours, and topics.`);
    }
  };

  const handleDeleteModule = (idxToDelete, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (units.length <= 1) {
      if (showToast) showToast('A course must retain at least one module.');
      return;
    }

    const targetUnit = units[idxToDelete];
    const moduleNum = targetUnit?.unit_number || (idxToDelete + 1);

    const updatedUnits = units
      .filter((_, i) => i !== idxToDelete)
      .map((u, i) => ({
        ...u,
        unit_number: i + 1
      }));

    setUnits(updatedUnits);

    setActiveUnitIdx(prevIdx => {
      if (idxToDelete === prevIdx) {
        return Math.max(0, Math.min(prevIdx, updatedUnits.length - 1));
      } else if (idxToDelete < prevIdx) {
        return Math.max(0, prevIdx - 1);
      }
      return Math.min(prevIdx, updatedUnits.length - 1);
    });

    if (showToast) {
      showToast(`Module ${moduleNum} deleted. Course now has ${updatedUnits.length} module(s). Click "Save Draft" to commit changes.`);
    }
  };

  const handleAddTopic = (unitIdx) => {
    if (!newTopicText.trim()) return;
    setUnits(prev => {
      const updated = [...prev];
      if (!updated[unitIdx].topics) updated[unitIdx].topics = [];
      updated[unitIdx].topics.push(newTopicText.trim());
      return updated;
    });
    setNewTopicText('');
  };

  const handleRemoveTopic = (unitIdx, topicIdx) => {
    setUnits(prev => {
      const updated = [...prev];
      updated[unitIdx].topics.splice(topicIdx, 1);
      return updated;
    });
  };

  const handleAdoptAiTopic = (topic, unitIdx = activeUnitIdx) => {
    setUnits(prev => {
      const updated = [...prev];
      if (!updated[unitIdx]) return prev;
      if (!updated[unitIdx].topics) updated[unitIdx].topics = [];
      if (!updated[unitIdx].topics.includes(topic)) {
        updated[unitIdx].topics.push(topic);
      }
      return updated;
    });
    if (showToast) {
      showToast(`Added "${topic}" to Module ${unitIdx + 1}!`);
    }
  };

  const handlePruneObsolete = (obsoleteTopic) => {
    setUnits(prev => {
      const updated = [...prev];
      updated.forEach(u => {
        if (u.topics) {
          u.topics = u.topics.filter(t => !t.toLowerCase().includes(obsoleteTopic.toLowerCase()));
        }
      });
      return updated;
    });
    if (showToast) {
      showToast(`Pruned obsolete concept "${obsoleteTopic}" from syllabus.`);
    }
  };

  const handleSaveModules = async (submitForReview = false) => {
    const effectiveCurriculumId = curriculumId || course?.curriculum_id;
    if (!effectiveCurriculumId) {
      if (showToast) showToast("Error: Curriculum ID not identified.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        curriculum_id: effectiveCurriculumId,
        course_code: course.code,
        units: units,
        faculty_revision_notes: revisionNotes.trim() || (submitForReview ? 'Updated module topics to align with AICTE and industry trends.' : ''),
        submit_for_review: submitForReview,
        user_name: currentUser?.name || 'Faculty Specialist',
        proposed_diff: {
          added_count: addedTopics.length,
          pruned_count: prunedTopics.length,
          added_topics: addedTopics,
          pruned_topics: prunedTopics
        }
      };

      const res = await fetch('/api/courses/update-modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        if (showToast) {
          showToast(
            submitForReview
              ? `Syllabus for ${course.code} submitted for HOD Review!`
              : `Draft module edits saved for ${course.code}.`
          );
        }
        if (onCourseUpdated) {
          onCourseUpdated(data.course);
        }
        setIsEditing(false);
      } else {
        if (showToast) showToast(data.detail || "Error saving module updates.");
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Network error while updating syllabus.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem'
    }} onClick={onClose}>
      <div 
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          width: '100%',
          maxWidth: isEditing ? '1120px' : '860px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-medium)',
          position: 'relative',
          transition: 'max-width 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div style={{
          padding: '1.75rem 2rem 1.25rem 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          zIndex: 10
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className={`badge-category cat-${course.category?.toLowerCase() || 'pcc'}`}>
                {course.category}
              </span>
              <span style={{ fontSize: '0.88rem', color: 'var(--aicte-blue)', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                {course.code}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--aicte-saffron)', fontWeight: 700 }}>
                Semester {course.semester}
              </span>

              {/* Version Pill */}
              <span style={{
                background: '#e0e7ff',
                color: '#3730a3',
                border: '1px solid #c7d2fe',
                fontSize: '0.72rem',
                padding: '0.15rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                <GitBranch size={11} />
                <span>Version {course.version || 'v1.0'}</span>
              </span>

              {/* Status Pill */}
              {course.review_status === 'pending_review' && (
                <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                  ⏳ PENDING HOD APPROVAL
                </span>
              )}
              {course.review_status === 'approved' && (
                <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                  ✓ HOD APPROVED & COMMITTED
                </span>
              )}
              {course.review_status === 'revision_requested' && (
                <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.72rem', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                  ↺ REVISION REQUESTED
                </span>
              )}

              {/* Assigned Faculty Indicator */}
              {course.assigned_faculty_name && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f8fafc', border: '1px solid var(--border-subtle)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)' }}>
                  Allotted to: <b>{course.assigned_faculty_name}</b>
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-title)' }}>
              {course.title}
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span><b>Credits:</b> {course.credits}</span>
              <span><b>L-T-P:</b> {course.lecture_hours || 3}L : {course.tutorial_hours || 0}T : {course.practical_hours || 0}P</span>
              {course.prerequisites && (
                <span><b>Prerequisites:</b> {course.prerequisites}</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button 
              onClick={() => setShowVersionModal(true)}
              className="btn-secondary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              title="View version history and BoS approval audit trail"
            >
              <History size={14} />
              <span>Changelog ({course.version_history?.length || 1})</span>
            </button>

            {!isEditing && isAssignedFaculty && (
              <button 
                onClick={() => setIsEditing(true)}
                className="btn-accent"
                style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
                title="Edit module topics and consult AI curriculum suggestions"
              >
                <Edit3 size={15} />
                <span>Edit Modules & AI Advisor</span>
              </button>
            )}

            <button 
              onClick={onClose}
              style={{
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '999px',
                padding: '0.5rem',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.75rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          {/* Review Alerts if applicable */}
          {course.review_status === 'revision_requested' && course.hod_comments && (
            <div style={{
              background: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start'
            }}>
              <RotateCcw size={18} color="#e11d48" style={{ marginTop: '0.15rem' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#9f1239', fontSize: '0.85rem', marginBottom: '0.2rem' }}>
                  HOD Revision Remarks:
                </div>
                <div style={{ color: '#881337', fontSize: '0.88rem' }}>
                  "{course.hod_comments}"
                </div>
              </div>
            </div>
          )}

          {course.review_status === 'approved' && course.hod_comments && (
            <div style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'center'
            }}>
              <CheckCircle2 size={18} color="#15803d" />
              <div>
                <span style={{ fontWeight: 800, color: '#15803d', fontSize: '0.85rem' }}>HOD Approval Remarks: </span>
                <span style={{ color: '#166534', fontSize: '0.88rem' }}>"{course.hod_comments}"</span>
              </div>
            </div>
          )}

          {/* EDIT MODE: Split view with Module Editor on left and AI Advisor on right */}
          {isEditing ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1.5rem', alignItems: 'flex-start' }}>
              
              {/* Left Column: Module Editor & Version Diff */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-title)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Layers size={16} color="var(--aicte-blue)" />
                    Faculty Syllabus Editor
                  </h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Instructor: <b>{currentUser?.name || "Faculty Member"}</b>
                  </span>
                </div>

                {/* VERSION CONTROL / DIFF PREVIEW STRIP */}
                {(addedTopics.length > 0 || prunedTopics.length > 0) && (
                  <div style={{
                    background: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 800, color: '#166534', marginBottom: '0.35rem' }}>
                      <GitBranch size={15} />
                      <span>Pending Revision Changelog:</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {addedTopics.length > 0 && (
                        <span style={{ color: '#15803d', fontWeight: 700 }}>
                          🟢 +{addedTopics.length} Newly Proposed Topic{addedTopics.length > 1 ? 's' : ''} (Highlighted in Green)
                        </span>
                      )}
                      {prunedTopics.length > 0 && (
                        <span style={{ color: '#dc2626', fontWeight: 700 }}>
                          🔴 -{prunedTopics.length} Obsolete Topic{prunedTopics.length > 1 ? 's' : ''} Pruned
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Module selector tabs with Add & Delete actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {units.map((u, uIdx) => (
                      <div
                        key={uIdx}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          borderRadius: 'var(--radius-md)',
                          border: activeUnitIdx === uIdx ? '1.5px solid var(--aicte-blue)' : '1px solid var(--border-subtle)',
                          background: activeUnitIdx === uIdx ? '#eff6ff' : '#ffffff',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveUnitIdx(uIdx)}
                          style={{
                            padding: '0.4rem 0.65rem',
                            border: 'none',
                            background: 'transparent',
                            color: activeUnitIdx === uIdx ? 'var(--aicte-blue)' : 'var(--text-muted)',
                            fontWeight: activeUnitIdx === uIdx ? 800 : 600,
                            fontSize: '0.8rem',
                            cursor: 'pointer'
                          }}
                        >
                          Module {u.unit_number || uIdx + 1}
                        </button>
                        {units.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleDeleteModule(uIdx, e)}
                            title={`Delete Module ${u.unit_number || uIdx + 1}`}
                            style={{
                              padding: '0.4rem 0.45rem',
                              border: 'none',
                              borderLeft: activeUnitIdx === uIdx ? '1px solid #bfdbfe' : '1px solid #f1f5f9',
                              background: 'transparent',
                              color: activeUnitIdx === uIdx ? '#dc2626' : '#94a3b8',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              lineHeight: 1
                            }}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddModule}
                      title="Add a new Module to this course syllabus"
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1.5px dashed #059669',
                        background: '#ecfdf5',
                        color: '#059669',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem'
                      }}
                    >
                      <Plus size={14} />
                      <span>+ Add Module {units.length + 1}</span>
                    </button>
                  </div>

                  {units.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteModule(activeUnitIdx, e)}
                      title={`Delete Module ${units[activeUnitIdx]?.unit_number || activeUnitIdx + 1}`}
                      style={{
                        padding: '0.35rem 0.65rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        color: '#dc2626',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <Trash2 size={13} />
                      <span>Delete Module {units[activeUnitIdx]?.unit_number || activeUnitIdx + 1}</span>
                    </button>
                  )}
                </div>

                {/* Active Unit Editor Card */}
                {units[activeUnitIdx] && (
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}>
                    {/* Active Module Header Toolbar with 1-click Delete */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-subtle)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <span style={{ fontWeight: 800, color: 'var(--aicte-blue)', fontSize: '0.92rem' }}>
                          Module {units[activeUnitIdx]?.unit_number || activeUnitIdx + 1}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#f8fafc', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                          {units[activeUnitIdx]?.hours || 8} Contact Hours • {(units[activeUnitIdx]?.topics || []).length} Topics
                        </span>
                      </div>

                      {units.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteModule(activeUnitIdx, e)}
                          title={`Delete Module ${units[activeUnitIdx]?.unit_number || activeUnitIdx + 1}`}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '0.76rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem'
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete Module {units[activeUnitIdx]?.unit_number || activeUnitIdx + 1}</span>
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                          Module Title
                        </label>
                        <input 
                          type="text"
                          value={units[activeUnitIdx].title || ''}
                          onChange={(e) => handleUnitTitleChange(activeUnitIdx, e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-medium)',
                            fontSize: '0.85rem',
                            fontWeight: 700
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                          Contact Hours
                        </label>
                        <input 
                          type="number"
                          value={units[activeUnitIdx].hours || 8}
                          onChange={(e) => handleUnitHoursChange(activeUnitIdx, e.target.value)}
                          min="1"
                          max="40"
                          style={{
                            width: '100%',
                            padding: '0.55rem 0.75rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-medium)',
                            fontSize: '0.85rem'
                          }}
                        />
                      </div>
                    </div>

                    {/* Topics List with Highlight for New Topics */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-title)' }}>
                          Module Topics ({units[activeUnitIdx].topics?.length || 0})
                        </label>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Newly added topics are highlighted in green
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '220px', overflowY: 'auto' }}>
                        {units[activeUnitIdx].topics?.map((topic, tIdx) => {
                          const origSet = originalTopicsMap[activeUnitIdx] || new Set();
                          const isNewlyAdded = !origSet.has(topic.trim().toLowerCase());

                          return (
                            <div key={tIdx} style={{
                              background: isNewlyAdded ? '#ecfdf5' : '#f8fafc',
                              border: isNewlyAdded ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                              padding: '0.45rem 0.75rem',
                              borderRadius: 'var(--radius-sm)',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.82rem',
                              transition: 'all 0.2s'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
                                {isNewlyAdded && (
                                  <span style={{
                                    background: '#10b981',
                                    color: '#ffffff',
                                    fontSize: '0.62rem',
                                    fontWeight: 800,
                                    padding: '0.1rem 0.4rem',
                                    borderRadius: '999px',
                                    letterSpacing: '0.04em'
                                  }}>
                                    NEW
                                  </span>
                                )}
                                <span style={{ fontWeight: isNewlyAdded ? 700 : 500, color: isNewlyAdded ? '#065f46' : 'var(--text-body)' }}>
                                  {topic}
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleRemoveTopic(activeUnitIdx, tIdx)}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  color: '#94a3b8',
                                  cursor: 'pointer',
                                  padding: '0.2rem'
                                }}
                                title="Remove topic"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Add Custom Topic Input */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input 
                        type="text"
                        placeholder="Add custom syllabus topic..."
                        value={newTopicText}
                        onChange={(e) => setNewTopicText(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTopic(activeUnitIdx); }}}
                        style={{
                          flex: 1,
                          padding: '0.5rem 0.75rem',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-medium)',
                          fontSize: '0.82rem'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleAddTopic(activeUnitIdx)}
                        style={{
                          background: '#f1f5f9',
                          border: '1px solid var(--border-medium)',
                          padding: '0.5rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Plus size={14} />
                        <span>Add</span>
                      </button>
                    </div>

                  </div>
                )}

                {/* Faculty Revision Justification */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.35rem' }}>
                    Revision Justification for HOD & Board of Studies (BOS)
                  </label>
                  <textarea 
                    rows={2}
                    placeholder="Briefly state why these module updates are being proposed (e.g. Added MapReduce & Distributed Algorithms aligned with AICTE 2024 guidance)..."
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-medium)',
                      fontSize: '0.82rem',
                      resize: 'none'
                    }}
                  />
                </div>

                {/* Save & Submit Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel Editing
                  </button>

                  <div style={{ display: 'flex', gap: '0.65rem' }}>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSaveModules(false)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-title)',
                        padding: '0.55rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Save Draft
                    </button>

                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSaveModules(true)}
                      className="btn-accent"
                      style={{
                        padding: '0.55rem 1.25rem',
                        fontSize: '0.82rem'
                      }}
                    >
                      <Send size={14} />
                      <span>{saving ? 'Submitting...' : 'Submit to HOD for Review'}</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Curriculum Advisor Panel */}
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-title)' }}>
                      AI Curriculum Advisor
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Tailored for <b>{course.title}</b> ({course.code})
                    </div>
                  </div>
                </div>

                {loadingAi ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                    Analyzing syllabus topics against AICTE standards...
                  </div>
                ) : aiSuggestions ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    
                    {/* Modern Topics to Add */}
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <CheckCircle2 size={14} />
                        <span>Recommended Modern Additions</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {(aiSuggestions.modern_topics || aiSuggestions.industry_additions || []).map((item, idx) => (
                          <div key={idx} style={{
                            background: '#ffffff',
                            border: '1px solid #bbf7d0',
                            borderRadius: 'var(--radius-sm)',
                            padding: '0.65rem 0.75rem',
                            fontSize: '0.8rem'
                          }}>
                            <div style={{ fontWeight: 800, color: 'var(--text-title)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>{item.topic}</span>
                              <button
                                type="button"
                                onClick={() => handleAdoptAiTopic(item.topic, activeUnitIdx)}
                                style={{
                                  background: '#ecfdf5',
                                  border: '1px solid #a7f3d0',
                                  color: '#059669',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <Sparkles size={11} />
                                <span>Adopt to Mod {activeUnitIdx + 1}</span>
                              </button>
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              {item.reason}
                            </div>
                            {item.industry_tag && (
                              <div style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
                                • {item.industry_tag}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Obsolete Warnings to Prune */}
                    {aiSuggestions.obsolete_topics && aiSuggestions.obsolete_topics.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <AlertTriangle size={14} />
                          <span>Obsolete / Deprecated Topics</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {aiSuggestions.obsolete_topics.map((item, idx) => (
                            <div key={idx} style={{
                              background: '#ffffff',
                              border: '1px solid #fde68a',
                              borderRadius: 'var(--radius-sm)',
                              padding: '0.65rem 0.75rem',
                              fontSize: '0.8rem'
                            }}>
                              <div style={{ fontWeight: 800, color: 'var(--text-title)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>{item.topic}</span>
                                <button
                                  type="button"
                                  onClick={() => handlePruneObsolete(item.topic)}
                                  style={{
                                    background: '#fffbeb',
                                    border: '1px solid #fde68a',
                                    color: '#b45309',
                                    padding: '0.15rem 0.5rem',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.72rem',
                                    fontWeight: 800,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Prune
                                </button>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                {item.warning || item.reason}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bloom's Cognitive Recommendation */}
                    {aiSuggestions.bloom_recommendations && (
                      <div style={{
                        background: '#faf5ff',
                        border: '1px solid #e9d5ff',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                          Bloom Target: {aiSuggestions.bloom_recommendations.recommended_level}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                          {aiSuggestions.bloom_recommendations.guidance}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    Click "Edit Modules" to activate AI syllabus insights.
                  </div>
                )}
              </div>

            </div>
          ) : (
            /* VIEW MODE */
            <>
              {/* Course Overview */}
              {course.description && (
                <div>
                  <h4 style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem', fontWeight: 700 }}>
                    Course Overview
                  </h4>
                  <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.65' }}>
                    {course.description}
                  </p>
                </div>
              )}

              {/* Detailed Units / Modules with Highlight for New Topics */}
              {course.units && course.units.length > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                      <Layers size={16} color="var(--aicte-blue)" />
                      Detailed Module Syllabus (Module 1 to {course.units.length})
                    </h4>
                    {isAssignedFaculty && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--aicte-blue)', fontWeight: 700 }}>
                        ✎ You are authorized to edit these modules
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {course.units.map((unit, idx) => (
                      <div key={idx} style={{
                        background: '#f8fafc',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '1.1rem',
                        borderLeft: '4px solid var(--aicte-blue)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: 'var(--text-title)', fontSize: '0.95rem' }}>
                            Module {unit.unit_number || idx + 1}: {unit.title}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.15rem 0.55rem', borderRadius: 'var(--radius-sm)', fontWeight: 600 }}>
                            {unit.hours || 8} Contact Hours
                          </span>
                        </div>
                        {unit.topics && unit.topics.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                            {unit.topics.map((t, tIdx) => (
                              <span key={tIdx} style={{
                                background: '#ffffff',
                                border: '1px solid var(--border-subtle)',
                                padding: '0.2rem 0.6rem',
                                borderRadius: 'var(--radius-sm)',
                                fontSize: '0.78rem',
                                color: 'var(--text-body)'
                              }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Course Outcomes with Bloom's Taxonomy */}
              {course.course_outcomes && course.course_outcomes.length > 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                      <Award size={16} color="var(--aicte-saffron)" />
                      Course Outcomes (COs) & Bloom's Taxonomy Levels
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                      Tier-1 OBE Aligned
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {course.course_outcomes.map((co, idx) => (
                      <div key={idx} style={{
                        background: '#f8fafc',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.85rem 1.15rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.85rem'
                      }}>
                        <span style={{
                          fontWeight: 800,
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--aicte-blue)',
                          fontSize: '0.85rem',
                          minWidth: '40px'
                        }}>
                          {co.code || `CO${idx+1}`}
                        </span>
                        <span style={{ flex: 1, fontSize: '0.88rem', color: 'var(--text-title)' }}>
                          {co.description}
                        </span>
                        <span className={`badge-bloom bloom-${co.bloom_level || 'Understand'}`}>
                          {co.bloom_level || 'Understand'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Textbooks & References */}
              {course.textbooks && course.textbooks.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                    <BookmarkCheck size={16} color="var(--aicte-purple)" />
                    AICTE Recommended Textbooks & Reference Resources
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-body)', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {course.textbooks.map((book, bIdx) => (
                      <li key={bIdx}>{book}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Version History & Changelog Modal */}
      {showVersionModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10001,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '85vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            border: '1px solid var(--border-medium)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--aicte-blue)', fontSize: '0.88rem' }}>
                    {course.code}
                  </span>
                  <span style={{
                    background: '#e0e7ff',
                    color: '#3730a3',
                    border: '1px solid #c7d2fe',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    padding: '0.1rem 0.45rem',
                    borderRadius: '4px'
                  }}>
                    Active: {course.version || 'v1.0'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Curriculum Version History & Changelog
                </h3>
              </div>
              <button 
                onClick={() => setShowVersionModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.4rem',
                  cursor: 'pointer',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', margin: 0 }}>
                Chronological audit record of approved curriculum revisions, departmental justifications, and topic modifications.
              </p>

              {course.version_history && course.version_history.length > 0 ? (
                course.version_history.slice().reverse().map((entry, idx) => (
                  <div key={idx} style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.1rem',
                    borderLeft: idx === 0 ? '4px solid #16a34a' : '4px solid var(--border-medium)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.92rem', color: idx === 0 ? '#15803d' : 'var(--text-title)' }}>
                          Version {entry.version}
                        </span>
                        <span style={{
                          background: idx === 0 ? '#dcfce7' : '#f1f5f9',
                          color: idx === 0 ? '#15803d' : 'var(--text-muted)',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.4rem',
                          borderRadius: '3px'
                        }}>
                          {idx === 0 ? 'Current Active Scheme' : 'Archived Scheme'}
                        </span>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        {entry.timestamp}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '0.35rem', lineHeight: '1.5' }}>
                      <div><b>Ratified By:</b> {entry.approved_by || 'Academic Council & BoS'}</div>
                      <div><b>Faculty Author:</b> {entry.faculty_author || 'Curriculum Drafting Committee'}</div>
                      {entry.revision_notes && (
                        <div><b>Revision Notes:</b> {entry.revision_notes}</div>
                      )}
                      {entry.hod_comments && (
                        <div style={{ background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: '4px', borderLeft: '3px solid var(--aicte-blue)' }}>
                          <b>HOD Remarks:</b> {entry.hod_comments}
                        </div>
                      )}
                      {entry.proposed_diff && (entry.proposed_diff.added_topics?.length > 0 || entry.proposed_diff.pruned_topics?.length > 0) && (
                        <div style={{ marginTop: '0.4rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {entry.proposed_diff.added_topics?.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, color: '#15803d', fontSize: '0.74rem' }}>Added Topics:</span>
                              {entry.proposed_diff.added_topics.map((at, atIdx) => (
                                <span key={atIdx} style={{ background: '#dcfce7', color: '#166534', padding: '0.08rem 0.4rem', borderRadius: '3px', fontSize: '0.72rem' }}>
                                  + Mod {at.module}: {at.topic}
                                </span>
                              ))}
                            </div>
                          )}
                          {entry.proposed_diff.pruned_topics?.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontWeight: 700, color: '#dc2626', fontSize: '0.74rem' }}>Pruned Topics:</span>
                              {entry.proposed_diff.pruned_topics.map((pt, ptIdx) => (
                                <span key={ptIdx} style={{ background: '#fee2e2', color: '#991b1b', padding: '0.08rem 0.4rem', borderRadius: '3px', fontSize: '0.72rem', textDecoration: 'line-through' }}>
                                  - Mod {pt.module}: {pt.topic}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  borderLeft: '4px solid #16a34a'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, color: '#15803d', fontSize: '0.9rem' }}>
                      Version v1.0 (Baseline Scheme)
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      2023-08-10 10:00
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-body)', lineHeight: '1.5' }}>
                    <b>Ratified by:</b> Academic Council & Board of Studies (BoS)<br />
                    <b>Status:</b> Initial Autonomous CBCS Scheme for Batch 2023–2027 (160.0 Credits)
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: '1rem 1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'flex-end',
              background: '#f8fafc'
            }}>
              <button 
                className="btn-secondary"
                onClick={() => setShowVersionModal(false)}
                style={{ padding: '0.45rem 1.25rem' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
