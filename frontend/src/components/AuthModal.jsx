import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  UserCheck, 
  GraduationCap, 
  LogIn, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function AuthModal({ isOpen, initialMode = 'signin', onClose, onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'signin' or 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sign in form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Forgot password form state
  const [forgotEmail, setForgotEmail] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(null);

  // Register form state
  const [regData, setRegData] = useState({
    name: '',
    code: '',
    location: '',
    aicte_approval_id: '',
    admin_name: '',
    admin_email: '',
    password: ''
  });

  if (!isOpen) return null;

  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Authentication failed. Check your credentials.");
      }
      onLoginSuccess(data.user, data.university);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    if (e) e.preventDefault();
    if (!forgotEmail.trim()) {
      setError("Please enter your registered institutional email.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "No account found with this email.");
      }
      setVerifiedUser(data.user);
    } catch (err) {
      setError(err.message);
      setVerifiedUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    if (e) e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      setError("Please enter a new password (at least 4 characters).");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail.trim(),
          new_password: newPassword.trim()
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Password reset failed.");
      }
      setForgotSuccess(`Password successfully updated for ${data.user.name}!`);
      setTimeout(() => {
        onLoginSuccess(data.user, data.university);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (!regData.name || !regData.code || !regData.aicte_approval_id || !regData.admin_email || !regData.password) {
      setError("Please fill all required institutional fields.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register-university', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "University registration failed.");
      }
      onLoginSuccess(data.user, data.university);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const quickFillCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 200,
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
          maxWidth: mode === 'signin' ? '540px' : '640px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid var(--border-medium)',
          position: 'relative',
          transition: 'all 0.25s ease'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div style={{
          padding: '1.75rem 2rem 1.25rem 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="brand-pill" style={{ background: '#eff6ff', color: '#1e40af', borderColor: '#bfdbfe' }}>
                AICTE Academic Auth
              </span>
            </div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-title)', letterSpacing: '-0.01em' }}>
              {mode === 'signin' ? 'Sign In to Academic Workspace' : mode === 'forgot' ? 'Reset Security Password' : 'Register AICTE Approved University'}
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              {mode === 'signin' 
                ? 'Access role-governed curriculum drafting, review, and OBE audit.'
                : mode === 'forgot'
                ? 'Verify your institutional identity to set a new password and recover access.'
                : 'Onboard your institution, register your Dean/Admin, and manage schemes.'}
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '999px',
              padding: '0.45rem',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          background: '#f8fafc',
          padding: '0.35rem 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          gap: '1rem',
          overflowX: 'auto'
        }}>
          <button 
            type="button"
            onClick={() => { setMode('signin'); setError(null); setForgotSuccess(null); }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.6rem 0',
              fontWeight: mode === 'signin' ? 800 : 600,
              color: mode === 'signin' ? 'var(--aicte-blue)' : 'var(--text-muted)',
              borderBottom: mode === 'signin' ? '2px solid var(--aicte-blue)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.88rem',
              whiteSpace: 'nowrap'
            }}
          >
            Sign In Existing Staff
          </button>
          <button 
            type="button"
            onClick={() => { setMode('forgot'); setError(null); setForgotSuccess(null); }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.6rem 0',
              fontWeight: mode === 'forgot' ? 800 : 600,
              color: mode === 'forgot' ? 'var(--aicte-blue)' : 'var(--text-muted)',
              borderBottom: mode === 'forgot' ? '2px solid var(--aicte-blue)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.88rem',
              whiteSpace: 'nowrap'
            }}
          >
            Forgot Password?
          </button>
          <button 
            type="button"
            onClick={() => { setMode('register'); setError(null); setForgotSuccess(null); }}
            style={{
              background: 'none',
              border: 'none',
              padding: '0.6rem 0',
              fontWeight: mode === 'register' ? 800 : 600,
              color: mode === 'register' ? 'var(--aicte-blue)' : 'var(--text-muted)',
              borderBottom: mode === 'register' ? '2px solid var(--aicte-blue)' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '0.88rem',
              whiteSpace: 'nowrap'
            }}
          >
            Register New Institution
          </button>
        </div>

        {/* Body Form */}
        <div style={{ padding: '1.75rem 2rem' }}>
          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              marginBottom: '1.25rem'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.35rem' }}>
                  Institutional Email Address
                </label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. dean.socse@presidencyuniversity.in"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)' }}>
                    Password
                  </label>
                  <button 
                    type="button"
                    onClick={() => { setMode('forgot'); setForgotEmail(email); setError(null); }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--aicte-blue)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-medium)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  marginTop: '0.5rem',
                  fontSize: '0.92rem'
                }}
              >
                <LogIn size={16} />
                <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              </button>

              {/* Demo Credentials Quick-Access */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.65rem' }}>
                  Quick 1-Click Demo Accounts:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => quickFillCredentials('dean.socse@presidencyuniversity.in', 'admin123')}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-medium)',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#0f2744' }}>🎓 Dean (University Admin)</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Dr. Ramesh Sharma</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFillCredentials('hod.cse@presidencyuniversity.in', 'hod123')}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-medium)',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#d97706' }}>🏛️ HOD (CSE Reviewer)</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Dr. Suresh Babu</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFillCredentials('faculty.daa@presidencyuniversity.in', 'faculty123')}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-medium)',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#1e40af' }}>👨‍🏫 Faculty (DAA - CSE2007)</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Prof. Rajesh Kumar</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => quickFillCredentials('faculty.ds@presidencyuniversity.in', 'faculty123')}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid var(--border-medium)',
                      padding: '0.6rem 0.75rem',
                      borderRadius: 'var(--radius-md)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '0.78rem'
                    }}
                  >
                    <div style={{ fontWeight: 800, color: '#059669' }}>👩‍🏫 Faculty (DS - CSE2001)</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Dr. Meenakshi Sundaram</div>
                  </button>
                </div>
              </div>
            </form>
          ) : mode === 'forgot' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {forgotSuccess && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  color: '#15803d',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem'
                }}>
                  <ShieldCheck size={18} />
                  <span>{forgotSuccess} Redirecting to workspace...</span>
                </div>
              )}

              {!verifiedUser ? (
                /* Step 1: Email verification */
                <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Enter your registered university email to locate your account and reset your security credentials.
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.35rem' }}>
                      Registered Institutional Email
                    </label>
                    <input 
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. faculty.daa@presidencyuniversity.in"
                      required
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-medium)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.75rem',
                      fontSize: '0.92rem'
                    }}
                  >
                    <span>{loading ? 'Verifying Account...' : 'Verify Institutional Account →'}</span>
                  </button>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setError(null); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              ) : (
                /* Step 2: New password entry */
                <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div style={{
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>
                        Account Verified
                      </div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f2744' }}>
                        {verifiedUser.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        {verifiedUser.designation} • {verifiedUser.email}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVerifiedUser(null)}
                      style={{
                        background: '#ffffff',
                        border: '1px solid #bfdbfe',
                        padding: '0.25rem 0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: '#1e40af',
                        cursor: 'pointer'
                      }}
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.35rem' }}>
                      New Password
                    </label>
                    <input 
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter at least 4 characters"
                      required
                      minLength={4}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-medium)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.35rem' }}>
                      Confirm New Password
                    </label>
                    <input 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your new password"
                      required
                      minLength={4}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-medium)',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={loading || !!forgotSuccess}
                    className="btn-accent"
                    style={{
                      width: '100%',
                      justifyContent: 'center',
                      padding: '0.75rem',
                      fontSize: '0.92rem'
                    }}
                  >
                    <ShieldCheck size={16} />
                    <span>{loading ? 'Updating Password...' : 'Save New Password & Sign In'}</span>
                  </button>

                  <div style={{ textAlign: 'center' }}>
                    <button
                      type="button"
                      onClick={() => { setMode('signin'); setVerifiedUser(null); setError(null); }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      ← Cancel and Return to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    University / College Name *
                  </label>
                  <input 
                    type="text"
                    value={regData.name}
                    onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                    placeholder="e.g. Presidency University"
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Institutional Code *
                  </label>
                  <input 
                    type="text"
                    value={regData.code}
                    onChange={(e) => setRegData({ ...regData, code: e.target.value })}
                    placeholder="e.g. PU-SOCSE-2023"
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Campus Location (City, State)
                  </label>
                  <input 
                    type="text"
                    value={regData.location}
                    onChange={(e) => setRegData({ ...regData, location: e.target.value })}
                    placeholder="e.g. Bengaluru, Karnataka"
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    AICTE Approval Reference ID *
                  </label>
                  <input 
                    type="text"
                    value={regData.aicte_approval_id}
                    onChange={(e) => setRegData({ ...regData, aicte_approval_id: e.target.value })}
                    placeholder="e.g. PU/AC-21.5/SoCSE2/2023"
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Dean / Admin Full Name *
                  </label>
                  <input 
                    type="text"
                    value={regData.admin_name}
                    onChange={(e) => setRegData({ ...regData, admin_name: e.target.value })}
                    placeholder="e.g. Dr. Ramesh Sharma"
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                    Admin Institutional Email *
                  </label>
                  <input 
                    type="email"
                    value={regData.admin_email}
                    onChange={(e) => setRegData({ ...regData, admin_email: e.target.value })}
                    placeholder="e.g. dean.socse@presidencyuniversity.in"
                    required
                    style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-title)', marginBottom: '0.3rem' }}>
                  Admin Master Password *
                </label>
                <input 
                  type="password"
                  value={regData.password}
                  onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                  placeholder="Create a strong institutional password"
                  required
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-medium)', fontSize: '0.85rem' }}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="btn-accent"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '0.75rem',
                  marginTop: '0.5rem',
                  fontSize: '0.92rem'
                }}
              >
                <Building2 size={16} />
                <span>{loading ? 'Registering University...' : 'Register University & Create Dean Account'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
