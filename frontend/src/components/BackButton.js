import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BackButton.css';

const BackButton = ({ 
  to, 
  onClick, 
  text = '← Back', 
  className = '',
  variant = 'default',
  size = 'medium',
  showOnMobile = true,
  showOnDesktop = true 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (to) {
      navigate(to);
    } else {
      navigate(-1); // Go back to previous page
    }
  };

  const buttonClasses = [
    'back-button',
    `back-button--${variant}`,
    `back-button--${size}`,
    showOnMobile ? 'back-button--mobile' : 'back-button--mobile-hidden',
    showOnDesktop ? 'back-button--desktop' : 'back-button--desktop-hidden',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      onClick={handleClick}
      aria-label="Go back"
    >
      <span className="back-button__icon">←</span>
      <span className="back-button__text">{text}</span>
    </button>
  );
};

export default BackButton;
