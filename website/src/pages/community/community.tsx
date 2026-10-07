import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
import { Flag, MessageSquare, Plus, RefreshCw, Search, ThumbsDown, ThumbsUp, X } from 'react-feather';
import Layout from '../../components/Layout';
import './community.css';

const communityApi = axios.create({
  baseURL: import.meta.env.VITE_COMMUNITY_API_URL || 'http://47.116.173.60:8080',
  timeout: 8000,
});

interface Post {
  id: number;
  title: string;
  content: string;
  thumbsup: number;
  dislike: number;
}

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadPosts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await communityApi.get('/v1/article/select');
      if (response.data && Array.isArray(response.data.data)) {
        const sortedPosts = [...response.data.data].sort((a: Post, b: Post) => b.id - a.id);
        setPosts(sortedPosts);
      } else {
        setError('The community feed returned an unexpected response.');
      }
    } catch {
      setError('The community feed is unavailable right now. Please try again shortly.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!query) return posts;
    return posts.filter((post) => (
      post.title.toLowerCase().includes(query) || post.content.toLowerCase().includes(query)
    ));
  }, [posts, searchInput]);

  const handleSubmitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsSaving(true);
    try {
      await communityApi.post('/v1/article/save', {
        id: 0,
        title: newTitle.trim(),
        content: newContent.trim(),
        thumbsup: 0,
        dislike: 0,
      });
      setNewTitle('');
      setNewContent('');
      setIsCreateOpen(false);
      setStatusMessage('Your post is now live in the community.');
      await loadPosts();
    } catch {
      setStatusMessage('We could not publish your post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateReaction = async (postId: number, reaction: 'like' | 'dislike') => {
    const endpoint = reaction === 'like' ? 'updateLike' : 'updateDislike';
    try {
      const response = await communityApi.post(`/v1/article/${endpoint}/${postId}`);
      if (response.data) await loadPosts();
    } catch {
      setStatusMessage('That reaction did not go through. Please try again.');
    }
  };

  const handleReportPost = (post: Post) => {
    const templateParams = {
      message: `Reported Post: Title {${post.title}}, Content {${post.content}}`,
      to_email: 'nusplanner2024@gmail.com',
    };
    emailjs.send('service_j372can', 'template_bi1g9kb', templateParams, 'PtThpNOKmxSv-C1nB')
      .then(() => setStatusMessage('Thanks. The team will review this post shortly.'))
      .catch(() => {
        setStatusMessage('We could not send that report. Please try again.');
      });
  };

  return (
    <Layout>
      <div className="page-shell community-page">
        <div className="page-heading community-heading">
          <div>
            <p className="page-eyebrow">Student to student</p>
            <h1>Community board</h1>
            <p className="page-description">Swap planning tips, ask for course advice, and learn from people who have been there.</p>
          </div>
          <button className="primary-button" type="button" onClick={() => setIsCreateOpen(true)}>
            <Plus size={17} /> New post
          </button>
        </div>

        <div className="community-toolbar surface-card">
          <label className="community-search">
            <Search size={18} aria-hidden="true" />
            <span className="sr-only">Search community posts</span>
            <input
              type="search"
              placeholder="Search discussions"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </label>
          <span className="community-count">{filteredPosts.length} {filteredPosts.length === 1 ? 'discussion' : 'discussions'}</span>
          <button className="icon-button" type="button" onClick={loadPosts} aria-label="Refresh community posts">
            <RefreshCw size={17} className={isLoading ? 'is-spinning' : ''} />
          </button>
        </div>

        {statusMessage && (
          <div className="community-status" role="status">
            <span>{statusMessage}</span>
            <button type="button" onClick={() => setStatusMessage('')} aria-label="Dismiss message"><X size={16} /></button>
          </div>
        )}

        <div className="community-feed" aria-live="polite">
          {isLoading && posts.length === 0 ? (
            [0, 1, 2].map((item) => <div className="community-skeleton surface-card" key={item} />)
          ) : error ? (
            <div className="community-empty surface-card">
              <MessageSquare size={30} />
              <h2>We could not load the board</h2>
              <p>{error}</p>
              <button className="secondary-button" type="button" onClick={loadPosts}>Try again</button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="community-empty surface-card">
              <Search size={30} />
              <h2>No discussions match that search</h2>
              <p>Try a module code, topic, or a broader phrase.</p>
              <button className="secondary-button" type="button" onClick={() => setSearchInput('')}>Clear search</button>
            </div>
          ) : filteredPosts.map((post, index) => (
            <article key={post.id} className="community-post surface-card">
              <div className="community-post-avatar" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
              <div className="community-post-body">
                <div className="community-post-meta">
                  <span>Community post</span>
                  <span>#{post.id}</span>
                </div>
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <div className="community-post-actions">
                  <button type="button" onClick={() => updateReaction(post.id, 'like')} aria-label={`Like ${post.title}`}>
                    <ThumbsUp size={16} /> {post.thumbsup}
                  </button>
                  <button type="button" onClick={() => updateReaction(post.id, 'dislike')} aria-label={`Dislike ${post.title}`}>
                    <ThumbsDown size={16} /> {post.dislike}
                  </button>
                  <button className="community-report" type="button" onClick={() => handleReportPost(post)}>
                    <Flag size={15} /> Report
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {isCreateOpen && (
          <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsCreateOpen(false);
          }}>
            <section className="community-dialog" role="dialog" aria-modal="true" aria-labelledby="create-post-title">
              <div className="community-dialog-heading">
                <div>
                  <p className="page-eyebrow">Start a discussion</p>
                  <h2 id="create-post-title">Share with the community</h2>
                </div>
                <button className="icon-button" type="button" onClick={() => setIsCreateOpen(false)} aria-label="Close dialog"><X size={18} /></button>
              </div>
              <form onSubmit={handleSubmitPost}>
                <label>
                  Title
                  <input value={newTitle} onChange={(event) => setNewTitle(event.target.value)} placeholder="What would you like to discuss?" autoFocus maxLength={140} required />
                </label>
                <label>
                  Details
                  <textarea value={newContent} onChange={(event) => setNewContent(event.target.value)} placeholder="Add the context that will help others respond…" rows={7} required />
                </label>
                <div className="community-dialog-actions">
                  <button className="secondary-button" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</button>
                  <button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Publishing…' : 'Publish post'}</button>
                </div>
              </form>
            </section>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Community;
