"use client";

import { useMemo, useState } from "react";

type CommentItem = {
  id: string;
  name: string;
  content: string;
  createdAt: string;
};

type PostEngagementProps = {
  comments: CommentItem[];
  commentsCount: number;
  initialLiked: boolean;
  likesCount: number;
  slug: string;
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(value));
}

export function PostEngagement({ comments, commentsCount, initialLiked, likesCount, slug }: PostEngagementProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(likesCount);
  const [commentCount, setCommentCount] = useState(commentsCount);
  const [items, setItems] = useState(comments);
  const [isLiking, setIsLiking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", content: "" });

  const commentsLabel = useMemo(() => `${commentCount} comment${commentCount === 1 ? "" : "s"}`, [commentCount]);

  async function handleLike() {
    if (isLiking) return;

    // Optimistic toggle
    const wasLiked = liked;
    setIsLiking(true);
    setError(null);
    setLiked(!wasLiked);
    setLikes((current) => current + (wasLiked ? -1 : 1));

    try {
      const response = await fetch(`/api/posts/${slug}/like`, { method: "POST" });
      if (!response.ok) throw new Error("Like failed");
      const result = (await response.json()) as { liked: boolean; likesCount: number };
      setLiked(result.liked);
      setLikes(result.likesCount);
    } catch {
      // Roll back
      setLiked(wasLiked);
      setLikes((current) => current + (wasLiked ? 1 : -1));
      setError("Could not update like. Try again.");
    } finally {
      setIsLiking(false);
    }
  }

  async function handleCommentSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Comment failed");
      }

      const result = (await response.json()) as { comment: CommentItem; commentsCount: number };
      setItems((current) => [result.comment, ...current]);
      setCommentCount(result.commentsCount);
      setForm({ name: "", email: "", content: "" });
    } catch {
      setError("Comment could not be posted right now.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="post-social">
      <div className="post-social__bar">
        <button
          type="button"
          className="post-social__button"
          onClick={handleLike}
          aria-pressed={liked}
          disabled={isLiking}
        >
          <span aria-hidden="true">👍</span>
          <span>{likes}</span>
        </button>
        <a href="#comments" className="post-social__button">
          <span aria-hidden="true">💬</span>
          <span>{commentCount}</span>
        </a>
      </div>

      <div id="comments" className="panel comments-panel">
        <div className="eyebrow">Comments</div>
        <h3>{commentsLabel}</h3>
        <form onSubmit={handleCommentSubmit} className="editor-form comments-form">
          <div className="input-row comments-form__row">
            <label>
              Name
              <input
                name="name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
          </div>
          <label>
            Comment
            <textarea
              name="content"
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              required
              style={{ minHeight: 140 }}
            />
          </label>
          <button type="submit" className="primary-button comments-form__submit" disabled={isSubmitting}>
            Post comment
          </button>
        </form>

        {error ? <div className="status-note">{error}</div> : null}

        <div className="comment-list">
          {items.length ? (
            items.map((comment) => (
              <div key={comment.id} className="comment-card">
                <div className="article-meta">
                  <span>{comment.name}</span>
                  <span>{formatCommentDate(comment.createdAt)}</span>
                </div>
                <p>{comment.content}</p>
              </div>
            ))
          ) : (
            <p>No comments yet. Start the thread.</p>
          )}
        </div>
      </div>
    </section>
  );
}
