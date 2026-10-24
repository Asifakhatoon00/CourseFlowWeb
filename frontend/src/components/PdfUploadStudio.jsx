import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Building2, 
  RefreshCw, 
  FileCheck2, 
  Sparkles, 
  Layers,
  Calendar,
  ShieldCheck,
  Plus
} from 'lucide-react';

export default function PdfUploadStudio({ 
  currentRole, 
  setCurrentRole, 
  onCurriculumExtracted, 
  activeUniversity, 
  onSaveCurriculum,
  availableBatches = [],
  activeBatch = '2024-2028',
  onSwitchPersona,
  onOpenAuth
}) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [extractionResult, setExtractionResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Multi-batch cohort state
  const [selectedBatch, setSelectedBatch] = useState('2024-2028');
  const [isCustomBatch, setIsCustomBatch] = useState(false);
  const [customBatchInput, setCustomBatchInput] = useState('');
  
  const fileInputRef = useRef(null);

  const processingSteps = [
    "Reading PDF layout and raw document tables...",
    "Locating Semester 1 to Semester 8 Scheme of Instruction tables...",
    "Extracting exact Course Codes, Course Names, L-T-P-C credits, and Baskets...",
    "Parsing detailed Course Catalogue pages (Module 1 to 5 topics & contact hours)...",
    "Mapping Course Outcomes (COs) and tagging Bloom's Taxonomy cognitive levels...",
    "Running AI Semantic Content-Based Symmetry against AICTE Model..."
  ];

  if (currentRole !== 'university_admin') {
    return (
      <div className="pro-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', maxWidth: '720px', margin: '2rem auto' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          color: '#ef4444'
        }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.75rem' }}>
          University Admin Privileges Required
        </h2>
        <p style={{ color: 'var(--text-body)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Under AICTE guidelines, only registered <b>University Administrators / Academic Deans</b> are authorized to upload institutional syllabus PDFs and modify curriculum records. Faculty and students have review and audit access.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary"
            onClick={() => onSwitchPersona && onSwitchPersona('dean.socse@presidencyuniversity.in')}
          >
            <Building2 size={18} />
            <span>Switch to Dean / Admin Persona (1-Click)</span>
          </button>
          <button 
            className="btn-secondary"
            onClick={() => onOpenAuth && onOpenAuth('signin')}
          >
            <span>Sign In with Admin Credentials</span>
          </button>
        </div>
      </div>
    );
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.pdf')) {
        setFile(droppedFile);
        setErrorMsg(null);
      } else {
        setErrorMsg("Please upload a valid PDF document (.pdf format).");
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMsg(null);
    }
  };

  const getEffectiveBatch = () => {
    if (isCustomBatch && customBatchInput.trim()) {
      return customBatchInput.trim();
    }
    return selectedBatch;
  };

  const runExtraction = async (selectedFile) => {
    const uploadFile = selectedFile || file;
    if (!uploadFile) {
      setErrorMsg("Please select or drop a syllabus PDF first.");
      return;
    }

    const effectiveBatch = getEffectiveBatch();

    setIsProcessing(true);
    setErrorMsg(null);
    setExtractionResult(null);
    setSaveSuccess(false);

    for (let i = 0; i < processingSteps.length - 1; i++) {
      setCurrentStep(i);
      await new Promise(r => setTimeout(r, 600));
    }

    try {
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("current_role", currentRole);
      formData.append("university_name", activeUniversity?.name || "Presidency University");
      formData.append("batch", effectiveBatch);
      if (activeUniversity?.id) {
        formData.append("university_id", activeUniversity.id);
      }

      const res = await fetch("/api/curriculum/upload-pdf", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Extraction failed");
      }

      const data = await res.json();
      setCurrentStep(processingSteps.length - 1);
      await new Promise(r => setTimeout(r, 300));

      setExtractionResult(data);
      if (onCurriculumExtracted) {
        onCurriculumExtracted(data.curriculum, data.gap_analysis, data.batches);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Failed to process syllabus PDF.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToInstitute = () => {
    if (extractionResult && onSaveCurriculum) {
      onSaveCurriculum(extractionResult.curriculum);
      setSaveSuccess(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Info */}
      <div className="pro-card" style={{ padding: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem', borderLeft: '5px solid #0f2744' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
            <span className="brand-pill" style={{ background: '#dcfce7', color: '#15803d', borderColor: '#bbf7d0' }}>
              Authorized Admin Portal
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Active University: <b>{activeUniversity?.name || 'Presidency University'}</b>
            </span>
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.02em' }}>
            Curriculum Ingestion & Automated PDF Segregation Studio
          </h2>
          <p style={{ color: 'var(--text-body)', fontSize: '0.9rem', maxWidth: '820px', marginTop: '0.35rem' }}>
            Upload your university's official curriculum PDF. The AI parser locates the <b>Semester 1 to 8 scheme tables</b>, extracts <b>Course Codes, Titles, L-T-P-C patterns</b>, and connects each course to its detailed <b>Module 1 to 5 syllabus</b>.
          </p>
        </div>
      </div>

      {/* Target Academic Cohort / Batch Configuration */}
      {!extractionResult && (
        <div className="pro-card" style={{ padding: '1.75rem 2rem', background: '#ffffff', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Calendar size={18} color="#0f2744" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-title)' }}>
                  Target Academic Cohort / Batch
                </h3>
                <span className="brand-pill" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
                  Multi-Batch System
                </span>
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', margin: 0 }}>
                Select which graduation cohort this syllabus belongs to. Uploading will <b>NOT overwrite</b> existing batches.
              </p>
            </div>

            {/* Currently stored batches summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f8fafc', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
              <ShieldCheck size={15} color="#059669" />
              <span style={{ color: 'var(--text-muted)' }}>Currently Stored:</span>
              <span style={{ fontWeight: 700, color: '#0f2744' }}>
                {(availableBatches && availableBatches.length > 0)
                  ? availableBatches.map(b => b.batch).join(', ')
                  : '2023-2027, 2024-2028, 2025-2029'}
              </span>
            </div>
          </div>

          {/* Cohort Chips */}
          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {['2023-2027', '2024-2028', '2025-2029', '2026-2030'].map(b => {
              const isSelected = !isCustomBatch && selectedBatch === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setSelectedBatch(b);
                    setIsCustomBatch(false);
                  }}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    background: isSelected ? '#0f2744' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#334155',
                    border: isSelected ? '2px solid #0f2744' : '1px solid #cbd5e1',
                    boxShadow: isSelected ? '0 3px 8px rgba(15, 39, 68, 0.2)' : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  {isSelected && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></span>}
                  <span>Batch {b}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setIsCustomBatch(true)}
              style={{
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.88rem',
                fontWeight: isCustomBatch ? 800 : 600,
                cursor: 'pointer',
                background: isCustomBatch ? '#0f2744' : '#f8fafc',
                color: isCustomBatch ? '#ffffff' : '#334155',
                border: isCustomBatch ? '2px solid #0f2744' : '1px solid #cbd5e1',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <Plus size={14} />
              <span>Custom Cohort</span>
            </button>
          </div>

          {isCustomBatch && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem', background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px dashed #cbd5e1' }}>
              <label htmlFor="custom-batch-input" style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f2744' }}>
                Enter Custom Cohort Range:
              </label>
              <input
                id="custom-batch-input"
                type="text"
                placeholder="e.g. 2026-2030 or 2027-2031"
                value={customBatchInput}
                onChange={(e) => setCustomBatchInput(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid #94a3b8',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  outline: 'none',
                  width: '220px'
                }}
              />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Will create a distinct institutional batch entry.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Upload Box */}
      {!extractionResult && (
        <div 
          className={`dropzone ${isDragging ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            style={{ display: 'none' }}
          />

          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#eff6ff',
            border: '2px solid #bfdbfe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            color: '#1e40af'
          }}>
            <UploadCloud size={34} />
          </div>

          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.4rem' }}>
            {file ? file.name : `Drag & Drop syllabus PDF for Batch ${getEffectiveBatch()}`}
          </h3>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto 1.5rem' }}>
            Supports multi-page official university curricula, autonomous college regulation books (e.g. Presidency Univ, VTU, Anna Univ), and departmental syllabi.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <button 
              type="button"
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                if (file) runExtraction();
                else fileInputRef.current?.click();
              }}
              disabled={isProcessing}
            >
              {file ? `Begin AI Extraction for Batch ${getEffectiveBatch()}` : "Browse PDF Files from Computer"}
            </button>
          </div>

          {errorMsg && (
            <div style={{ marginTop: '1.25rem', color: '#b91c1c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      )}

      {/* Animated Extraction Progress State */}
      {isProcessing && (
        <div className="pro-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <div className="spinner" style={{ width: '44px', height: '44px', border: '3px solid #cbd5e1', borderTopColor: '#0f2744', borderRadius: '50%', margin: '0 auto 1.5rem' }}></div>
          
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-title)', marginBottom: '0.5rem' }}>
            Segregating Curriculum from PDF...
          </h3>
          <p style={{ color: '#d97706', fontSize: '0.92rem', fontWeight: 700, marginBottom: '2rem' }}>
            {processingSteps[currentStep]}
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {processingSteps.map((step, idx) => (
              <div key={idx} style={{
                fontSize: '0.76rem',
                color: idx <= currentStep ? '#0f2744' : '#94a3b8',
                background: idx <= currentStep ? '#eff6ff' : '#f8fafc',
                border: idx === currentStep ? '1px solid #1e40af' : '1px solid #e2e8f0',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: idx <= currentStep ? 700 : 500
              }}>
                <span>{idx + 1}. {step.split(' ')[0]} {step.split(' ')[1]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Staging & Verification View */}
      {extractionResult && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          
          <div className="pro-card" style={{
            padding: '1.75rem 2rem',
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderLeft: '5px solid #059669',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#15803d', fontWeight: 800 }}>
                  <CheckCircle2 size={20} />
                  Curriculum PDF Segregation Successful!
                </span>
                <span className="brand-pill" style={{ background: '#fef3c7', color: '#b45309', borderColor: '#fde68a', fontWeight: 700 }}>
                  Cohort: Batch {extractionResult.curriculum.batch || getEffectiveBatch()}
                </span>
                <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, background: '#dcfce7', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                  ✓ Existing Batches Preserved
                </span>
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-title)' }}>
                {extractionResult.curriculum.title}
              </h3>
              <p style={{ color: 'var(--text-body)', fontSize: '0.86rem', marginTop: '0.25rem' }}>
                Extracted {extractionResult.curriculum.semesters?.length} Semesters • {extractionResult.curriculum.total_credits} Total Credits with L-T-P-C Breakdown • Attached to Batch {extractionResult.curriculum.batch || getEffectiveBatch()}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button 
                className="btn-secondary"
                onClick={() => {
                  setExtractionResult(null);
                  setFile(null);
                }}
              >
                <RefreshCw size={15} />
                <span>Upload Another PDF</span>
              </button>

              <button 
                className="btn-primary"
                onClick={handleSaveToInstitute}
                disabled={saveSuccess}
                style={{ background: saveSuccess ? '#059669' : undefined }}
              >
                <FileCheck2 size={16} />
                <span>{saveSuccess ? 'Published to Repository!' : 'Confirm & Save Curriculum'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid-cols-4">
            <div className="metric-card" style={{ borderLeftColor: '#059669' }}>
              <div className="metric-label">AICTE Model Compliance</div>
              <div className="metric-value" style={{ color: '#059669' }}>
                {extractionResult.gap_analysis?.compliance_score}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Topical content-based symmetry
              </div>
            </div>

            <div className="metric-card" style={{ borderLeftColor: '#d97706' }}>
              <div className="metric-label">Autonomy Delta</div>
              <div className="metric-value" style={{ color: '#d97706' }}>
                {extractionResult.gap_analysis?.autonomy_delta_percent}%
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Permitted autonomy limit: 20%
              </div>
            </div>

            <div className="metric-card" style={{ borderLeftColor: '#1e40af' }}>
              <div className="metric-label">Extracted Courses</div>
              <div className="metric-value" style={{ color: '#1e40af' }}>
                {sumCourses(extractionResult.curriculum)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                With L-T-P-C and Module Syllabi
              </div>
            </div>

            <div className="metric-card" style={{ borderLeftColor: '#7c3aed' }}>
              <div className="metric-label">Course Outcomes (COs)</div>
              <div className="metric-value" style={{ color: '#7c3aed' }}>
                {sumCOs(extractionResult.curriculum)}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                OBE Bloom's Tagged
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}

function sumCourses(curriculum) {
  if (!curriculum?.semesters) return 0;
  return curriculum.semesters.reduce((acc, s) => acc + (s.courses?.length || 0), 0);
}

function sumCOs(curriculum) {
  if (!curriculum?.semesters) return 0;
  let count = 0;
  for (const s of curriculum.semesters) {
    for (const c of (s.courses || [])) {
      count += c.course_outcomes?.length || 0;
    }
  }
  return count;
}
