import { useState } from 'react'
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
  const [uploading, setUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [hoverRating, setHoverRating] = useState(0)

  const updateField = (key, val) => setForm((prev) => ({ ...prev, [key]: val }))

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
    } catch (err) {
      setError(String(err.message || err))
    } finally {
      setUploading(false)
    }
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
        <meta name="description" content="Share your experience working with Vimal Srinivasan on AI products, systems, and engineering." />
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
                Your testimonial has been safely received. I genuinely appreciate your time and kind words. It will appear on the portfolio once reviewed.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 24 }}>
                <Link href="/" className="t-btn t-btn--primary">
                  Visit Portfolio ↗
                </Link>
                <button
                  type="button"
                  className="t-btn t-btn--ghost"
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
                  }}
                >
                  Submit another note
                </button>
              </div>
            </div>
          ) : (
            <div className="t-card">
              <div className="t-intro">
                <h1 className="t-title">Share Your Experience</h1>
                <p className="t-sub">
                  Working together has been a pleasure. If you have a moment, I&apos;d love to hear your thoughts on our collaboration and the impact of the deliverables.
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
                      {form.rating === 5 && 'Exceptional (5/5)'}
                      {form.rating === 4 && 'Great (4/5)'}
                      {form.rating === 3 && 'Good (3/5)'}
                      {form.rating === 2 && 'Fair (2/5)'}
                      {form.rating === 1 && 'Needs Improvement (1/5)'}
                    </span>
                  </div>
                </div>

                {/* Testimonial message */}
                <div className="t-field">
                  <label className="t-label" htmlFor="content">
                    Testimonial / Feedback <span className="t-req">*</span>
                  </label>
                  <textarea
                    id="content"
                    className="t-textarea"
                    rows={5}
                    required
                    placeholder="How was the communication, problem-solving, and AI delivery? What results or changes did the project create for your business?"
                    value={form.content}
                    onChange={(e) => updateField('content', e.target.value)}
                  />
                </div>

                {/* Name & Role Grid */}
                <div className="t-grid">
                  <div className="t-field">
                    <label className="t-label" htmlFor="name">
                      Your Name <span className="t-req">*</span>
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
                      placeholder="e.g. SynthLabs AI"
                      value={form.company}
                      onChange={(e) => updateField('company', e.target.value)}
                    />
                  </div>

                  <div className="t-field">
                    <label className="t-label" htmlFor="project_name">
                      Project or Scope
                    </label>
                    <input
                      id="project_name"
                      type="text"
                      className="t-input"
                      placeholder="e.g. RAG Pipeline, Full-Stack App"
                      value={form.project_name}
                      onChange={(e) => updateField('project_name', e.target.value)}
                    />
                  </div>
                </div>

                {/* Photo Upload & LinkedIn */}
                <div className="t-grid">
                  <div className="t-field">
                    <label className="t-label">Your Photo or Company Logo (Optional)</label>
                    <div className="t-photo-row">
                      {form.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={form.avatar_url} alt="Preview" className="t-photo-preview" />
                      ) : (
                        <div className="t-photo-placeholder">
                          {form.name ? form.name.charAt(0).toUpperCase() : '?'}
                        </div>
                      )}
                      <label className="t-upload-btn">
                        {uploading ? 'Uploading…' : form.avatar_url ? 'Change Photo' : 'Upload Headshot'}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          disabled={uploading}
                          hidden
                        />
                      </label>
                    </div>
                  </div>

                  <div className="t-field">
                    <label className="t-label" htmlFor="linkedin">
                      LinkedIn or Profile Link (Optional)
                    </label>
                    <input
                      id="linkedin"
                      type="url"
                      className="t-input"
                      placeholder="https://linkedin.com/in/..."
                      value={form.linkedin_url}
                      onChange={(e) => updateField('linkedin_url', e.target.value)}
                    />
                  </div>
                </div>

                <div className="t-actions">
                  <button type="submit" className="t-submit-btn" disabled={isSubmitting || uploading}>
                    {isSubmitting ? 'Sending Testimonial…' : 'Submit Testimonial ↗'}
                  </button>
                  <p className="t-note">
                    Your testimonial will be reviewed before appearing on the public portfolio.
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
