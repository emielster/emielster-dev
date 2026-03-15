import { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { supabase } from '../lib/supabase';
import './Reviews.css';

interface Review {
  id: string; name: string; role: string;
  text: string; rating: number; created_at: string;
}

const HARDCODED_REVIEWS: Review[] = [
  {
    id: 'hardcoded-1',
    name: 'troopertwixx12',
    role: 'Solo Developer / Friend',
    text: 'Very good programmer, i myself work on an app and i couldnt fix the bugs. He simply told me whats wrong and explained it in detail. I recommend him to yall.',
    rating: 5,
    created_at: '2026-01-01',
  },
];

// Arrow SVG used in buttons
function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8h10M9 4l4 4-4 4"/>
    </svg>
  );
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="star-rating">
      {[1,2,3,4,5].map(star => (
        <svg key={star} width="20" height="20" viewBox="0 0 24 24"
          fill={(hovered || value) >= star ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.5"
          className={`star ${onChange ? 'star--interactive' : ''} ${(hovered||value)>=star?'star--active':''}`}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          onClick={() => onChange?.(star)}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.created_at).toLocaleDateString('en-US', { month:'long', year:'numeric' });

  // Mouse tracking for spotlight effect
  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width)  * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    e.currentTarget.style.setProperty('--mouse-x', `${x}%`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}%`);
  }

  return (
    <article className="review-card glass-card" onMouseMove={onMouseMove}>
      <div className="review-header">
        <div className="review-avatar-placeholder">{review.name.charAt(0).toUpperCase()}</div>
        <div className="review-info">
          <h3 className="review-name">{review.name}</h3>
          <p className="review-role">{review.role}</p>
        </div>
      </div>
      <StarRating value={review.rating} />
      <p className="review-text">"{review.text}"</p>
      <div className="review-date">{date}</div>
    </article>
  );
}

type FormState = 'idle'|'submitting'|'success'|'error';

export function Reviews() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.15);
  const [reviews, setReviews]   = useState<Review[]>(HARDCODED_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [formState, setFormState] = useState<FormState>('idle');
  const [name, setName]   = useState('');
  const [role, setRole]   = useState('');
  const [text, setText]   = useState('');
  const [rating, setRating] = useState(5);

  useEffect(() => {
    async function fetchReviews() {
      const { data, error } = await supabase
        .from('reviews').select('*').eq('approved',true).order('created_at',{ascending:false});
      if (!error && data) setReviews([...HARDCODED_REVIEWS, ...data]);
    }
    fetchReviews();
  }, []);

  const duplicated = (() => {
    let arr = [...reviews];
    while (arr.length < 8) arr = [...arr, ...reviews];
    return [...arr, ...arr];
  })();

  function openForm() {
    setShowForm(true); setFormState('idle');
    setTimeout(() => setFormVisible(true), 10);
  }
  function closeForm() {
    setFormVisible(false);
    setTimeout(() => { setShowForm(false); setFormState('idle'); }, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !text.trim()) return;
    setFormState('submitting');
    const { error } = await supabase.from('reviews').insert({
      name:name.trim(), role:role.trim(), text:text.trim(), rating, approved:false,
    });
    if (error) { setFormState('error'); }
    else { setFormState('success'); setName(''); setRole(''); setText(''); setRating(5); }
  }

  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div ref={sectionRef} className={`reviews-content ${isVisible?'visible':''}`}>

          <div className="reviews-header">
            <span className="section-eyebrow">Reviews</span>
            <h2 className="section-title">
              What People <span className="text-gradient">Say</span>
            </h2>
            <p className="section-description">
              Don't just take my word for it! here's what clients and collaborators have to say.
            </p>
          </div>

          <div className="marquee-wrapper">
            <div className="marquee-track">
              {duplicated.map((review, i) => (
                <div className="marquee-item" key={`${review.id}-${i}`}>
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            <div className="marquee-fade marquee-fade--left" />
            <div className="marquee-fade marquee-fade--right" />
          </div>

          {!showForm && (
            <div className="review-cta-wrapper">
              <button className="review-cta-btn" onClick={openForm}>
                <span className="review-cta-icon">✏️</span>
                <span className="review-cta-text">Leave a review</span>
                <span className="review-cta-arrow">
                  <ArrowRight />
                </span>
              </button>
              <p className="review-cta-note">Worked with me? Let others know.</p>
            </div>
          )}

          {showForm && (
            <div className={`review-form-overlay ${formVisible?'review-form-overlay--visible':''}`}>
              <div className={`review-form-wrapper ${formVisible?'review-form-wrapper--visible':''}`}>
                {formState === 'success' ? (
                  <div className="review-form-success">
                    <span className="review-success-icon">🎉</span>
                    <h3>Thanks for your review!</h3>
                    <p>It'll show up once I approve it! (usually within a day.)</p>
                    <button className="btn-secondary" onClick={closeForm}>Close</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="review-form">
                    <div className="review-form-header">
                      <h3>Leave a review</h3>
                      <button type="button" className="review-form-close" onClick={closeForm}>✕</button>
                    </div>
                    <div className="form-row">
                      <div className="form-field">
                        <label htmlFor="review-name">Your name</label>
                        <input id="review-name" type="text" placeholder="troopertwixx12"
                          value={name} onChange={e=>setName(e.target.value)} required maxLength={60}/>
                      </div>
                      <div className="form-field">
                        <label htmlFor="review-role">Your role</label>
                        <input id="review-role" type="text" placeholder="Studio Manager"
                          value={role} onChange={e=>setRole(e.target.value)} required maxLength={60}/>
                      </div>
                    </div>
                    <div className="form-field">
                      <label>Rating</label>
                      <StarRating value={rating} onChange={setRating}/>
                    </div>
                    <div className="form-field">
                      <label htmlFor="review-text">Your review</label>
                      <textarea id="review-text" placeholder="Tell others about your experience..."
                        value={text} onChange={e=>setText(e.target.value)} required maxLength={400} rows={4}/>
                      <span className="char-count">{text.length}/400</span>
                    </div>
                    {formState==='error' && <p className="form-error">Something went wrong. Please try again.</p>}
                    <div className="form-actions">
                      <p className="form-note">Reviews are approved before going public.</p>
                      <button type="submit" className="btn-primary" disabled={formState==='submitting'}>
                        <span className="btn-text">
                          {formState==='submitting' ? 'Submitting...' : 'Submit review'}
                        </span>
                        <span className="btn-arrow"><ArrowRight /></span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}