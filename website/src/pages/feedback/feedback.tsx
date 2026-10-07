import React, { FormEvent, useState } from 'react';
import emailjs from 'emailjs-com';
import { AlertCircle, ArrowRight, CheckCircle, MessageCircle, Send, Zap } from 'react-feather';
import Layout from '../../components/Layout';
import './feedback.css';

const feedbackOptions = [
  {
    type: 'Report',
    title: 'Report an issue',
    description: 'Something did not work the way you expected.',
    icon: AlertCircle,
  },
  {
    type: 'Suggestion',
    title: 'Suggest an improvement',
    description: 'You have an idea that could make planning better.',
    icon: Zap,
  },
  {
    type: 'Other',
    title: 'Share something else',
    description: 'Questions, encouragement, or anything in between.',
    icon: MessageCircle,
  },
];

const Feedback = () => {
  const [message, setMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('Suggestion');
  const [status, setStatus] = useState<{ tone: 'success' | 'error'; message: string } | null>(null);
  const [isSending, setIsSending] = useState(false);

  const getPlaceholder = () => {
    if (feedbackType === 'Report') return 'What happened? Include the page and the steps that led to the issue.';
    if (feedbackType === 'Suggestion') return 'What would you change, and how would it help your planning?';
    return 'Tell us what is on your mind.';
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setStatus({ tone: 'error', message: 'Add a little detail before sending your feedback.' });
      return;
    }

    setIsSending(true);
    setStatus(null);
    try {
      await emailjs.send(
        'service_j372can',
        'template_apwji5m',
        { message: trimmedMessage, type: feedbackType, to_email: 'nusplanner2024@gmail.com' },
        'PtThpNOKmxSv-C1nB',
      );
      setMessage('');
      setStatus({ tone: 'success', message: 'Thank you — your feedback has reached the NUSPlanner team.' });
    } catch {
      setStatus({ tone: 'error', message: 'Your message could not be sent. Please try again in a moment.' });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Layout>
      <div className="page-shell feedback-page">
        <div className="page-heading">
          <div>
            <p className="page-eyebrow">Help shape NUSPlanner</p>
            <h1>Tell us what would make planning better.</h1>
            <p className="page-description">
              NUSPlanner is student-run. Clear reports and thoughtful ideas directly influence what gets improved next.
            </p>
          </div>
        </div>

        <div className="feedback-layout">
          <section className="feedback-type-panel" aria-labelledby="feedback-type-title">
            <div className="feedback-section-heading">
              <span>01</span>
              <div>
                <h2 id="feedback-type-title">What are you sharing?</h2>
                <p>Choose the closest match so it reaches the right context.</p>
              </div>
            </div>
            <div className="feedback-options" role="radiogroup" aria-label="Feedback type">
              {feedbackOptions.map(({ type, title, description, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  className={`feedback-option${feedbackType === type ? ' is-selected' : ''}`}
                  role="radio"
                  aria-checked={feedbackType === type}
                  onClick={() => setFeedbackType(type)}
                >
                  <span className="feedback-option-icon"><Icon size={19} /></span>
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              ))}
            </div>
          </section>

          <section className="feedback-form-panel surface-card" aria-labelledby="feedback-message-title">
            <div className="feedback-section-heading">
              <span>02</span>
              <div>
                <h2 id="feedback-message-title">Add the details</h2>
                <p>The more specific you are, the easier it is for us to act.</p>
              </div>
            </div>
            <form onSubmit={handleSubmit}>
              <label htmlFor="feedback-message">Your message</label>
              <textarea
                id="feedback-message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={getPlaceholder()}
                rows={9}
              />
              <div className="feedback-form-footer">
                <span>{message.length} characters</span>
                <button className="primary-button" type="submit" disabled={isSending}>
                  {isSending ? 'Sending…' : <>Send feedback <Send size={16} /></>}
                </button>
              </div>
            </form>
            {status && (
              <div className={`feedback-status feedback-status-${status.tone}`} role="status">
                {status.tone === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                <span>{status.message}</span>
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Feedback;
