import React from 'react';

const StarRating = ({ rating, size = '16px' }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
      {/* Full Stars */}
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" style={{ width: size, height: size }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}

      {/* Half Star */}
      {hasHalfStar && (
        <svg viewBox="0 0 24 24" stroke="#F59E0B" strokeWidth="2" style={{ width: size, height: size, fill: 'none' }}>
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="transparent" stopOpacity="1" />
            </linearGradient>
          </defs>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="url(#halfGrad)" />
        </svg>
      )}

      {/* Empty Stars */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" style={{ width: size, height: size }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  );
};

export default StarRating;
