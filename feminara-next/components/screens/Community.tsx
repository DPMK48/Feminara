'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import AppIcon from '../AppIcon';

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
}

interface Post {
  id: string;
  content: string;
  createdAt: string;
  user: { id: string; name: string };
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
}

const TOPICS = ['All', 'Wellness', 'Cycle', 'Career', 'Mindset', 'Nutrition'];

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

function PostCard({
  post,
  currentUserId,
  onLike,
}: {
  post: Post;
  currentUserId: string;
  onLike: (id: string) => void;
}) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    if (loadingComments) return;
    setLoadingComments(true);
    const res = await apiFetch(`/api/community/posts/${post.id}/comments`);
    if (res.ok) {
      const data = await res.json();
      setComments(data.comments);
    }
    setLoadingComments(false);
  };

  const toggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next && comments.length === 0) loadComments();
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);
    const res = await apiFetch(`/api/community/posts/${post.id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content: commentText }),
    });
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [...prev, data.comment]);
      setCommentText('');
    }
    setSubmitting(false);
  };

  return (
    <div className="card p-4">
      {/* Author row */}
      <div className="flex items-center gap-3 mb-3">
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            background: post.user.id === currentUserId
              ? 'linear-gradient(135deg,#2899B4,#0B4F6C)'
              : 'linear-gradient(135deg,#7CCFDE,#B0E4EF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}
        >
          {initials(post.user.name)}
        </div>
        <div style={{ flex: 1 }}>
          <p className="text-sm font-semibold" style={{ color: '#0B4F6C' }}>
            {post.user.name}
            {post.user.id === currentUserId && (
              <span
                className="ml-2 text-xs font-normal"
                style={{ color: '#7CCFDE' }}
              >
                (you)
              </span>
            )}
          </p>
          <p className="text-xs" style={{ color: '#B0E4EF' }}>{timeAgo(post.createdAt)}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#1A7A9A' }}>
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex gap-4 items-center">
        <button
          onClick={() => onLike(post.id)}
          style={{
            border: 'none', background: 'none', fontFamily: 'inherit',
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            color: post.likedByMe ? '#2899B4' : '#B0E4EF',
            fontWeight: post.likedByMe ? 600 : 400,
            transition: 'color 0.15s',
          }}
        >
          <AppIcon
            name="heart"
            size={14}
            className={post.likedByMe ? 'text-[#2899B4]' : 'text-[#B0E4EF]'}
            style={{ fill: post.likedByMe ? 'currentColor' : 'none' }}
          />
          {post.likeCount}
        </button>
        <button
          onClick={toggleComments}
          style={{
            border: 'none', background: 'none', fontFamily: 'inherit',
            fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
            color: showComments ? '#2899B4' : '#B0E4EF',
            fontWeight: showComments ? 600 : 400,
          }}
        >
          <AppIcon
            name="message"
            size={14}
            className={showComments ? 'text-[#2899B4]' : 'text-[#B0E4EF]'}
          />
          {post.commentCount + comments.filter((c) => !post.id).length}
          {post.commentCount > 0 || comments.length > 0
            ? ` ${showComments ? '▲' : '▼'}`
            : ''}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid #EBF8FC' }}>
          {loadingComments ? (
            <p className="text-xs text-center" style={{ color: '#B0E4EF' }}>Loading…</p>
          ) : (
            <div className="flex flex-col gap-2 mb-3">
              {comments.length === 0 && (
                <p className="text-xs" style={{ color: '#B0E4EF' }}>No comments yet</p>
              )}
              {comments.map((c) => (
                <div key={c.id} className="flex gap-2">
                  <div
                    style={{
                      width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg,#B0E4EF,#7CCFDE)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 10, fontWeight: 700, color: '#fff',
                    }}
                  >
                    {initials(c.user.name)}
                  </div>
                  <div
                    className="rounded-xl px-3 py-2 flex-1"
                    style={{ background: '#F5FBFD' }}
                  >
                    <p className="text-xs font-semibold mb-0.5" style={{ color: '#0B4F6C' }}>
                      {c.user.name}
                    </p>
                    <p className="text-xs" style={{ color: '#1A7A9A' }}>{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          <div className="flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment…"
              onKeyDown={(e) => e.key === 'Enter' && submitComment()}
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 10, border: '1.5px solid #B0E4EF',
                fontFamily: 'inherit', fontSize: 13, color: '#0B4F6C', outline: 'none',
                background: '#fff',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#2899B4'; }}
              onBlur={(e) => { e.target.style.borderColor = '#B0E4EF'; }}
            />
            <button
              onClick={submitComment}
              disabled={submitting || !commentText.trim()}
              style={{
                background: '#2899B4', color: '#fff', border: 'none', borderRadius: 10,
                padding: '8px 14px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', opacity: submitting || !commentText.trim() ? 0.5 : 1,
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [composing, setComposing] = useState(false);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTopic, setActiveTopic] = useState('All');

  const load = async () => {
    setLoading(true);
    const res = await apiFetch('/api/community/posts');
    if (res.ok) {
      const data = await res.json();
      setPosts(data.posts);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const submitPost = async () => {
    if (!newText.trim()) return;
    setSubmitting(true);
    const res = await apiFetch('/api/community/posts', {
      method: 'POST',
      body: JSON.stringify({ content: newText }),
    });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) => [data.post, ...prev]);
      setNewText('');
      setComposing(false);
    }
    setSubmitting(false);
  };

  const toggleLike = async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
            }
          : p
      )
    );

    const res = await apiFetch(`/api/community/posts/${postId}/like`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likedByMe: data.liked, likeCount: data.likeCount } : p
        )
      );
    }
  };

  return (
    <div className="section-scroll">
      <div className="screen-hdr" style={{ paddingTop: 28 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold" style={{ color: '#0B4F6C' }}>Community</h1>
            <p className="text-xs" style={{ color: '#7CCFDE' }}>Safe space for every woman</p>
          </div>
          <button
            onClick={() => setComposing(!composing)}
            style={{
              background: composing ? '#EBF8FC' : '#2899B4',
              color: composing ? '#2899B4' : '#fff',
              border: composing ? '1.5px solid #B0E4EF' : 'none',
              borderRadius: 12, padding: '8px 14px', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {composing ? 'Cancel' : '+ Share'}
          </button>
        </div>

        {/* Compose */}
        {composing && (
          <div className="card p-4 mb-4">
            <div className="flex gap-3 items-start">
              <div
                style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg,#2899B4,#0B4F6C)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 700, color: '#fff',
                }}
              >
                {user ? initials(user.name) : '?'}
              </div>
              <textarea
                autoFocus
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Share something with the community…"
                rows={3}
                style={{
                  flex: 1, resize: 'none', border: 'none', outline: 'none',
                  fontFamily: 'inherit', fontSize: 14, color: '#0B4F6C',
                  background: 'transparent', lineHeight: 1.6,
                }}
              />
            </div>
            <div className="flex justify-end mt-3">
              <button
                onClick={submitPost}
                disabled={submitting || !newText.trim()}
                className="btn-primary"
                style={{
                  width: 'auto', padding: '10px 24px',
                  opacity: submitting || !newText.trim() ? 0.6 : 1,
                }}
              >
                {submitting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>
        )}

        {/* Topic chips */}
        <div
          className="flex gap-2 pb-2 mb-4"
          style={{ overflowX: 'auto', scrollbarWidth: 'none' }}
        >
          {TOPICS.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTopic(t)}
              style={{
                flexShrink: 0, padding: '6px 16px', borderRadius: 20, border: 'none',
                fontFamily: 'inherit', fontSize: 12, fontWeight: 600, cursor: 'pointer',
                background: activeTopic === t ? '#2899B4' : '#EBF8FC',
                color: activeTopic === t ? '#fff' : '#1A7A9A',
                transition: 'all 0.15s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-4 animate-pulse" style={{ height: 100 }} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <AppIcon name="users" size={48} className="text-[#B0E4EF]" />
            <p className="text-sm font-medium" style={{ color: '#7CCFDE' }}>
              No posts yet — be the first to share
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id ?? ''}
                onLike={toggleLike}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
