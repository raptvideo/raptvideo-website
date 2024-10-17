import React from 'react';
import ga from '../analytics/ga-init';

const Footer: React.FC = () => {
    const trackSocialEvent = ga.trackEventBuilder("Social");

    const handleContactClick = () => {
      trackSocialEvent({ action: "contact-button-click"});
      setTimeout(() => {
        window.location.href = 'mailto:contact@raptvideo.com';
      }, 500);
    };

  return (
    <footer className="footer">
      <button className="contact-button" onClick={handleContactClick}>
          Contact Us
      </button>
      <div className="social">
        <p>GET SOCIAL</p>
        <div className="social-icons">
            <a href="https://www.linkedin.com/company/raptvideo" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialEvent({ action: "linkedin-click" })}>
            <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://x.com/raptvideo" target="_blank" rel="noopener noreferrer" onClick={() => trackSocialEvent({ action: "twitter-click" })}>
            <i className="fab fa-x-twitter"></i>
            </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
