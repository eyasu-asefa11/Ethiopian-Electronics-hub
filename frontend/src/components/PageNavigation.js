import React from 'react';
import BackButton from './BackButton';
import './PageNavigation.css';

const PageNavigation = ({ 
  pageTitle, 
  showBackButton = true, 
  backTo, 
  backText,
  actions = [],
  breadcrumbs = [],
  className = '' 
}) => {
  return (
    <div className={`page-navigation ${className}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <div className="page-navigation__breadcrumbs">
          {breadcrumbs.map((crumb, index) => (
            <span key={index} className="breadcrumb-item">
              {crumb.href ? (
                <a href={crumb.href} className="breadcrumb-link">
                  {crumb.label}
                </a>
              ) : (
                <span className="breadcrumb-current">{crumb.label}</span>
              )}
              {index < breadcrumbs.length - 1 && (
                <span className="breadcrumb-separator">/</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Page Header */}
      <div className="page-navigation__header">
        <div className="page-navigation__left">
          {showBackButton && (
            <BackButton 
              to={backTo}
              text={backText || '← Back'}
              variant="outline"
              size="medium"
              className="page-navigation__back"
            />
          )}
          <div className="page-navigation__title">
            <h1>{pageTitle}</h1>
          </div>
        </div>

        {/* Page Actions */}
        {actions.length > 0 && (
          <div className="page-navigation__actions">
            {actions.map((action, index) => (
              <button
                key={index}
                className={`page-action ${action.className || ''}`}
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <span className="action-icon">{action.icon}</span>}
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageNavigation;
