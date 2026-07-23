import { useState } from 'react';
import { supabasePublic } from '../lib/supabasePublic';

export default function FeedbackForm({ path }) {
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setStatus('submitting');
    const { error } = await supabasePublic.from('feedback').insert({
      path: path || window.location.pathname,
      name: name.trim() || null,
      message: message.trim(),
    });

    if (error) {
      console.error('Feedback error:', error);
      setStatus('error');
    } else {
      setStatus('success');
      setMessage('');
      setName('');
    }
  };

  return (
    <div className="feedback-form" style={{ marginTop: '40px', padding: '24px', background: 'var(--paper)', borderRadius: '12px', border: '1px solid var(--line)' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '1.25rem', color: 'var(--ink)' }}>Was this helpful? Leave a thought.</h3>
      
      {status === 'success' ? (
        <p style={{ color: 'green', fontWeight: 'bold' }}>Thank you for your feedback!</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What did you think?"
            required
            rows={4}
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', resize: 'vertical', width: '100%', fontFamily: 'inherit' }}
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--line)', width: '100%', fontFamily: 'inherit' }}
          />
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="button button__black"
            style={{ alignSelf: 'flex-start', opacity: status === 'submitting' ? 0.7 : 1 }}
          >
            {status === 'submitting' ? 'Sending...' : 'Send Feedback'}
          </button>
          
          {status === 'error' && <p style={{ color: 'red', margin: 0 }}>Something went wrong. Please try again.</p>}
        </form>
      )}
    </div>
  );
}
