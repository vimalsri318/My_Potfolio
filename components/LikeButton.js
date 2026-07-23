import { useState, useEffect } from 'react'
import { supabasePublic } from '../lib/supabasePublic'
import { getVisitorId } from '../lib/visitor'

export default function LikeButton({ path }) {
  const [likes, setLikes] = useState(0)
  const [hasLiked, setHasLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fast local check first, then confirm against the server for this visitor.
    const likedPaths = JSON.parse(localStorage.getItem('likedPaths') || '[]')
    if (likedPaths.includes(path)) setHasLiked(true)

    async function fetchLikes() {
      // Count of likes for this page = number of unique visitors who liked
      // (the DB enforces one row per visitor per path).
      const { count } = await supabasePublic
        .from('likes')
        .select('*', { count: 'exact', head: true })
        .eq('path', path)
      if (count !== null) setLikes(count)

      // Has THIS visitor already liked (e.g. from another tab/day)?
      const visitorId = getVisitorId()
      if (visitorId) {
        const { count: mine } = await supabasePublic
          .from('likes')
          .select('*', { count: 'exact', head: true })
          .eq('path', path)
          .eq('visitor_id', visitorId)
        if (mine && mine > 0) setHasLiked(true)
      }
      setIsLoading(false)
    }

    fetchLikes()
  }, [path])

  const handleLike = async () => {
    if (hasLiked) return // one like per visitor

    // Optimistic UI update
    setLikes(prev => prev + 1)
    setHasLiked(true)

    // Remember locally for instant UX on next visit
    const likedPaths = JSON.parse(localStorage.getItem('likedPaths') || '[]')
    localStorage.setItem('likedPaths', JSON.stringify([...likedPaths, path]))

    // Persist. The unique (visitor_id, path) index means a repeat like is
    // rejected with code 23505 — which we treat as success (already liked).
    const { error } = await supabasePublic
      .from('likes')
      .insert([{ path, visitor_id: getVisitorId() }])
    if (error && error.code !== '23505') {
      // Genuine failure — roll back the optimistic update.
      console.error('like failed:', error.message)
      setLikes(prev => Math.max(0, prev - 1))
      setHasLiked(false)
      const paths = JSON.parse(localStorage.getItem('likedPaths') || '[]')
      localStorage.setItem('likedPaths', JSON.stringify(paths.filter((p) => p !== path)))
    }
  }

  if (isLoading) return null

  return (
    <button 
      onClick={handleLike} 
      className={`like-button ${hasLiked ? 'liked' : ''}`}
      disabled={hasLiked}
      aria-label="Like this page"
    >
      <span className="like-icon">{hasLiked ? '♥' : '♡'}</span>
      <span className="like-count">{likes}</span>

      <style jsx>{`
        .like-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--text-color);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }
        .like-button:hover:not(:disabled) {
          border-color: var(--primary);
          color: var(--primary);
        }
        .like-button.liked {
          color: #ef4444; /* red */
          border-color: #ef4444;
          cursor: default;
        }
        .like-icon {
          font-size: 1.1rem;
          margin-top: -2px; /* optical alignment */
        }
      `}</style>
    </button>
  )
}
