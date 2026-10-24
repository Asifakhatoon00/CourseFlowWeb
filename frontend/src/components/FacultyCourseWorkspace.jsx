import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Sparkles, 
  RotateCcw,
  FileText,
  AlertCircle,
  Plus,
  Trash2,
  Check,
  Send,
  Save,
  Undo2,
  ChevronDown,
  Lightbulb,
  X,
  Award,
  GitCompare,
  History,
  Eye
} from 'lucide-react';

export default function FacultyCourseWorkspace({ 
  curriculum, 
  currentUser, 
  onSelectCourse, 
  showToast, 
  onUpdateCurrentUser, 
  onRefreshCurriculum, 
  activeUniversity 
}) {
  const [localCurriculum, setLocalCurriculum] = useState(curriculum);
  const [selectedCourseCode, setSelectedCourseCode] = useState(null);
  const [editableUnits, setEditableUnits] = useState([]);
  const [originalUnits, setOriginalUnits] = useState([]);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [facultyNotes, setFacultyNotes] = useState('');
  const [newTopicInputs, setNewTopicInputs] = useState({});
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [addedAiTopics, setAddedAiTopics] = useState(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);

  // Sync or fetch fallback curriculum if not passed yet
  useEffect(() => {
    if (curriculum) {
      setLocalCurriculum(curriculum);
    } else {
      fetch('/api/curriculum/univ-presidency-01-curriculum-2023-2027')
        .then(r => r.json())
        .then(data => {
          if (data && data.semesters) setLocalCurriculum(data);
        })
        .catch(() => {});
    }
  }, [curriculum]);

  // Extract all courses across all semesters
  const allCourses = useMemo(() => {
    const list = [];
    if (localCurriculum?.semesters) {
      localCurriculum.semesters.forEach(s => {
        if (s.courses) {
          s.courses.forEach(c => {
            list.push({ 
              ...c, 
              semester: s.semester_number,
              curriculum_id: localCurriculum.id
            });
          });
        }
      });
    }
    return list;
  }, [localCurriculum]);

  // Allotted courses for current logged-in faculty
  const allottedCourses = useMemo(() => {
    const matched = allCourses.filter(c => {
      if (currentUser?.assigned_courses?.includes(c.code)) return true;
      if (c.assigned_faculty_id && currentUser?.id && c.assigned_faculty_id === currentUser.id) return true;
      if (c.assigned_faculty_name && currentUser?.name && c.assigned_faculty_name.toLowerCase().includes(currentUser.name.toLowerCase())) return true;
      if (currentUser?.email === 'faculty.daa@presidencyuniversity.in' && c.code === 'CSE2007') return true;
      if (currentUser?.email === 'faculty.ds@presidencyuniversity.in' && c.code === 'CSE2001') return true;
      return false;
    });
    return matched;
  }, [allCourses, currentUser]);

  // Set the default active course directly to the faculty's handled subject
  useEffect(() => {
    if (currentUser?.email === 'faculty.daa@presidencyuniversity.in') {
      setSelectedCourseCode('CSE2007');
    } else if (currentUser?.email === 'faculty.ds@presidencyuniversity.in') {
      setSelectedCourseCode('CSE2001');
    } else if (currentUser?.assigned_courses?.length > 0) {
      setSelectedCourseCode(currentUser.assigned_courses[0]);
    } else if (allottedCourses.length > 0) {
      setSelectedCourseCode(allottedCourses[0].code);
    } else {
      setSelectedCourseCode('CSE2007');
    }
  }, [currentUser?.email, currentUser?.id, allottedCourses]);

  // Currently active course object
  const activeCourse = useMemo(() => {
    if (!selectedCourseCode) return null;
    return allCourses.find(c => c.code.toUpperCase() === selectedCourseCode.toUpperCase()) || null;
  }, [allCourses, selectedCourseCode]);

  // When active course changes, populate editable units and load AI suggestions
  useEffect(() => {
    if (activeCourse) {
      const unitsClone = JSON.parse(JSON.stringify(activeCourse.units || []));
      setEditableUnits(unitsClone);
      setOriginalUnits(JSON.parse(JSON.stringify(activeCourse.units || [])));
      setFacultyNotes(activeCourse.faculty_revision_notes || '');
      setNewTopicInputs({});
      setAddedAiTopics(new Set());

      // Fetch AI recommendations for this particular course
      const currId = activeCourse.curriculum_id || localCurriculum?.id || 'univ-presidency-01-curriculum-2023-2027';
      setIsLoadingAi(true);
      fetch(`/api/courses/${currId}/${activeCourse.code}/ai-suggestions`)
        .then(r => r.json())
        .then(data => {
          setAiSuggestions(data);
        })
        .catch(err => {
          console.warn("AI suggestions fetch error:", err);
        })
        .finally(() => {
          setIsLoadingAi(false);
        });
    }
  }, [activeCourse?.code, activeCourse?.curriculum_id]);

  // Real-time Version Control & Visual Diff Tracker
  const diffStats = useMemo(() => {
    const added = [];
    const pruned = [];
    const modifiedMods = [];

    editableUnits.forEach((u, uIdx) => {
      const orig = originalUnits[uIdx];
      const modNum = u.unit_number || uIdx + 1;
      if (!orig) {
        (u.topics || []).forEach(t => added.push({ module: modNum, topic: t }));
        modifiedMods.push({ module: modNum, title: u.title, hours: u.hours, isNew: true });
      } else {
        const origSet = new Set((orig.topics || []).map(t => t.trim().toLowerCase()));
        const currSet = new Set((u.topics || []).map(t => t.trim().toLowerCase()));

        (u.topics || []).forEach(t => {
          if (!origSet.has(t.trim().toLowerCase())) {
            added.push({ module: modNum, topic: t });
          }
        });

        (orig.topics || []).forEach(t => {
          if (!currSet.has(t.trim().toLowerCase())) {
            pruned.push({ module: modNum, topic: t });
          }
        });

        if (orig.title !== u.title || orig.hours !== u.hours) {
          modifiedMods.push({
            module: modNum,
            oldTitle: orig.title,
            newTitle: u.title,
            oldHours: orig.hours,
            newHours: u.hours
          });
        }
      }
    });

    return {
      addedTopics: added,
      prunedTopics: pruned,
      modifiedModules: modifiedMods,
      hasChanges: added.length > 0 || pruned.length > 0 || modifiedMods.length > 0
    };
  }, [editableUnits, originalUnits]);

  // Restore a pruned topic
  const handleRestoreTopic = (unitIdx, topicText) => {
    setEditableUnits(prev => {
      const copy = [...prev];
      if (copy[unitIdx]) {
        copy[unitIdx] = {
          ...copy[unitIdx],
          topics: [...(copy[unitIdx].topics || []), topicText]
        };
      }
      return copy;
    });
    if (showToast) showToast(`Restored "${topicText}" to Module ${unitIdx + 1}`);
  };

  // Handlers for Module Editing
  const handleUnitTitleChange = (unitIdx, newTitle) => {
    setEditableUnits(prev => {
      const copy = [...prev];
      copy[unitIdx] = { ...copy[unitIdx], title: newTitle };
      return copy;
    });
  };

  const handleUnitHoursChange = (unitIdx, newHours) => {
    const hoursNum = parseInt(newHours, 10) || 0;
    setEditableUnits(prev => {
      const copy = [...prev];
      copy[unitIdx] = { ...copy[unitIdx], hours: hoursNum };
      return copy;
    });
  };

  // Delete a module
  const handleDeleteModule = (unitIdx) => {
    const moduleName = editableUnits[unitIdx]?.title || `Module ${unitIdx + 1}`;
    if (!window.confirm(`Are you sure you want to delete ${moduleName}?`)) return;

    setEditableUnits(prev => {
      const copy = prev.filter((_, idx) => idx !== unitIdx);
      // Re-index remaining modules
      return copy.map((u, i) => ({ ...u, unit_number: i + 1 }));
    });
    if (showToast) showToast(`Deleted module: ${moduleName}`);
  };

  // Add a new module
  const handleAddModule = () => {
    const nextNum = editableUnits.length + 1;
    const newUnit = {
      unit_number: nextNum,
      title: `Module ${nextNum} - Advanced Topics`,
      hours: 8,
      topics: ['Foundational Concepts and Paradigms']
    };
    setEditableUnits(prev => [...prev, newUnit]);
    if (showToast) showToast(`Added Module ${nextNum}. You can now customize its title and topics.`);
  };

  // Delete a topic from a module
  const handleDeleteTopic = (unitIdx, topicIdx) => {
    setEditableUnits(prev => {
      const copy = [...prev];
      const targetUnit = { ...copy[unitIdx] };
      targetUnit.topics = targetUnit.topics.filter((_, idx) => idx !== topicIdx);
      copy[unitIdx] = targetUnit;
      return copy;
    });
  };

  // Add a topic to a module
  const handleAddTopic = (unitIdx) => {
    const text = (newTopicInputs[unitIdx] || '').trim();
    if (!text) return;

    setEditableUnits(prev => {
      const copy = [...prev];
      const targetUnit = { ...copy[unitIdx] };
      targetUnit.topics = [...(targetUnit.topics || []), text];
      copy[unitIdx] = targetUnit;
      return copy;
    });

    // Clear input
    setNewTopicInputs(prev => ({ ...prev, [unitIdx]: '' }));
    if (showToast) showToast(`Added topic to Module ${unitIdx + 1}`);
  };

  // Add an AI-recommended topic to a specific module
  const handleAddAITopic = (topicName, targetModuleNum) => {
    const targetIdx = Math.max(0, Math.min((targetModuleNum || 1) - 1, editableUnits.length - 1));
    setEditableUnits(prev => {
      const copy = [...prev];
      if (copy[targetIdx]) {
        const targetUnit = { ...copy[targetIdx] };
        if (!targetUnit.topics.includes(topicName)) {
          targetUnit.topics = [...targetUnit.topics, topicName];
        }
        copy[targetIdx] = targetUnit;
      }
      return copy;
    });

    setAddedAiTopics(prev => new Set(prev).add(topicName));
    if (showToast) showToast(`Added AI Recommended topic to Module ${targetIdx + 1}!`);
  };

  // Save changes (Draft or Submit to HOD)
  const handleSaveModules = async (submitForReview = false) => {
    if (!activeCourse) return;

    if (submitForReview) {
      setIsSubmitting(true);
    } else {
      setIsSaving(true);
    }

    const currId = activeCourse.curriculum_id || localCurriculum?.id || 'univ-presidency-01-curriculum-2023-2027';

    // Construct structured version diff & changelog
    const proposedDiff = {
      version: activeCourse.version || 'v1.0',
      timestamp: new Date().toISOString(),
      faculty_name: currentUser?.name || 'Faculty Specialist',
      added_topics: diffStats.addedTopics,
      pruned_topics: diffStats.prunedTopics,
      modified_modules: diffStats.modifiedModules,
      summary: `${diffStats.addedTopics.length} topics added, ${diffStats.prunedTopics.length} pruned, ${diffStats.modifiedModules.length} modified`
    };

    try {
      const res = await fetch(`/api/courses/update-modules?user_name=${encodeURIComponent(currentUser?.name || 'Faculty Specialist')}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          curriculum_id: currId,
          course_code: activeCourse.code,
          units: editableUnits,
          faculty_revision_notes: facultyNotes || undefined,
          submit_for_review: submitForReview,
          proposed_diff: proposedDiff
        })
      });

      const data = await res.json();
      if (res.ok) {
        setLastSavedTime(new Date().toLocaleTimeString());
        if (showToast) {
          showToast(submitForReview 
            ? `Successfully submitted ${activeCourse.code} to HOD with ${diffStats.addedTopics.length} new topics & visual diff!`
            : `Saved draft for ${activeCourse.code} modules.`
          );
        }

        // Update local curriculum state
        setLocalCurriculum(prev => {
          if (!prev) return prev;
          const cloned = JSON.parse(JSON.stringify(prev));
          cloned.semesters.forEach(s => {
            s.courses.forEach(c => {
              if (c.code.toUpperCase() === activeCourse.code.toUpperCase()) {
                c.units = editableUnits;
                c.review_status = submitForReview ? 'pending_review' : 'draft';
                c.proposed_diff = proposedDiff;
                if (facultyNotes) c.faculty_revision_notes = facultyNotes;
              }
            });
          });
          return cloned;
        });

        if (onRefreshCurriculum) onRefreshCurriculum();
      } else {
        if (showToast) showToast(data.detail || "Error saving modules.");
      }
    } catch (e) {
      console.error("Save modules error:", e);
      if (showToast) showToast("Failed to save modules due to network issue.");
    } finally {
      setIsSaving(false);
      setIsSubmitting(false);
    }
  };

  // Total teaching contact hours across all modules
  const totalModuleHours = editableUnits.reduce((sum, u) => sum + (u.hours || 0), 0);
  const totalTopicsCount = editableUnits.reduce((sum, u) => sum + (u.topics?.length || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
      
      {/* Top Header Card: Instructor & Handled Course Switcher */}
      <div className="pro-card" style={{
        padding: '1.75rem 2rem',
        background: '#ffffff',
        borderLeft: '5px solid #1e40af',
        boxShadow: '0 4px 16px rgba(15, 39, 68, 0.06)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
              <span className="brand-pill" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
                Faculty Teaching Portal
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Instructor: <b style={{ color: 'var(--text-title)' }}>{currentUser?.name || "Prof. Rajesh Kumar"}</b> ({currentUser?.designation || "Faculty Specialist"})
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                • {currentUser?.department || "Computer Science & Engineering"}
              </span>
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', margin: 0 }}>
              Faculty Subject Dashboard & Direct Module Editor
            </h1>
            <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', margin: '0.35rem 0 0 0' }}>
              Directly customize, add, and delete modules and topics for your assigned course. Incorporate AI-recommended modern industry topics and submit for Board of Studies review.
            </p>
          </div>

          {/* Course Switcher: Allows selecting handled course or switching if multiple */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1.15rem',
            minWidth: '280px'
          }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Your Handled Course:
            </div>
            <select
              value={selectedCourseCode || 'CSE2007'}
              onChange={(e) => setSelectedCourseCode(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid #93c5fd',
                background: '#ffffff',
                fontWeight: 700,
                fontSize: '0.92rem',
                color: '#1e40af',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {/* Prioritize allotted courses */}
              {allottedCourses.length > 0 && (
                <optgroup label="Your Assigned Subjects">
                  {allottedCourses.map(c => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.title} (Sem {c.semester})
                    </option>
                  ))}
                </optgroup>
              )}
              {/* Also show all department courses for fast switching */}
              <optgroup label="All Department Courses">
                {allCourses.filter(c => !allottedCourses.some(ac => ac.code === c.code)).map(c => (
                  <option key={c.code} value={c.code}>
                    {c.code} - {c.title} (Sem {c.semester})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>

      {activeCourse ? (
        <>
          {/* Active Handled Course Overview Banner */}
          <div className="pro-card" style={{
            padding: '1.75rem 2rem',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`badge-category cat-${activeCourse.category?.toLowerCase() || 'pcc'}`}>
                    {activeCourse.category || 'PCC'}
                  </span>
                  <span style={{ fontSize: '1.15rem', color: '#1e40af', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                    {activeCourse.code}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#b45309', fontWeight: 700, background: '#fef3c7', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
                    Semester {activeCourse.semester}
                  </span>

                  {/* Version Badge */}
                  <span style={{ fontSize: '0.78rem', color: '#1e40af', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    <GitCompare size={13} />
                    <span>Version {activeCourse.version || 'v1.0'}</span>
                  </span>

                  {/* Review Status Pill */}
                  {activeCourse.review_status === 'pending_review' && (
                    <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                      ⏳ PENDING HOD REVIEW
                    </span>
                  )}
                  {activeCourse.review_status === 'approved' && (
                    <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                      ✓ HOD APPROVED & COMMITTED
                    </span>
                  )}
                  {activeCourse.review_status === 'revision_requested' && (
                    <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.75rem', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-sm)', fontWeight: 800 }}>
                      ↺ REVISION REQUESTED BY HOD
                    </span>
                  )}
                </div>

                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-title)', margin: '0 0 0.5rem 0' }}>
                  {activeCourse.title}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.88rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                  <span><b>Credits:</b> {activeCourse.credits}</span>
                  <span><b>Structure:</b> {activeCourse.lecture_hours || 3}L : {activeCourse.tutorial_hours || 0}T : {activeCourse.practical_hours || 0}P</span>
                  <span><b>Modules:</b> {editableUnits.length} Units</span>
                  <span><b>Total Contact Hours:</b> {totalModuleHours} Hrs</span>
                  <span><b>Total Topics:</b> {totalTopicsCount} Topics</span>
                </div>
              </div>

              {/* Action Toolbar: Version History, Save Draft & Submit to HOD */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setShowVersionHistory(true)}
                  style={{
                    background: '#f8fafc',
                    color: 'var(--text-title)',
                    border: '1.5px solid var(--border-medium)',
                    padding: '0.7rem 1.15rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem'
                  }}
                  title="View Version History & Audit Changelog"
                >
                  <History size={16} color="#1e40af" />
                  <span>Version History</span>
                </button>

                <button
                  onClick={() => handleSaveModules(false)}
                  disabled={isSaving || isSubmitting}
                  style={{
                    background: '#ffffff',
                    color: '#1e40af',
                    border: '1.5px solid #bfdbfe',
                    padding: '0.7rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.04)'
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                </button>

                <button
                  onClick={() => handleSaveModules(true)}
                  disabled={isSaving || isSubmitting}
                  className="btn-accent"
                  style={{
                    padding: '0.7rem 1.4rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? "Submitting..." : "Submit to HOD for Review"}</span>
                </button>
              </div>
            </div>

            {/* Optional Revision Remarks Field */}
            <div style={{
              background: '#f8fafc',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}>
              <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Submission Remarks for HOD / Board of Studies (Optional Note):
              </label>
              <input
                type="text"
                value={facultyNotes}
                onChange={(e) => setFacultyNotes(e.target.value)}
                placeholder="e.g., Added modern distributed algorithms in Unit 4, pruned obsolete manual pivot techniques."
                style={{
                  border: '1px solid var(--border-medium)',
                  background: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.86rem',
                  color: 'var(--text-title)',
                  outline: 'none'
                }}
              />
            </div>

            {/* Live Version Diff & Pending Modifications Banner */}
            {diffStats.hasChanges && (
              <div style={{
                background: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                borderRadius: 'var(--radius-md)',
                padding: '0.9rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#d1fae5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <GitCompare size={17} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, color: '#065f46', fontSize: '0.9rem' }}>
                      Version Control: Active Syllabus Modifications
                    </div>
                    <div style={{ color: '#047857', fontSize: '0.82rem', marginTop: '0.15rem' }}>
                      {diffStats.addedTopics.length > 0 && <span style={{ fontWeight: 700 }}>+{diffStats.addedTopics.length} Added Topics </span>}
                      {diffStats.prunedTopics.length > 0 && <span>• <span style={{ fontWeight: 700 }}>-{diffStats.prunedTopics.length} Pruned Topics </span></span>}
                      {diffStats.modifiedModules.length > 0 && <span>• <span style={{ fontWeight: 700 }}>{diffStats.modifiedModules.length} Modules Adjusted</span></span>}
                      <span style={{ marginLeft: '0.5rem', opacity: 0.85 }}>(Visual diff will be submitted to HOD)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowVersionHistory(true)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #10b981',
                    color: '#065f46',
                    borderRadius: 'var(--radius-sm)',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Eye size={14} />
                  <span>Inspect Version Diff</span>
                </button>
              </div>
            )}

            {/* HOD Feedback Banner if revision was requested or feedback was given */}
            {activeCourse.hod_comments && (
              <div style={{
                background: activeCourse.review_status === 'revision_requested' ? '#fff1f2' : '#f0fdf4',
                border: `1px solid ${activeCourse.review_status === 'revision_requested' ? '#fecdd3' : '#bbf7d0'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.15rem',
                fontSize: '0.86rem',
                display: 'flex',
                gap: '0.65rem',
                alignItems: 'flex-start'
              }}>
                {activeCourse.review_status === 'revision_requested' ? (
                  <RotateCcw size={18} color="#e11d48" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                ) : (
                  <CheckCircle2 size={18} color="#15803d" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                )}
                <div>
                  <span style={{ fontWeight: 800, color: activeCourse.review_status === 'revision_requested' ? '#9f1239' : '#15803d' }}>
                    HOD Reviewer Feedback:
                  </span>
                  <span style={{ color: activeCourse.review_status === 'revision_requested' ? '#881337' : '#166534', marginLeft: '0.4rem' }}>
                    "{activeCourse.hod_comments}"
                  </span>
                </div>
              </div>
            )}

            {lastSavedTime && (
              <div style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Check size={14} />
                <span>Last updated and saved at {lastSavedTime}</span>
              </div>
            )}
          </div>

          {/* AI Recommendations Panel: Industry Modern Topics & Obsolete Pruning */}
          {aiSuggestions && (
            <div className="pro-card" style={{
              padding: '1.5rem 1.75rem',
              background: '#f8fafc',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-lg)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={18} color="#1e40af" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>
                    AI Recommendations for {activeCourse.code}: Industry Standards & Topic Additions
                  </h3>
                </div>
                <span style={{ fontSize: '0.78rem', background: '#eff6ff', color: '#1e40af', padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                  1-Click Topic Injection
                </span>
              </div>

              {/* Modern Industry Topic Suggestions */}
              {aiSuggestions.modern_topics && aiSuggestions.modern_topics.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Recommended Topics to Add into Modules:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.75rem' }}>
                    {aiSuggestions.modern_topics.map((t, idx) => {
                      const isAdded = addedAiTopics.has(t.topic) || editableUnits.some(u => u.topics.includes(t.topic));
                      return (
                        <div key={idx} style={{
                          background: '#ffffff',
                          border: isAdded ? '1.5px solid #10b981' : '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          padding: '0.85rem 1rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.65rem'
                        }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1e40af', background: '#eff6ff', padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                {t.industry_tag || "Industry Standard"}
                              </span>
                              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                Target: Module {t.module_number || 4}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-title)' }}>
                              {t.topic}
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text-body)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                              {t.reason}
                            </div>
                          </div>

                          <button
                            onClick={() => handleAddAITopic(t.topic, t.module_number || 4)}
                            disabled={isAdded}
                            style={{
                              background: isAdded ? '#f0fdf4' : '#1e40af',
                              color: isAdded ? '#15803d' : '#ffffff',
                              border: isAdded ? '1px solid #bbf7d0' : 'none',
                              padding: '0.45rem 0.85rem',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: isAdded ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.35rem',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {isAdded ? (
                              <>
                                <Check size={14} />
                                <span>Topic Added to Module {t.module_number || 4}</span>
                              </>
                            ) : (
                              <>
                                <Plus size={14} />
                                <span>+ Add to Module {t.module_number || 4}</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Obsolete Topics Warning */}
              {aiSuggestions.obsolete_topics && aiSuggestions.obsolete_topics.length > 0 && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-medium)', paddingTop: '0.85rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={15} />
                    <span>Deprecated / Obsolete Topics to Prune:</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0.75rem' }}>
                    {aiSuggestions.obsolete_topics.map((obs, idx) => (
                      <div key={idx} style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: 'var(--radius-md)',
                        padding: '0.75rem 1rem',
                        fontSize: '0.82rem'
                      }}>
                        <div style={{ fontWeight: 800, color: '#991b1b' }}>
                          ⚠️ {obs.topic}
                        </div>
                        <div style={{ color: '#7f1d1d', marginTop: '0.2rem', fontSize: '0.78rem' }}>
                          {obs.warning}
                        </div>
                        {obs.recommended_replacement && (
                          <div style={{ color: '#166534', marginTop: '0.35rem', fontSize: '0.76rem', fontWeight: 600 }}>
                            💡 Replace with: {obs.recommended_replacement}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct Modules & Topics Editor: Modules 1 to N */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Modules & Topics for {activeCourse.code} ({editableUnits.length} Modules)
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  Edit titles, adjust lecture hours, delete or add modules and topics directly inline.
                </p>
              </div>

              {/* Add Module Button */}
              <button
                onClick={handleAddModule}
                className="btn-primary"
                style={{
                  padding: '0.65rem 1.15rem',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 2px 8px rgba(30, 64, 175, 0.2)'
                }}
              >
                <Plus size={16} />
                <span>+ Add Module</span>
              </button>
            </div>

            {/* Modules List */}
            {editableUnits.length === 0 ? (
              <div className="pro-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>No modules currently defined for this course.</p>
                <button onClick={handleAddModule} className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
                  <Plus size={16} />
                  <span>+ Add First Module</span>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {editableUnits.map((unit, unitIdx) => (
                  <div 
                    key={unitIdx}
                    className="pro-card"
                    style={{
                      padding: '1.5rem',
                      background: '#ffffff',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-lg)',
                      borderLeft: '5px solid #1e40af',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem'
                    }}
                  >
                    {/* Module Top Row: Badge, Title Input, Hours Input, Delete Module */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: '300px' }}>
                        <span style={{
                          background: '#1e40af',
                          color: '#ffffff',
                          padding: '0.4rem 0.85rem',
                          borderRadius: 'var(--radius-md)',
                          fontWeight: 800,
                          fontSize: '0.84rem',
                          letterSpacing: '0.02em',
                          flexShrink: 0
                        }}>
                          Module {unit.unit_number || unitIdx + 1}
                        </span>

                        {/* Editable Module Title */}
                        <div style={{ flex: 1 }}>
                          <input
                            type="text"
                            value={unit.title}
                            onChange={(e) => handleUnitTitleChange(unitIdx, e.target.value)}
                            placeholder="Enter module title..."
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.85rem',
                              border: '1.5px solid var(--border-medium)',
                              borderRadius: 'var(--radius-md)',
                              fontSize: '1.05rem',
                              fontWeight: 800,
                              color: 'var(--text-title)',
                              outline: 'none',
                              background: '#f8fafc',
                              transition: 'border-color 0.2s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#1e40af'}
                            onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
                          />
                        </div>
                      </div>

                      {/* Hours & Delete Module Action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f1f5f9', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-md)' }}>
                          <Clock size={15} color="var(--text-muted)" />
                          <input
                            type="number"
                            min="1"
                            max="40"
                            value={unit.hours || 8}
                            onChange={(e) => handleUnitHoursChange(unitIdx, e.target.value)}
                            style={{
                              width: '45px',
                              padding: '0.2rem 0.35rem',
                              border: '1px solid var(--border-medium)',
                              borderRadius: 'var(--radius-sm)',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              textAlign: 'center',
                              background: '#ffffff'
                            }}
                          />
                          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                            Hours
                          </span>
                        </div>

                        {/* Delete Module Button */}
                        <button
                          onClick={() => handleDeleteModule(unitIdx)}
                          title="Delete this entire module"
                          style={{
                            background: '#fef2f2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: 'var(--radius-md)',
                            padding: '0.45rem 0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Trash2 size={15} />
                          <span>Delete Module</span>
                        </button>
                      </div>
                    </div>

                    {/* Topics List for this Module */}
                    <div style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem'
                    }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                        Module Topics ({unit.topics?.length || 0}):
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {(unit.topics || []).map((topic, topicIdx) => {
                          const isNew = diffStats.addedTopics.some(
                            a => a.module === (unit.unit_number || unitIdx + 1) && 
                            a.topic.trim().toLowerCase() === topic.trim().toLowerCase()
                          );
                          return (
                            <div 
                              key={topicIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: isNew ? '#ecfdf5' : '#ffffff',
                                border: isNew ? '1.5px solid #10b981' : '1px solid var(--border-medium)',
                                borderRadius: 'var(--radius-sm)',
                                padding: '0.5rem 0.85rem',
                                gap: '0.75rem',
                                boxShadow: isNew ? '0 2px 6px rgba(16, 185, 129, 0.12)' : '0 1px 2px rgba(0,0,0,0.02)'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flex: 1, flexWrap: 'wrap' }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isNew ? '#10b981' : '#1e40af', flexShrink: 0 }}></span>
                                <span style={{ fontSize: '0.88rem', color: 'var(--text-title)', lineHeight: '1.4', fontWeight: isNew ? 700 : 400 }}>
                                  {topic}
                                </span>
                                {isNew && (
                                  <span style={{
                                    background: '#10b981',
                                    color: '#ffffff',
                                    fontSize: '0.62rem',
                                    fontWeight: 800,
                                    padding: '0.1rem 0.45rem',
                                    borderRadius: '3px',
                                    letterSpacing: '0.04em'
                                  }}>
                                    + NEW TOPIC
                                  </span>
                                )}
                              </div>

                              {/* Delete Topic Button */}
                              <button
                                onClick={() => handleDeleteTopic(unitIdx, topicIdx)}
                                title="Delete this topic"
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#94a3b8',
                                  cursor: 'pointer',
                                  padding: '0.2rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderRadius: 'var(--radius-sm)',
                                  transition: 'color 0.15s ease'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.color = '#dc2626'}
                                onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Pruned Topics Notice & 1-Click Undo */}
                      {(() => {
                        const prunedInThisMod = diffStats.prunedTopics.filter(p => p.module === (unit.unit_number || unitIdx + 1));
                        if (prunedInThisMod.length === 0) return null;
                        return (
                          <div style={{
                            marginTop: '0.65rem',
                            padding: '0.5rem 0.85rem',
                            background: '#fef2f2',
                            border: '1px dashed #fca5a5',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.78rem'
                          }}>
                            <span style={{ fontWeight: 800, color: '#dc2626' }}>Pruned Topics ({prunedInThisMod.length}): </span>
                            {prunedInThisMod.map((p, pIdx) => (
                              <span key={pIdx} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', marginRight: '0.85rem', color: '#991b1b', marginTop: '0.2rem' }}>
                                <span style={{ textDecoration: 'line-through' }}>{p.topic}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRestoreTopic(unitIdx, p.topic)}
                                  style={{
                                    background: '#ffffff',
                                    border: '1px solid #fecaca',
                                    borderRadius: '3px',
                                    padding: '0.1rem 0.4rem',
                                    color: '#b91c1c',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '0.7rem'
                                  }}
                                >
                                  Undo
                                </button>
                              </span>
                            ))}
                          </div>
                        );
                      })()}

                      {/* Add Topic Inline Input */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem' }}>
                        <input
                          type="text"
                          value={newTopicInputs[unitIdx] || ''}
                          onChange={(e) => setNewTopicInputs(prev => ({ ...prev, [unitIdx]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddTopic(unitIdx);
                            }
                          }}
                          placeholder={`Add a new topic to Module ${unit.unit_number || unitIdx + 1}...`}
                          style={{
                            flex: 1,
                            padding: '0.5rem 0.85rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1.5px solid #cbd5e1',
                            fontSize: '0.86rem',
                            outline: 'none',
                            background: '#ffffff'
                          }}
                        />
                        <button
                          onClick={() => handleAddTopic(unitIdx)}
                          className="btn-secondary"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.84rem',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            flexShrink: 0
                          }}
                        >
                          <Plus size={15} />
                          <span>+ Add Topic</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Add Module Button and Sticky Save Bar */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '1.25rem 1.75rem',
              background: '#ffffff',
              border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-lg)',
              marginTop: '0.5rem'
            }}>
              <button
                onClick={handleAddModule}
                className="btn-secondary"
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.86rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Plus size={16} />
                <span>+ Add Another Module</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleSaveModules(false)}
                  disabled={isSaving || isSubmitting}
                  style={{
                    background: '#ffffff',
                    color: '#1e40af',
                    border: '1.5px solid #bfdbfe',
                    padding: '0.7rem 1.35rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <Save size={16} />
                  <span>{isSaving ? "Saving..." : "Save Draft"}</span>
                </button>

                <button
                  onClick={() => handleSaveModules(true)}
                  disabled={isSaving || isSubmitting}
                  className="btn-accent"
                  style={{
                    padding: '0.7rem 1.5rem',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
                  }}
                >
                  <Send size={16} />
                  <span>{isSubmitting ? "Submitting..." : "Submit to HOD for Review"}</span>
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="pro-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <p>Select your assigned subject to view and customize its modules.</p>
        </div>
      )}

      {/* Version History & Board of Studies Audit Log Modal */}
      {showVersionHistory && activeCourse && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1.5rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            width: '100%',
            maxWidth: '750px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid var(--border-medium)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <History size={20} color="#1e40af" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                    Syllabus Version Control & Changelog
                  </h3>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {activeCourse.code} • {activeCourse.title}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowVersionHistory(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-muted)'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content / Timeline */}
            <div style={{ padding: '1.5rem 1.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Working Draft / Pending Submission Diff */}
              {diffStats.hasChanges && (
                <div style={{
                  background: '#ecfdf5',
                  border: '1.5px solid #6ee7b7',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.15rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: '#059669', color: '#ffffff', fontSize: '0.7rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                        CURRENT WORKING DRAFT
                      </span>
                      <span style={{ fontWeight: 800, color: '#065f46', fontSize: '0.92rem' }}>
                        Proposed Modifications by You
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#047857' }}>
                      Just Now • Not yet approved
                    </span>
                  </div>

                  {/* Summary of diffs */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
                    {diffStats.addedTopics.length > 0 && (
                      <div style={{ color: '#166534' }}>
                        <b>Added Topics ({diffStats.addedTopics.length}):</b>
                        <ul style={{ margin: '0.2rem 0 0 1.25rem', padding: 0 }}>
                          {diffStats.addedTopics.map((a, i) => (
                            <li key={i}>Module {a.module}: <b>{a.topic}</b></li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {diffStats.prunedTopics.length > 0 && (
                      <div style={{ color: '#991b1b', marginTop: '0.25rem' }}>
                        <b>Pruned Topics ({diffStats.prunedTopics.length}):</b>
                        <ul style={{ margin: '0.2rem 0 0 1.25rem', padding: 0 }}>
                          {diffStats.prunedTopics.map((p, i) => (
                            <li key={i} style={{ textDecoration: 'line-through' }}>Module {p.module}: {p.topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {diffStats.modifiedModules.length > 0 && (
                      <div style={{ color: '#1e40af', marginTop: '0.25rem' }}>
                        <b>Module Hour/Title Adjustments:</b>
                        <ul style={{ margin: '0.2rem 0 0 1.25rem', padding: 0 }}>
                          {diffStats.modifiedModules.map((m, i) => (
                            <li key={i}>Module {m.module}: "{m.oldTitle || m.title}" ({m.oldHours || m.hours} hrs) → "{m.newTitle || m.title}" ({m.newHours || m.hours} hrs)</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recorded Versions from course.version_history */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Committed & Approved Historical Versions:
                </div>

                {/* If version_history exists, map it; otherwise show Baseline v1.0 */}
                {(activeCourse.version_history && activeCourse.version_history.length > 0) ? (
                  activeCourse.version_history.map((ver, vIdx) => (
                    <div key={vIdx} style={{
                      background: '#ffffff',
                      border: '1px solid var(--border-medium)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem',
                      borderLeft: '4px solid #1e40af',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.92rem' }}>
                            Version {ver.version}
                          </span>
                          <span style={{ fontSize: '0.7rem', background: '#eff6ff', color: '#1e40af', padding: '0.1rem 0.4rem', borderRadius: '3px', fontWeight: 700 }}>
                            {ver.action === 'approved' ? 'HOD Approved' : 'Baseline'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {ver.timestamp}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.82rem', color: 'var(--text-body)' }}>
                        <div><b>Author:</b> {ver.faculty_author || "Faculty"} • <b>Approved by:</b> {ver.approved_by || "HOD"}</div>
                        {ver.revision_notes && (
                          <div style={{ marginTop: '0.2rem', color: 'var(--text-title)' }}>
                            <i>"{ver.revision_notes}"</i>
                          </div>
                        )}
                        {ver.hod_comments && (
                          <div style={{ marginTop: '0.2rem', color: '#15803d' }}>
                            <b>HOD Remarks:</b> "{ver.hod_comments}"
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1rem 1.25rem',
                    borderLeft: '4px solid #1e40af',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.4rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 800, color: '#1e40af', fontSize: '0.92rem' }}>
                        Version v1.0 (Official Baseline Scheme)
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Batch 2023–2027 Inception
                      </span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-body)', margin: 0 }}>
                      Ratified by Academic Council & Board of Studies under AICTE Model Curriculum guidelines. Initial syllabus baseline with 5 structured modules and outcome-based Bloom taxonomy mapping.
                    </p>
                  </div>
                )}
              </div>

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
                onClick={() => setShowVersionHistory(false)}
                className="btn-primary"
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.84rem' }}
              >
                Close Changelog
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
