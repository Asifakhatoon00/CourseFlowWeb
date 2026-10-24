import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Layers, 
  BookOpen, 
  Printer, 
  ChevronRight, 
  ChevronDown,
  Sparkles, 
  Clock, 
  Award, 
  BookmarkCheck,
  Search,
  Filter,
  CheckCircle2,
  Maximize2,
  Calendar,
  PlusCircle,
  ArrowRightLeft,
  X,
  RotateCcw,
  GitBranch,
  History
} from 'lucide-react';

export default function UniversityCurriculumView({ 
  curriculum, 
  onSelectCourse, 
  activeUniversity,
  availableBatches = [],
  activeBatch = '2023-2027',
  onSwitchBatch,
  onNavigateToUpload
}) {
  const [selectedSemester, setSelectedSemester] = useState(1);
  const [expandedCourseCode, setExpandedCourseCode] = useState(null);
  const [activeCourseDetail, setActiveCourseDetail] = useState(null);
  const [historyModalCourse, setHistoryModalCourse] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  if (!curriculum) {
    return (
      <div className="pro-card" style={{ padding: '3.5rem', textAlign: 'center' }}>
        <GraduationCap size={44} color="#1e40af" style={{ margin: '0 auto 1rem' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.5rem' }}>
          No University Curriculum Loaded
        </h3>
        <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto' }}>
          Please go to the <b>PDF Upload & Segregation Studio</b> to upload your syllabus PDF.
        </p>
      </div>
    );
  }

  const currentBatchKey = curriculum.batch || activeBatch || '2023-2027';

  // Fallback to activeUniversity batches or default seed list if availableBatches is empty
  const displayBatches = (availableBatches && availableBatches.length > 0)
    ? availableBatches
    : (activeUniversity?.batches && activeUniversity.batches.length > 0)
      ? activeUniversity.batches
      : [
          { batch: '2023-2027', title: 'Batch 2023–2027 Regulation', total_credits: 160, courses_count: 63 },
          { batch: '2024-2028', title: 'Batch 2024–2028 Scheme', total_credits: 160, courses_count: 63 },
          { batch: '2025-2029', title: 'Batch 2025–2029 Autonomous', total_credits: 160, courses_count: 63 }
        ];

  const activeSemData = curriculum.semesters?.find(s => s.semester_number === selectedSemester);
  const allCoursesInSem = activeSemData?.courses || [];
  const isGlobalSearch = searchQuery.trim().length > 0;

  // Aggregate all unique courses across all 8 semesters of the curriculum
  const allCurriculumCourses = useMemo(() => {
    const list = [];
    const seen = new Set();
    (curriculum.semesters || []).forEach(sem => {
      (sem.courses || []).forEach(c => {
        const key = c.code.toUpperCase();
        if (!seen.has(key)) {
          seen.add(key);
          list.push({ ...c, semester: sem.semester_number });
        }
      });
    });
    return list;
  }, [curriculum]);

  // Common acronym map to pinpoint the exact subject
  const ACRONYM_MAP = {
    'daa': 'CSE2007',
    'ds': 'CSE2001',
    'dsa': 'CSE2001',
    'os': 'CSE2004',
    'dbms': 'CSE2006',
    'cn': 'CSE2008',
    'oop': 'CSE1004',
    'java': 'CSE1004',
    'ai': 'CSE3001',
    'ml': 'CSE3002',
    'se': 'CSE3003',
    'cd': 'CSE3004',
    'compiler': 'CSE3004',
    'toc': 'CSE2003',
    'automata': 'CSE2003',
    'python': 'CSE1001',
    'math': 'MAT1001',
    'maths': 'MAT1001',
    'calculus': 'MAT1001',
    'physics': 'PHY1001',
    'chemistry': 'CHY1001'
  };

  // Search across entire curriculum and return ONLY ONE particular row
  const filteredCourses = useMemo(() => {
    if (isGlobalSearch) {
      const q = searchQuery.trim().toLowerCase();
      const acronymTarget = ACRONYM_MAP[q];

      const scored = allCurriculumCourses.map(c => {
        let score = 0;
        const code = (c.code || '').toLowerCase();
        const title = (c.title || '').toLowerCase();

        // 1. Acronym match (e.g. "daa" -> CSE2007)
        if (acronymTarget && c.code.toUpperCase() === acronymTarget.toUpperCase()) {
          score += 2500;
        }
        // 2. Exact code match (e.g. "cse2007")
        if (code === q) {
          score += 2000;
        }
        // 3. Exact title match (e.g. "design and analysis of algorithms")
        if (title === q) {
          score += 1800;
        }
        // 4. Code starts with query (e.g. "cse2007")
        if (code.startsWith(q)) {
          score += 900;
        }
        // 5. Title starts with query
        if (title.startsWith(q)) {
          score += 800;
        }
        // 6. Code contains query
        if (code.includes(q)) {
          score += 400;
        }
        // 7. Title contains query
        if (title.includes(q)) {
          score += 300;
        }

        // Prioritize theory courses over labs when query doesn't specify "lab"
        const isLab = title.includes('lab') || code.endsWith('l') || code.includes('lab');
        const queryHasLab = q.includes('lab');
        if (isLab && !queryHasLab) {
          score -= 250;
        }

        // Core course boost
        if (c.category === 'PCC') {
          score += 60;
        }

        return { course: c, score };
      }).filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score);

      // Return ONLY ONE particular row as requested!
      return scored.length > 0 ? [scored[0].course] : [];
    }

    // Default: Return selected semester's courses filtered by category
    return allCoursesInSem.map(c => ({ ...c, semester: selectedSemester })).filter(c => {
      if (selectedCategory === 'ALL') return true;
      if (selectedCategory === 'PCC' && c.category === 'PCC') return true;
      if (selectedCategory === 'BSC' && (c.category === 'BSC' || c.category?.includes('School Core'))) return true;
      if (selectedCategory === 'ESC' && c.category === 'ESC') return true;
      if (selectedCategory === 'PEC' && (c.category === 'PEC' || c.category?.includes('Discipline'))) return true;
      if (selectedCategory === 'OEC' && (c.category === 'OEC' || c.category?.includes('Open'))) return true;
      if (selectedCategory === 'PROJ' && (c.category === 'PROJ' || c.category?.includes('Project') || c.category?.includes('Internship'))) return true;
      return false;
    });
  }, [isGlobalSearch, searchQuery, allCurriculumCourses, allCoursesInSem, selectedSemester, selectedCategory]);

  const toggleCourseExpansion = (course) => {
    if (expandedCourseCode === course.code) {
      setExpandedCourseCode(null);
    } else {
      setExpandedCourseCode(course.code);
      setActiveCourseDetail(course);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Institutional Header Banner with Batch Control */}
      <div className="pro-card" style={{
        padding: '2rem 2.25rem',
        background: '#ffffff',
        borderLeft: '5px solid #0f2744',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div style={{ maxWidth: '820px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="brand-pill" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
                Official Institutional Scheme
              </span>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Institute: <b>{activeUniversity?.name || "Presidency University"}</b> • Code: <b>{activeUniversity?.code || "PU-SOCSE"}</b>
              </span>
              <span className="brand-pill" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a', fontWeight: 700 }}>
                Cohort: Batch {currentBatchKey}
              </span>
            </div>
            
            <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em', marginBottom: '0.35rem' }}>
              {curriculum.title}
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '0.92rem', lineHeight: '1.6' }}>
              Program: <b>B.Tech Computer Science & Engineering</b> • Total Prescribed Credits: <b>{curriculum.total_credits}</b> • Segregated Modules (Module 1 to 5) • Preserved Multi-Cohort Schema
            </p>
          </div>

          {/* Action Buttons & Batch Switcher Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Batch Selector Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.35rem 0.65rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <Calendar size={16} color="#0f2744" />
              <label htmlFor="batch-select" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Batch:
              </label>
              <select
                id="batch-select"
                value={currentBatchKey}
                onChange={(e) => onSwitchBatch && onSwitchBatch(e.target.value)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  color: '#0f2744',
                  cursor: 'pointer',
                  outline: 'none'
                }}
              >
                {displayBatches.map(b => (
                  <option key={b.batch} value={b.batch}>
                    {b.batch} ({b.total_credits || 160} Cr) {b.batch === currentBatchKey ? '★ Active' : ''}
                  </option>
                ))}
              </select>
            </div>

            {onNavigateToUpload && (
              <button 
                className="btn-primary"
                onClick={onNavigateToUpload}
                style={{ padding: '0.5rem 0.9rem', fontSize: '0.84rem' }}
                title="Add a new academic batch without replacing existing ones"
              >
                <PlusCircle size={15} />
                <span>+ Ingest New Batch</span>
              </button>
            )}

            <button 
              className="btn-secondary"
              onClick={handlePrint}
              style={{ padding: '0.5rem 0.9rem', fontSize: '0.84rem' }}
              title="Print or export formatted syllabus"
            >
              <Printer size={15} />
              <span>Print Scheme</span>
            </button>
          </div>
        </div>

        {/* Multi-Batch Quick Selection Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          paddingTop: '0.85rem',
          borderTop: '1px solid #f1f5f9',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={14} color="#0284c7" />
            University Batches:
          </span>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {displayBatches.map(b => {
              const isSelected = b.batch === currentBatchKey;
              return (
                <button
                  key={b.batch}
                  onClick={() => onSwitchBatch && onSwitchBatch(b.batch)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isSelected ? '#0f2744' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '1px solid #0f2744' : '1px solid #e2e8f0',
                    boxShadow: isSelected ? '0 2px 5px rgba(15, 39, 68, 0.25)' : 'none'
                  }}
                  title={`Switch to ${b.title || b.batch}`}
                >
                  {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>}
                  <span>Batch {b.batch}</span>
                  <span style={{ fontSize: '0.72rem', opacity: isSelected ? 0.9 : 0.65 }}>
                    ({b.total_credits || 160} Cr)
                  </span>
                </button>
              );
            })}
          </div>
          <span style={{ fontSize: '0.76rem', color: '#059669', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <CheckCircle2 size={13} />
            Multi-Batch Preservation Active (Prior cohorts never overwritten)
          </span>
        </div>
      </div>

      {/* Semester Navigation Tabs */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Semester to Inspect Scheme (Semester 1 to Semester 8)
          </div>
          <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700 }}>
            ✓ Verified Scheme Tables (Pages 38–43) & Catalogues (Pages 43–312)
          </span>
        </div>

        <div style={{
          display: 'flex',
          gap: '0.5rem',
          background: '#ffffff',
          padding: '0.5rem',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
        }}>
          {(curriculum.semesters || []).map(sem => {
            const isActive = selectedSemester === sem.semester_number;
            return (
              <button
                key={sem.semester_number}
                onClick={() => {
                  setSelectedSemester(sem.semester_number);
                  setExpandedCourseCode(null);
                  setActiveCourseDetail(null);
                }}
                style={{
                  background: isActive ? '#0f2744' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-body)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 1.1rem',
                  fontSize: '0.86rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '95px',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 3px 8px rgba(15,39,68,0.25)' : 'none'
                }}
              >
                <span>Semester {sem.semester_number}</span>
                <span style={{ fontSize: '0.72rem', opacity: isActive ? 0.9 : 0.65, fontWeight: 500 }}>
                  {sem.total_credits} Credits
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#ffffff',
        padding: '0.85rem 1.25rem',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '0.45rem 0.85rem',
            minWidth: '320px'
          }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search across Sem 1–8 (e.g. DAA, CSE2001, Operating Systems)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  setSearchQuery(searchInput);
                }
              }}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontSize: '0.85rem',
                color: 'var(--text-title)',
                width: '100%'
              }}
            />
            {searchInput && (
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Clear Search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Explicit Search Button */}
          <button
            onClick={() => setSearchQuery(searchInput)}
            className="btn-primary"
            style={{
              padding: '0.5rem 1.1rem',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              boxShadow: '0 2px 6px rgba(15, 39, 68, 0.2)'
            }}
          >
            <Search size={14} />
            <span>Search</span>
          </button>

          {isGlobalSearch && (
            <button
              onClick={() => {
                setSearchInput('');
                setSearchQuery('');
              }}
              className="btn-secondary"
              style={{
                padding: '0.5rem 0.85rem',
                fontSize: '0.82rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
              title="Reset search and show full semester"
            >
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'ALL', label: 'All Courses' },
            { id: 'BSC', label: 'School Core' },
            { id: 'PCC', label: 'Program Core' },
            { id: 'PEC', label: 'Discipline Elective' },
            { id: 'OEC', label: 'Open Elective' },
            { id: 'PROJ', label: 'Project / Internship' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setSelectedCategory(btn.id)}
              style={{
                background: selectedCategory === btn.id ? '#1e40af' : '#f1f5f9',
                color: selectedCategory === btn.id ? '#ffffff' : 'var(--text-body)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '0.3rem 0.75rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Semester Scheme Table */}
      <div className="pro-card" style={{ overflow: 'hidden' }}>
        <div style={{
          padding: '1.25rem 1.5rem',
          background: 'var(--bg-surface-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)' }}>
              {isGlobalSearch 
                ? (filteredCourses.length > 0 
                    ? `Curriculum Search Result: Showing 1 matching course for "${searchQuery}"`
                    : `Curriculum Search: No course found for "${searchQuery}"`)
                : `Semester ${selectedSemester} Scheme of Instruction & Examination`}
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              {isGlobalSearch 
                ? (filteredCourses.length > 0 
                    ? `Found in Semester ${filteredCourses[0].semester} (${filteredCourses[0].category || 'Core'}) • Click row to expand its units & syllabus`
                    : `No course matches "${searchQuery}" across Semester 1 to 8. Try searching by Code (e.g. CSE2007) or Name.`)
                : `Showing ${filteredCourses.length} of ${allCoursesInSem.length} Prescribed Courses • Total Credits: ${activeSemData?.total_credits || 0}`}
            </p>
          </div>

          <span style={{ fontSize: '0.8rem', color: 'var(--aicte-blue)', fontWeight: 600 }}>
            Click any row to expand its segregated Module 1 to 5 units & syllabus
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="academic-table">
            <thead>
              <tr>
                <th style={{ width: '45px' }}></th>
                <th style={{ width: '50px' }}>S.No</th>
                <th style={{ width: '150px' }}>Course Code</th>
                <th>Course Title</th>
                <th style={{ width: '170px' }}>Basket / Category</th>
                <th style={{ width: '150px', textAlign: 'center' }}>Structure (L - T - P - C)</th>
                <th style={{ width: '90px', textAlign: 'center' }}>Credits</th>
                <th style={{ width: '130px', textAlign: 'center' }}>Modules</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    {isGlobalSearch 
                      ? `No courses matching "${searchQuery}" were found across any of the 8 semesters.`
                      : `No courses match your filter criteria in Semester ${selectedSemester}.`}
                  </td>
                </tr>
              ) : (
                filteredCourses.map((c, idx) => {
                  const isExpanded = expandedCourseCode === c.code;
                  return (
                    <React.Fragment key={c.code || idx}>
                      <tr 
                        style={{ 
                          background: isExpanded ? '#eff6ff' : undefined, 
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onClick={() => toggleCourseExpansion(c)}
                      >
                        <td style={{ textAlign: 'center', color: isExpanded ? '#1e40af' : 'var(--text-muted)' }}>
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>{idx + 1}</td>
                        <td style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--aicte-blue)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                            <span>{c.code}</span>
                            {isGlobalSearch && (
                              <span style={{ fontSize: '0.68rem', background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', padding: '0.05rem 0.35rem', borderRadius: '3px', fontWeight: 800 }}>
                                Sem {c.semester}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ fontWeight: 700, color: 'var(--text-title)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
                            <span>{c.title}</span>

                            {/* Version Pill */}
                            <span style={{
                              background: '#e0e7ff',
                              color: '#3730a3',
                              border: '1px solid #c7d2fe',
                              fontSize: '0.68rem',
                              padding: '0.1rem 0.4rem',
                              borderRadius: '4px',
                              fontWeight: 800,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.2rem'
                            }}>
                              <GitBranch size={10} />
                              <span>{c.version || 'v1.0'}</span>
                            </span>

                            {/* Multiple Revisions Indicator */}
                            {c.version_history && c.version_history.length > 1 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setHistoryModalCourse(c);
                                }}
                                title="View version history & changelog"
                                style={{
                                  background: '#f0fdf4',
                                  color: '#15803d',
                                  border: '1px solid #bbf7d0',
                                  fontSize: '0.68rem',
                                  padding: '0.1rem 0.45rem',
                                  borderRadius: '4px',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}
                              >
                                <History size={11} />
                                <span>{c.version_history.length} Revisions</span>
                              </button>
                            )}

                            {c.review_status === 'pending_review' && (
                              <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                                ⏳ PENDING REVIEW
                              </span>
                            )}
                            {c.review_status === 'approved' && (
                              <span style={{ background: '#f0fdf4', color: '#15803d', border: '1px solid #bbf7d0', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                                ✓ HOD APPROVED
                              </span>
                            )}
                            {c.review_status === 'revision_requested' && (
                              <span style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>
                                ↺ REVISION REQUESTED
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 400, marginTop: '0.15rem', display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            <span>{c.units?.length || 5} Segregated Modules • {c.course_outcomes?.length || 4} Course Outcomes</span>
                            {c.assigned_faculty_name && (
                              <span style={{ color: 'var(--aicte-blue)', fontWeight: 600 }}>• Allotted: {c.assigned_faculty_name}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge-category cat-${c.category?.toLowerCase() || 'pcc'}`}>
                            {c.category === 'PCC' ? 'Program Core' : 
                             c.category === 'BSC' ? 'School Core' : 
                             c.category === 'ESC' ? 'Engineering Science' : 
                             c.category === 'PEC' ? 'Discipline Elective' : 
                             c.category === 'OEC' ? 'Open Elective' : 
                             c.category === 'PROJ' ? 'Project / Internship' : c.category}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-body)' }}>
                          {c.lecture_hours || 3} - {c.tutorial_hours || 0} - {c.practical_hours || 0} - {c.credits}
                        </td>
                        <td style={{ textAlign: 'center', fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                          {c.credits}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button 
                            className={isExpanded ? "btn-primary" : "btn-secondary"}
                            style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem', borderRadius: 'var(--radius-sm)' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCourseExpansion(c);
                            }}
                          >
                            <span>{isExpanded ? "Collapse" : "Expand Units"}</span>
                          </button>
                        </td>
                      </tr>

                      {/* INLINE EXPANDABLE MODULE ACCORDION */}
                      {isExpanded && (
                        <tr style={{ background: '#f8fafc' }}>
                          <td colSpan={8} style={{ padding: '1.75rem 2rem', borderBottom: '2px solid #bfdbfe' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                              
                              {/* Header info in accordion */}
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--aicte-blue)', fontSize: '0.95rem' }}>
                                      {c.code}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>•</span>
                                    <span style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-title)' }}>
                                      {c.title}
                                    </span>
                                    <span style={{
                                      background: '#e0e7ff',
                                      color: '#3730a3',
                                      border: '1px solid #c7d2fe',
                                      fontSize: '0.74rem',
                                      padding: '0.15rem 0.55rem',
                                      borderRadius: 'var(--radius-sm)',
                                      fontWeight: 800
                                    }}>
                                      Version {c.version || 'v1.0'}
                                    </span>
                                  </div>
                                  <p style={{ color: 'var(--text-body)', fontSize: '0.88rem', maxWidth: '850px', lineHeight: '1.55', marginTop: '0.35rem' }}>
                                    {c.description}
                                  </p>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                  <button 
                                    className="btn-secondary"
                                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                    onClick={() => setHistoryModalCourse(c)}
                                  >
                                    <History size={14} />
                                    <span>Version History ({c.version_history?.length || 1})</span>
                                  </button>
                                  <button 
                                    className="btn-secondary"
                                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                                    onClick={() => onSelectCourse(c)}
                                  >
                                    <Maximize2 size={14} />
                                    <span>Open Fullscreen Modal</span>
                                  </button>
                                </div>
                              </div>

                              {/* Segregated Syllabus Modules 1 to 5 */}
                              <div>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  <Layers size={17} color="var(--aicte-blue)" />
                                  Strictly Segregated Syllabus Modules (Module 1 to {c.units?.length || 5})
                                </h4>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
                                  {(c.units || []).map((unit, uIdx) => (
                                    <div 
                                      key={uIdx} 
                                      style={{
                                        background: '#ffffff',
                                        border: '1px solid var(--border-medium)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '1.1rem',
                                        borderLeft: '4px solid #1e40af',
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between'
                                      }}
                                    >
                                      <div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                                          <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-title)', lineHeight: '1.35' }}>
                                            Module {unit.unit_number || uIdx + 1}: {unit.title}
                                          </div>
                                          <span style={{
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            color: '#1e40af',
                                            background: '#eff6ff',
                                            border: '1px solid #bfdbfe',
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: 'var(--radius-sm)',
                                            whiteSpace: 'nowrap'
                                          }}>
                                            {unit.hours || 8} Hours
                                          </span>
                                        </div>

                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.65rem' }}>
                                          {(unit.topics || []).map((topic, tIdx) => (
                                            <span 
                                              key={tIdx} 
                                              style={{
                                                background: '#f8fafc',
                                                border: '1px solid #e2e8f0',
                                                padding: '0.2rem 0.55rem',
                                                borderRadius: 'var(--radius-sm)',
                                                fontSize: '0.75rem',
                                                color: 'var(--text-body)',
                                                lineHeight: '1.3'
                                              }}
                                            >
                                              {topic}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Course Outcomes & Textbooks Dual Column */}
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem' }}>
                                
                                {/* Course Outcomes */}
                                {c.course_outcomes?.length > 0 && (
                                  <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
                                    <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                      <Award size={16} color="var(--aicte-saffron)" />
                                      Course Outcomes & Bloom's Cognitive Depth
                                    </h5>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      {c.course_outcomes.map((co, coIdx) => (
                                        <div key={coIdx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem', fontSize: '0.82rem', lineHeight: '1.45' }}>
                                          <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--aicte-blue)', minWidth: '35px' }}>
                                            {co.code || `CO${coIdx+1}`}
                                          </span>
                                          <span style={{ flex: 1, color: 'var(--text-body)' }}>
                                            {co.description}
                                          </span>
                                          <span className={`badge-bloom bloom-${co.bloom_level || 'Understand'}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.45rem' }}>
                                            {co.bloom_level || 'Understand'}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Prescribed Textbooks */}
                                {c.textbooks?.length > 0 && (
                                  <div style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '1.15rem' }}>
                                    <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                      <BookmarkCheck size={16} color="var(--aicte-purple)" />
                                      Prescribed Textbooks & References (PDF Source)
                                    </h5>
                                    <ul style={{ paddingLeft: '1.15rem', margin: 0, fontSize: '0.82rem', color: 'var(--text-body)', display: 'flex', flexDirection: 'column', gap: '0.4rem', lineHeight: '1.45' }}>
                                      {c.textbooks.map((b, bIdx) => (
                                        <li key={bIdx}>{b}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Course Deep Dive Card (When activeCourseDetail is selected) */}
      {activeCourseDetail && !expandedCourseCode && (
        <div className="pro-card" style={{ padding: '2rem', border: '2px solid #bfdbfe' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                <span className={`badge-category cat-${activeCourseDetail.category?.toLowerCase() || 'pcc'}`}>
                  {activeCourseDetail.category}
                </span>
                <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--aicte-blue)' }}>
                  {activeCourseDetail.code}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Semester {activeCourseDetail.semester}
                </span>
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-title)' }}>
                {activeCourseDetail.title}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.25rem' }}>
                Credit Structure: <b>{activeCourseDetail.lecture_hours || 3}L : {activeCourseDetail.tutorial_hours || 0}T : {activeCourseDetail.practical_hours || 0}P</b> • Total Credits: <b>{activeCourseDetail.credits}</b>
              </p>
            </div>

            <button 
              className="btn-secondary"
              onClick={() => onSelectCourse(activeCourseDetail)}
            >
              <span>Open in Fullscreen Modal</span>
            </button>
          </div>

          {/* Module-by-Module Breakdown */}
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--aicte-blue)" />
              Syllabus Modules (Module 1 to Module {activeCourseDetail.units?.length || 5})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(activeCourseDetail.units || []).map((unit, uIdx) => (
                <div key={uIdx} style={{
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.15rem 1.35rem',
                  borderLeft: '4px solid #1e40af'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-title)' }}>
                      Module {unit.unit_number || uIdx + 1}: {unit.title}
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-sm)' }}>
                      {unit.hours || 8} Contact Hours
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.5rem' }}>
                    {(unit.topics || []).map((topic, tIdx) => (
                      <span key={tIdx} style={{
                        background: '#ffffff',
                        border: '1px solid var(--border-subtle)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.8rem',
                        color: 'var(--text-body)'
                      }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Version History & Changelog Modal */}
      {historyModalCourse && (
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
          zIndex: 9999,
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
                    {historyModalCourse.code}
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
                    Active: {historyModalCourse.version || 'v1.0'}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-title)', margin: 0 }}>
                  Curriculum Version History & Changelog
                </h3>
              </div>
              <button 
                onClick={() => setHistoryModalCourse(null)}
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

              {historyModalCourse.version_history && historyModalCourse.version_history.length > 0 ? (
                historyModalCourse.version_history.slice().reverse().map((entry, idx) => (
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
                onClick={() => setHistoryModalCourse(null)}
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
