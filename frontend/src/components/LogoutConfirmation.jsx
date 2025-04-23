// src/components/LogoutConfirmation.jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LogoutConfirmation = ({ onConfirm, onCancel }) => {
  const { t } = useLanguage();

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h3 style={styles.title}>{t('logoutConfirm')}</h3>
        <div style={styles.buttons}>
          <button onClick={onCancel} style={styles.cancelButton}>
            {t('cancel')}
          </button>
          <button onClick={onConfirm} style={styles.confirmButton}>
            {t('logout')}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '90%',
    maxWidth: '400px',
  },
  title: {
    marginTop: 0,
    marginBottom: '1.5rem',
    textAlign: 'center',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
  },
  cancelButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  confirmButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default LogoutConfirmation;