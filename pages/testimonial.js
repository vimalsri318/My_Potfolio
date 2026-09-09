import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function TestimonialSubmission() {
  const [form, setForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    rating: 5,
    project_name: '',
    linkedin_url: '',
    avatar_url: '',
  })
  const [avatarType, setAvatarType] = useState('auto') // 'auto' | 'upload' | 'url'
  const [detectedLogo, setDetectedLogo] = useState(null)
  const [logoLoading, setLogoLoading] = useState(false)
  const [customDomain, setCustomDomain] = useState('')
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const updateField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

  // Debounced company logo lookup when company name changes
  useEffect(() => {
    const query = customDomain || form.company
    if (!query || query.trim().length < 2) {
      setDetectedLogo(null)
      return
    }

    const timer = setTimeout(async () => {
      setLogoLoading(true)
      try {
        const res = await fetch(`/api/testimonials/company-logo?query=${encodeURIComponent(query.trim())}`)
        const data = await res.json()
        if (data.found && data.logoUrl) {
          setDetectedLogo(data)
          // If avatar not manually set yet, auto-suggest or set it
          if (!form.avatar_url && avatarType === 'auto') {
            updateField('avatar_url', data.logoUrl)
          }
        }
      } catch {
        /* Ignore lookup error */
      } finally {
        setLogoLoading(false)
      }
    }, 450)

    return () => clearTimeout(timer)
  }, [form.company, customDomain, avatarType])

  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/testimonials/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to upload image')
      updateField('avatar_url', data.url)
      setAvatarType('upload')
    } catch (err) {
      setError(String(err.message || err))
    } finally {
      setUploading(false)
    }
  }

  function applyCompanyLogo(url) {
    updateField('avatar_url', url)
    setAvatarType('auto')
  }

  function clearAvatar() {
    updateField('avatar_url', '')
    setDetectedLogo(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!form.name.trim()) {
      setError('Please enter your name.')
      return
    }
    if (!form.content.trim()) {
      setError('Please write a brief testimonial or feedback.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')

      setIsSuccess(true)
    } catch (err) {
      setError(String(err.message || err))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Share Your Feedback — Vimal Srinivasan</title>
        <meta
          name="description"
          content="Share your experience working with Vimal Srinivasan on AI products, engineering, and architecture."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="t-page">
        <header className="t-header">
          <Link href="/" className="t-back">
            ← Back to portfolio
          </Link>
          <div className="t-badge">Client Testimonial</div>
        </header>

        <main className="t-container">
          {isSuccess ? (
            <div className="t-card t-success-card">
              <div className="t-success-icon">
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="3" />
                  <path fill="none" stroke="currentColor" strokeWidth="3" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                </svg>
              </div>
              <h1 className="t-title">Thank you, {form.name}!</h1>
              <p className="t-sub">
                Your testimonial has been safely received. I genuinely appreciate your collaboration and generous words. It will appear on the portfolio once reviewed.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
                <Link href="/" className="t-submit-btn" style={{ textDecoration: 'none', display: 'inline-block', width: 'auto', padding: '14px 28px' }}>
                  Visit Portfolio ↗
                </Link>
                <button
                  type="button"
                  className="t-btn-ghost"
                  onClick={() => {
                    setIsSuccess(false)
                    setForm({
                      name: '',
                      role: '',
                      company: '',
                      content: '',
                      rating: 5,
                      project_name: '',
                      linkedin_url: '',
                      avatar_url: '',
                    })
                    setDetectedLogo(null)
                  }}
                >
                  Submit another note
                </button>
              </div>
            </div>
          ) : (
            <div className="t-card">
              <div className="t-intro">
                <p className="mono" style={{ color: 'var(--ink-soft)', marginBottom: 8, fontSize: '0.8rem' }}>
                  Collaboration & Feedback ⎯ Let&apos;s talk <span style={{ color: 'var(--ink)' }}>↗</span>
                </p>
                <h1 className="t-title">Share Your Experience</h1>
                <p className="t-sub">
                  Working together has been a pleasure. If you have a moment, I&apos;d love to hear your thoughts on our collaboration, communication, and the impact of the AI deliverables.
                </p>
              </div>

              {error && <div className="t-error">{error}</div>}

              <form className="t-form" onSubmit={handleSubmit}>
                {/* Rating selection */}
                <div className="t-field">
                  <label className="t-label">Your Rating</label>
                  <div className="t-stars" role="radiogroup" aria-label="Rating">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const active = (hoverRating || form.rating) >= star
                      return (
                        <button
                          key={star}
                          type="button"
                          className={`t-star-btn ${active ? 'is-active' : ''}`}
                          onClick={() => updateField('rating', star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          aria-label={`${star} star${star > 1 ? 's' : ''}`}
                        >
                          ★
                        </button>
                      )
                    })}
                    <span className="t-rating-text">
                      {form.rating === 5 && '★★★★★ (5/5 Exceptional)'}
                      {form.rating === 4 && '★★★★☆ (4/5 Great)'}
                      {form.rating === 3 && '★★★☆☆ (3/5 Good)'}
                      {form.rating === 2 && '★★☆☆☆ (2/5 Fair)'}
                      {form.rating === 1 && '★☆☆☆☆ (1/5 Needs Work)'}
                    </span>
                  </div>
                </div>

                {/* Testimonial message */}
                <div className="t-field">
                  <label className="t-label" htmlFor="content">
                    Testimonial / Review <span className="t-req">*</span>
                  </label>
                  <textarea
                    id="content"
                    className="t-textarea"
                    rows={5}
                    required
                    placeholder="How was the problem solving, communication, and delivery? What results did the project bring to your team or product?"
                    value={form.content}
                    onChange={(e) => updateField('content', e.target.value)}
                  />
                </div>

                {/* Name & Role Grid */}
                <div className="t-grid">
                  <div className="t-field">
                    <label className="t-label" htmlFor="name">
                      Your Full Name <span className="t-req">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="t-input"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                    />
                  </div>

                  <div className="t-field">
                    <label className="t-label" htmlFor="role">
                      Job Title / Role
                    </label>
                    <input
                      id="role"
                      type="text"
                      className="t-input"
                      placeholder="e.g. Co-Founder & CTO"
                      value={form.role}
                      onChange={(e) => updateField('role', e.target.value)}
                    />
                  </div>
                </div>

                {/* Company & Project Grid */}
                <div className="t-grid">
                  <div className="t-field">
                    <label className="t-label" htmlFor="company">
                      Company / Organization
                    </label>
                    <input
                      id="company"
                      type="text"
                      className="t-input"
                      placeholder="e.g. Stripe, Acme AI, Google"
                      value={form.company}
                      onChange={(e) => updateField('company', e.target.value)}
                    />
                  </div>

                  <div className="t-field">
                    <label className="t-label" htmlFor="project_name">
                      Project or Scope (Optional)
                    </label>
                    <input
                      id="project_name"
                      type="text"
                      className="t-input"
                      placeholder="e.g. Enterprise RAG Chatbot"
                      value={form.project_name}
                      onChange={(e) => updateField('project_name', e.target.value)}
                    />
                  </div>
                </div>

                {/* Automated Company Logo / Headshot Section */}
                <div className="t-field t-avatar-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <label className="t-label" style={{ marginBottom: 0 }}>
                      Photo or Company Logo (Optional)
                    </label>
                    <div className="t-avatar-tabs">
                      <button
                        type="button"
                        className={`t-avatar-tab ${avatarType === 'auto' ? 'is-active' : ''}`}
                        onClick={() => setAvatarType('auto')}
                      >
                        🏢 Web Logo
                      </button>
                      <button
                        type="button"
                        className={`t-avatar-tab ${avatarType === 'upload' ? 'is-active' : ''}`}
                        onClick={() => setAvatarType('upload')}
                      >
                        📸 Upload File
                      </button>
                      <button
                        type="button"
                        className={`t-avatar-tab ${avatarType === 'url' ? 'is-active' : ''}`}
                        onClick={() => setAvatarType('url')}
                      >
                        🔗 Image URL
                      </button>
                    </div>
                  </div>

                  {/* Auto-detected logo card */}
                  {avatarType === 'auto' && (
                    <div className="t-logo-box">
                      {logoLoading ? (
                        <div className="t-logo-loading">
                          <span>🔍 Checking company logo…</span>
                        </div>
                      ) : detectedLogo ? (
                        <div className="t-logo-detected">
                          <div className="t-logo-detected__preview">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={detectedLogo.logoUrl}
                              alt={form.company || 'Company logo'}
                              className="t-logo-img"
                            />
                          </div>
                          <div className="t-logo-detected__info">
                            <div className="t-logo-detected__title">
                              Found logo for <strong>{form.company || detectedLogo.domain}</strong>
                            </div>
                            <div className="t-logo-detected__sub">
                              via web ({detectedLogo.domain})
                            </div>
                          </div>
                          <button
                            type="button"
                            className={`t-logo-use-btn ${form.avatar_url === detectedLogo.logoUrl ? 'is-selected' : ''}`}
                            onClick={() => applyCompanyLogo(detectedLogo.logoUrl)}
                          >
                            {form.avatar_url === detectedLogo.logoUrl ? '✓ Using this logo' : 'Use this logo'}
                          </button>
                        </div>
                      ) : (
                        <div className="t-logo-empty">
                          <p>
                            Type your company name above (e.g. <em>Stripe</em>, <em>Google</em>, or <em>acme.ai</em>) to automatically fetch your company&apos;s logo for free.
                          </p>
                          <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
                            <input
                              type="text"
                              className="t-input"
                              style={{ padding: '8px 12px', fontSize: '0.82rem', width: 'auto', flex: 1 }}
                              placeholder="Or enter company domain (e.g. mycompany.com)"
                              value={customDomain}
                              onChange={(e) => setCustomDomain(e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Upload option */}
                  {avatarType === 'upload' && (
                    <div className="t-upload-box">
                      <div className="t-photo-row">
                        {form.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={form.avatar_url} alt="Preview" className="t-photo-preview" />
                        ) : (
                          <div className="t-photo-placeholder">
                            {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                          </div>
                        )}
                        <div>
                          <label className="t-upload-btn">
                            {uploading ? 'Uploading…' : form.avatar_url ? 'Choose different file' : 'Upload Headshot or Logo'}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              disabled={uploading}
                              hidden
                            />
                          </label>
                          <p className="t-hint" style={{ marginTop: 4 }}>
                            JPG, PNG, or WebP up to 5MB.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Direct URL option */}
                  {avatarType === 'url' && (
                    <div className="t-url-box">
                      <input
                        type="url"
                        className="t-input"
                        placeholder="https://example.com/logo.png"
                        value={form.avatar_url}
                        onChange={(e) => updateField('avatar_url', e.target.value)}
                      />
                    </div>
                  )}

                  {/* Active Avatar Badge / Reset */}
                  {form.avatar_url && (
                    <div className="t-avatar-active-bar">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.avatar_url} alt="Selected avatar" className="t-active-avatar-thumb" />
                        <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--ink)' }}>
                          Photo/Logo active
                        </span>
                      </div>
                      <button type="button" className="t-clear-btn" onClick={clearAvatar}>
                        ✕ Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* LinkedIn Link */}
                <div className="t-field">
                  <label className="t-label" htmlFor="linkedin">
                    LinkedIn or Website Link (Optional)
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    className="t-input"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={form.linkedin_url}
                    onChange={(e) => updateField('linkedin_url', e.target.value)}
                  />
                  <span className="t-hint">
                    Adding your LinkedIn profile helps verify the authenticity of the review.
                  </span>
                </div>

                <div className="t-actions">
                  <button type="submit" className="t-submit-btn" disabled={isSubmitting || uploading}>
                    {isSubmitting ? 'Submitting Review…' : 'Submit Testimonial ↗'}
                  </button>
                  <p className="t-note">
                    Your testimonial will be reviewed before appearing on the public portfolio. Thank you!
                  </p>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </>
  )
}
