import { useScrollAnimation } from '../hooks/useScrollAnimation';
import './Reviews.css';

const reviews = [
  {
    id: 1,
    name: 'troopertwixx12',
    role: 'Solo Developer/Friend',
    avatar: 'https://cdn.discordapp.com/avatars/1345372595553439795/d268ec8a318d7b8ab5ca028a1cc2e0b4.webp?size=80',
    rating: 5,
    text: 'Very good programmer, i myself work on an app and i couldnt fix the bugs. He simply told me whats wrong and explained it in detail. I recommend him to yall.',
    date: 'January 2026',
  },
  {
    id: 2,
    name: 'Another Client',
    role: 'Studio Manager',
    avatar: 'https://via.placeholder.com/80',
    rating: 5,
    text: 'Professional, fast, and great communication. The quality of work was outstanding. Will definitely work together again!',
    date: 'December 2025',
  },
  {
    id: 3,
    name: 'Happy Customer',
    role: 'Developer',
    avatar: 'https://via.placeholder.com/80',
    rating: 5,
    text: 'Incredibly talented and easy to work with. Completed the project ahead of schedule with excellent results.',
    date: 'November 2025',
  },
  {
    id: 4,
    name: 'Game Developer',
    role: 'Project Lead',
    avatar: 'https://via.placeholder.com/80',
    rating: 5,
    text: 'Top-notch skills and attention to detail. The code was clean and well-documented. Pleasure to collaborate with!',
    date: 'October 2025',
  },
];

export function Reviews() {
  const { ref: sectionRef, isVisible } = useScrollAnimation(0.15);

  return (
    <section className="reviews" id="reviews">
      <div className="container">
        <div 
          ref={sectionRef}
          className={`reviews-content ${isVisible ? 'visible' : ''}`}
        >
          <div className="reviews-header">
            <span className="section-eyebrow">Testimonials</span>
            <h2 className="section-title">
              What People <span className="text-gradient">Say</span>
            </h2>
            <p className="section-description">
              Don't just take my word for it—here's what clients and collaborators have to say about working with me.
            </p>
          </div>

          <div className="reviews-scroll-container">
            <div className="reviews-scroll">
              {[...reviews, ...reviews].map((review, index) => (
                <article key={`${review.id}-${index}`} className="review-card glass-card">
                  <div className="review-header">
                    <div className="review-avatar">
                      <img src={review.avatar} alt={review.name} />
                    </div>
                    <div className="review-info">
                      <h3 className="review-name">{review.name}</h3>
                      <p className="review-role">{review.role}</p>
                    </div>
                  </div>
                  
                  <div className="review-rating">
                    {[...Array(review.rating)].map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  <p className="review-text">"{review.text}"</p>
                  
                  <div className="review-date">{review.date}</div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
