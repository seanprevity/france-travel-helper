import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToHash = () => {
  const { hash } = useLocation();

  // Scroll to element function
  const scrollToHash = (hash) => {
    if (!hash) return;
    const el = document.querySelector(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll on route hash change
  useEffect(() => {
    if (hash) {
      setTimeout(() => scrollToHash(hash), 50);
    }
  }, [hash]);

  // Scroll on same-link clicks
  useEffect(() => {
    const handleClick = (e) => {
      const anchor = e.target.closest('a[href^="/#"]');
      if (anchor) {
        const url = new URL(anchor.href);
        const targetHash = url.hash;
        if (targetHash === window.location.hash) {
          e.preventDefault(); // Prevent default jump
          scrollToHash(targetHash); // Force scroll again
        }
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
  
          // 🔧 Clean the URL after scrolling
          const cleanUrl = window.location.pathname + window.location.search;
          window.history.replaceState(null, '', cleanUrl);
        }
      }, 50);
    }
  }, [hash]);

  return null;
};

export default ScrollToHash;


